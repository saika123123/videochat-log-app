// app/api/reports/monthly/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// 感情スコアを計算する簡易的な関数
// 実際の実装では、より高度な感情分析ライブラリを使用することを推奨
function analyzeEmotion(text) {
    // ポジティブ/ネガティブな単語のリスト（実際はもっと広範なリストを使用）
    const positiveWords = ['ありがとう', '素晴らしい', '良い', '賛成', '進展', '成功', '改善'];
    const negativeWords = ['問題', '課題', '難しい', '失敗', '遅延', '懸念', '不具合'];
    const neutralWords = ['検討', '確認', '報告', '実施', '予定', '開始', '終了'];

    let score = 0;
    positiveWords.forEach(word => {
        if (text.includes(word)) score += 1;
    });
    negativeWords.forEach(word => {
        if (text.includes(word)) score -= 1;
    });

    // スコアを-1から1の範囲に正規化
    const maxPossibleScore = Math.max(positiveWords.length, negativeWords.length);
    return {
        score: score / maxPossibleScore,
        sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
}

// 発言内容からトピックを抽出する関数
function extractTopics(text) {
    const topics = {
        '技術的': ['開発', 'バグ', 'コード', 'テスト', 'デプロイ', '実装'],
        'プロジェクト管理': ['スケジュール', '進捗', 'タスク', '期限', 'コスト'],
        'コミュニケーション': ['報告', '連絡', '相談', 'フィードバック', '共有'],
        '意思決定': ['決定', '承認', '判断', '選択', '方針']
    };

    const result = {};
    for (const [category, keywords] of Object.entries(topics)) {
        const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
        if (matchCount > 0) {
            result[category] = matchCount;
        }
    }
    return result;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const year = parseInt(searchParams.get('year'));
        const month = parseInt(searchParams.get('month'));

        if (!userId || !year || !month) {
            return NextResponse.json(
                { error: '必要なパラメータが不足しています' },
                { status: 400 }
            );
        }

        // 指定月の開始日と終了日を計算
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // ユーザーの発言を取得
        const speeches = await prisma.speech.findMany({
            where: {
                user: {
                    name: {
                        contains: userName
                    }
                },
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                meeting: {
                    select: {
                        title: true,
                        startTime: true
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                timestamp: 'asc'
            }
        });
        // 発言の分析
        const speechAnalysis = speeches.map(speech => ({
            ...speech,
            analysis: {
                emotion: analyzeEmotion(speech.content),
                topics: extractTopics(speech.content)
            }
        }));

        // 月次サマリーの作成
        const summary = {
            totalSpeeches: speeches.length,
            uniqueMeetings: new Set(speeches.map(s => s.meetingId)).size,
            emotionDistribution: {
                positive: 0,
                neutral: 0,
                negative: 0
            },
            topicDistribution: {},
            dailyActivity: {},
            averageWordsPerSpeech: 0,
            wordCountTrend: [],
            mostActiveTopics: {},
            timeOfDayDistribution: {
                morning: 0,   // 6-12
                afternoon: 0, // 12-18
                evening: 0,   // 18-24
                night: 0      // 0-6
            }
        };

        // 詳細な分析の実行
        let totalWords = 0;
        speechAnalysis.forEach(speech => {
            // 感情分布の集計
            summary.emotionDistribution[speech.analysis.emotion.sentiment]++;

            // トピック分布の集計
            Object.entries(speech.analysis.topics).forEach(([topic, count]) => {
                summary.topicDistribution[topic] = (summary.topicDistribution[topic] || 0) + count;
            });

            // 日別アクティビティの集計
            const date = speech.timestamp.toISOString().split('T')[0];
            summary.dailyActivity[date] = (summary.dailyActivity[date] || 0) + 1;

            // 単語数の集計
            const wordCount = speech.content.split(/\s+/).length;
            totalWords += wordCount;

            // 時間帯別の集計
            const hour = speech.timestamp.getHours();
            if (hour >= 6 && hour < 12) summary.timeOfDayDistribution.morning++;
            else if (hour >= 12 && hour < 18) summary.timeOfDayDistribution.afternoon++;
            else if (hour >= 18) summary.timeOfDayDistribution.evening++;
            else summary.timeOfDayDistribution.night++;
        });

        summary.averageWordsPerSpeech = totalWords / speeches.length;

        // トピックのランキング作成
        summary.mostActiveTopics = Object.entries(summary.topicDistribution)
            .sort(([, a], [, b]) => b - a)
            .reduce((acc, [topic, count]) => {
                acc[topic] = count;
                return acc;
            }, {});

        return NextResponse.json({
            period: {
                year,
                month,
                startDate,
                endDate
            },
            summary,
            details: speechAnalysis
        });

    } catch (error) {
        console.error('Monthly Report API Error:', error);
        return NextResponse.json(
            {
                error: 'レポートの生成に失敗しました',
                details: error.message
            },
            { status: 500 }
        );
    }
}