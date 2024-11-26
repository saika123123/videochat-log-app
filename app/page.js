import { BarChart3, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Filters from '../components/Filters';
import SpeechList from '../components/SpeechList';
import prisma from '../lib/prisma';

export default async function Home() {
  const meetings = await prisma.meeting.findMany({
    orderBy: { startTime: 'desc' }
  });
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* ヘッダー */}
          <header className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-white" />
                <h1 className="text-xl font-bold text-white">
                  Meeting Chat
                  <span className="ml-2 text-sm font-normal text-blue-100">- 議事録</span>
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/summaries"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm font-medium">サマリー</span>
                </Link>
                <Link
                  href="/reports/monthly"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">月次レポート</span>
                </Link>
              </div>
            </div>
          </header>

          {/* フィルター */}
          <Filters meetings={meetings} users={users} />

          {/* メッセージリスト */}
          <div className="h-[calc(100vh-220px)] overflow-y-auto bg-gray-50/50">
            <SpeechList />
          </div>
        </div>
      </div>
    </div>
  );
}