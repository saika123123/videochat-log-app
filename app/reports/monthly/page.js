// app/reports/monthly/page.js
'use client';
import { BarChart3, FileText, Home, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import MonthlyReport from '../../../components/MonthlyReport';

export default function MonthlyReportPage() {
    const [userName, setUserName] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => {
        const date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1
        };
    });
    const [showReport, setShowReport] = useState(false);

    const handleSearch = () => {
        if (userName.trim()) {
            setShowReport(true);
        }
    };

    const handleClear = () => {
        setUserName('');
        setShowReport(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            月次レポート
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/summaries"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-blue-600"
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span className="text-sm font-medium">サマリー</span>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
                        >
                            <Home className="w-4 h-4" />
                            <span className="text-sm font-medium">ホームへ戻る</span>
                        </Link>
                    </div>
                </div>

                {/* フィルター */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* ユーザー名入力 */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="ユーザー名を入力..."
                                className="w-full pl-10 pr-10 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {userName && (
                                <button
                                    onClick={handleClear}
                                    className="absolute right-3 top-2.5"
                                >
                                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* 年選択 */}
                        <select
                            value={selectedDate.year}
                            onChange={(e) => setSelectedDate(prev => ({
                                ...prev,
                                year: parseInt(e.target.value)
                            }))}
                            className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}年
                                    </option>
                                );
                            })}
                        </select>

                        {/* 月選択 */}
                        <select
                            value={selectedDate.month}
                            onChange={(e) => setSelectedDate(prev => ({
                                ...prev,
                                month: parseInt(e.target.value)
                            }))}
                            className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}月
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 検索ボタン */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSearch}
                            disabled={!userName.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            レポートを表示
                        </button>
                    </div>

                    {/* ガイダンス */}
                    {!showReport && (
                        <div className="mt-4 text-center text-gray-500">
                            ユーザー名を入力してレポートを表示します
                        </div>
                    )}
                </div>

                {/* レポートコンポーネント */}
                {showReport && userName && (
                    <MonthlyReport
                        userName={userName}
                        year={selectedDate.year}
                        month={selectedDate.month}
                    />
                )}
            </div>
        </div>
    );
}