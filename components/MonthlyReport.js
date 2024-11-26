import {
    Clock,
    Frown, Loader,
    Meh,
    MessageCircle,
    Smile,
    TrendingUp,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';

export default function MonthlyReport({ userId, year, month }) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/reports/monthly?userId=${userId}&year=${year}&month=${month}`
                );
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                setReport(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId && year && month) {
            fetchReport();
        }
    }, [userId, year, month]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                エラーが発生しました: {error}
            </div>
        );
    }

    if (!report) return null;

    // 日別アクティビティデータの作成
    const dailyActivityData = Object.entries(report.summary.dailyActivity)
        .map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('ja-JP'),
            count
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 感情分析データの作成
    const emotionData = [
        {
            name: 'ポジティブ',
            value: report.summary.emotionDistribution.positive,
            icon: Smile,
            color: 'text-green-500'
        },
        {
            name: 'ニュートラル',
            value: report.summary.emotionDistribution.neutral,
            icon: Meh,
            color: 'text-gray-500'
        },
        {
            name: 'ネガティブ',
            value: report.summary.emotionDistribution.negative,
            icon: Frown,
            color: 'text-red-500'
        }
    ];

    return (
        <div className="space-y-8">
            {/* ヘッダー統計 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <MessageCircle className="w-5 h-5" />
                        <h3 className="font-medium">総発言数</h3>
                    </div>
                    <p className="text-2xl font-bold">{report.summary.totalSpeeches}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                        <Users className="w-5 h-5" />
                        <h3 className="font-medium">参加会議数</h3>
                    </div>
                    <p className="text-2xl font-bold">{report.summary.uniqueMeetings}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <h3 className="font-medium">平均単語数</h3>
                    </div>
                    <p className="text-2xl font-bold">
                        {Math.round(report.summary.averageWordsPerSpeech)}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                        <Clock className="w-5 h-5" />
                        <h3 className="font-medium">最も活発な時間帯</h3>
                    </div>
                    <p className="text-2xl font-bold">
                        {Object.entries(report.summary.timeOfDayDistribution)
                            .sort(([, a], [, b]) => b - a)[0][0]}
                    </p>
                </div>
            </div>

            {/* 日別アクティビティグラフ */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium mb-4">日別アクティビティ</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyActivityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#3b82f6"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 感情分析とトピック分布 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 感情分析 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium mb-4">感情分析</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={emotionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                        {emotionData.map(({ name, value, icon: Icon, color }) => (
                            <div key={name} className="flex items-center gap-2">
                                <Icon className={`w-5 h-5 ${color}`} />
                                <span className="text-sm">
                                    {name}: {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* トピック分布 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium mb-4">トピック分布</h3>
                    <div className="space-y-4">
                        {Object.entries(report.summary.mostActiveTopics).map(([topic, count]) => (
                            <div key={topic}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{topic}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 rounded-full h-2"
                                        style={{
                                            width: `${(count / Object.values(report.summary.mostActiveTopics)[0]) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 時間帯別分布 */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium mb-4">時間帯別の発言分布</h3>
                <div className="grid grid-cols-4 gap-4">
                    {Object.entries(report.summary.timeOfDayDistribution).map(([timeSlot, count]) => {
                        const labels = {
                            morning: '午前 (6-12時)',
                            afternoon: '午後 (12-18時)',
                            evening: '夕方 (18-24時)',
                            night: '深夜 (0-6時)'
                        };
                        return (
                            <div key={timeSlot} className="text-center">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">{labels[timeSlot]}</p>
                                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                                    <p className="text-sm text-gray-500">
                                        {Math.round((count / report.summary.totalSpeeches) * 100)}%
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 詳細な発言リスト */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium mb-4">発言詳細</h3>
                <div className="space-y-4">
                    {report.details.map((speech) => (
                        <div key={speech.id} className="border-b pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {new Date(speech.timestamp).toLocaleString('ja-JP')}
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        {speech.meeting.title || '（会議名なし）'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {speech.analysis.emotion.sentiment === 'positive' && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                                            <Smile className="w-3 h-3 mr-1" />
                                            ポジティブ
                                        </span>
                                    )}
                                    {speech.analysis.emotion.sentiment === 'negative' && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                                            <Frown className="w-3 h-3 mr-1" />
                                            ネガティブ
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-700">{speech.content}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {Object.entries(speech.analysis.topics).map(([topic, count]) => (
                                    <span
                                        key={topic}
                                        className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                                    >
                                        {topic} ({count})
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* エクスポートボタン */}
            <div className="flex justify-end">
                <button
                    onClick={() => {
                        // レポートのエクスポート機能を実装
                        const reportData = JSON.stringify(report, null, 2);
                        const blob = new Blob([reportData], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `monthly-report-${year}-${month}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    レポートをエクスポート
                </button>
            </div>
        </div>
    );
}