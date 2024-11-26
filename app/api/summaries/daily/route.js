// app/api/summaries/daily/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userName = searchParams.get('userName');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let where = {};

        // ユーザー名による絞り込み
        if (userName) {
            where.user = {
                name: {
                    contains: userName
                }
            };
        }

        // 日付による絞り込み
        if (startDate) {
            where.timestamp = {
                gte: new Date(startDate),
                ...(endDate && { lte: new Date(endDate) })
            };
        }

        // 発言を取得し、日付ごとにグループ化
        const speeches = await prisma.speech.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                meeting: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                timestamp: 'asc'
            }
        });

        // 日付ごとにグループ化して集計
        const dailySummaries = speeches.reduce((acc, speech) => {
            const date = speech.timestamp.toISOString().split('T')[0];

            if (!acc[date]) {
                acc[date] = {
                    date,
                    totalSpeeches: 0,
                    uniqueMeetings: new Set(),
                    speechesByUser: {},
                    topKeywords: {},
                    meetings: new Set()
                };
            }

            const summary = acc[date];
            summary.totalSpeeches++;
            summary.meetings.add(speech.meeting.title);

            // ユーザーごとの発言回数を集計
            const userName = speech.user.name;
            if (!summary.speechesByUser[userName]) {
                summary.speechesByUser[userName] = 0;
            }
            summary.speechesByUser[userName]++;

            // 簡単なキーワード抽出（単語の出現回数）
            const words = speech.content
                .split(/\s+/)
                .filter(word => word.length >= 2);
            words.forEach(word => {
                if (!summary.topKeywords[word]) {
                    summary.topKeywords[word] = 0;
                }
                summary.topKeywords[word]++;
            });

            return acc;
        }, {});

        // 集計データを整形
        const formattedSummaries = Object.values(dailySummaries).map(summary => ({
            date: summary.date,
            totalSpeeches: summary.totalSpeeches,
            uniqueMeetingsCount: summary.meetings.size,
            meetings: Array.from(summary.meetings),
            speechesByUser: summary.speechesByUser,
            // 上位10個のキーワードを抽出
            topKeywords: Object.entries(summary.topKeywords)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([word, count]) => ({ word, count }))
        }));

        return NextResponse.json(formattedSummaries);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                error: '要約データの取得に失敗しました',
                details: error.message
            },
            {
                status: 500
            }
        );
    }
}