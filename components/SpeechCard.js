import { Video } from 'lucide-react'

export default function SpeechCard({ speech, isConsecutive }) {
    const timestamp = new Date(speech.timestamp)

    return (
        <div className="px-6 py-1">
            <div className={`flex ${isConsecutive ? 'mt-1' : 'mt-4'}`}>
                {/* アバター */}
                {!isConsecutive && (
                    <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-medium shadow-md">
                            {speech.user.name.charAt(0)}
                        </div>
                    </div>
                )}

                <div className="flex-1">
                    {/* ユーザー名とミーティング名 */}
                    {!isConsecutive && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{speech.user.name}</span>
                            {speech.meeting?.title && (
                                <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    <Video className="w-3 h-3 mr-1" />
                                    {speech.meeting.title}
                                </span>
                            )}
                        </div>
                    )}

                    {/* メッセージ本文 */}
                    <div className="flex items-end gap-2">
                        <div className="relative max-w-[85%]">
                            <div className="absolute left-[-8px] top-[12px] w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200"></div>
                            <div className="relative bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm border border-gray-200">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {speech.content}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">
                            {timestamp.toLocaleTimeString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
