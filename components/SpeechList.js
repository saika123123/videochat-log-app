// components/SpeechList.js
'use client'
import { AlertCircle, Inbox } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SpeechCard from './SpeechCard'

export default function SpeechList() {
    const [speeches, setSpeeches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        const fetchSpeeches = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/speeches?${searchParams.toString()}`)
                const data = await response.json()
                setSpeeches(data)
            } catch (err) {
                setError('データの取得に失敗しました')
            } finally {
                setLoading(false)
            }
        }

        fetchSpeeches()
    }, [searchParams])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-spin"></div>
                    <div className="w-12 h-12 border-4 border-indigo-500 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-8 bg-red-50 mx-4 my-4 rounded-lg">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                {error}
            </div>
        )
    }

    let currentDate = null

    return (
        <div className="py-4">
            <div className="space-y-1">
                {speeches.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-3">
                            <Inbox className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-gray-500">議事録が見つかりません</p>
                    </div>
                ) : (
                    speeches.map((speech, index) => {
                        const messageDate = new Date(speech.timestamp).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long',
                        })
                        const showDateDivider = currentDate !== messageDate
                        if (showDateDivider) {
                            currentDate = messageDate
                        }

                        return (
                            <div key={speech.id}>
                                {showDateDivider && (
                                    <div className="flex justify-center my-6">
                                        <div className="bg-white/50 backdrop-blur-sm text-gray-600 rounded-full px-4 py-1 text-sm font-medium shadow-sm border border-gray-200">
                                            {messageDate}
                                        </div>
                                    </div>
                                )}
                                <SpeechCard
                                    speech={speech}
                                    isConsecutive={index > 0 &&
                                        speeches[index - 1].userId === speech.userId &&
                                        new Date(speech.timestamp) - new Date(speeches[index - 1].timestamp) < 300000}
                                />
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}