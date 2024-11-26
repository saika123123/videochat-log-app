// app/summaries/page.js
'use client';
import { FileText, Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import DailySummary from '../../components/DailySummary';
import UserSearchInput from '../../components/UserSearchInput';


export default function SummariesPage() {
    const [userName, setUserName] = useState('');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            議事録サマリー
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
                        >
                            <Home className="w-4 h-4" />
                            <span className="text-sm font-medium">ホームへ戻る</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UserSearchInput
                            onChange={(name) => setUserName(name)}
                        />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                <DailySummary
                    userName={userName}
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                />
            </div>
        </div>
    );
}