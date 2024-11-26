import { CalendarDays, Loader, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DailySummary({ userName, startDate, endDate }) {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummaries = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (userName) params.append('userName', userName);
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);

                const response = await fetch(`/api/summaries/daily?${params}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                setSummaries(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSummaries();
    }, [userName, startDate, endDate]);

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

    return (
        <div className="space-y-6">
            {summaries.map((summary) => (
                <div
                    key={summary.date}
                    className="bg-white rounded-lg shadow-md p-6 space-y-4"
                >
                    <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-blue-500" />
                            {new Date(summary.date).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long',
                            })}
                        </h3>
                        <div className="flex items-center gap-4 text-gray-600">
                            <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {summary.totalSpeeches}件の発言
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {summary.uniqueMeetingsCount}件の会議
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 会議リスト */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">参加した会議</h4>
                            <ul className="list-disc list-inside text-gray-600 pl-2">
                                {summary.meetings.map((meeting, idx) => (
                                    <li key={idx}>{meeting || '（タイトルなし）'}</li>
                                ))}
                            </ul>
                        </div>

                        {/* ユーザーごとの発言数 */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">ユーザーごとの発言数</h4>
                            <div className="space-y-1">
                                {Object.entries(summary.speechesByUser)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([user, count]) => (
                                        <div key={user} className="flex items-center justify-between">
                                            <span className="text-gray-600">{user}</span>
                                            <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {count}回
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* キーワード分析 */}
                        <div className="md:col-span-2 space-y-2">
                            <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                よく使われたキーワード
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {summary.topKeywords.map(({ word, count }) => (
                                    <span
                                        key={word}
                                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {word} ({count})
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}