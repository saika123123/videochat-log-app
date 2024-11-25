// components/Filters.js
'use client'
import { Calendar, Search, Users2, Video, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Filters({ meetings, users }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchText, setSearchText] = useState(searchParams.get('search') || '')

    const updateFilter = (type, value) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(type, value)
        } else {
            params.delete(type)
        }
        router.push(`/?${params.toString()}`)
    }

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchText(value)
        // デバウンス処理を追加してパフォーマンスを改善
        const timeoutId = setTimeout(() => {
            updateFilter('search', value)
        }, 300)
        return () => clearTimeout(timeoutId)
    }

    const resetFilters = () => {
        setSearchText('')
        router.push('/')
    }

    // 外部からの検索パラメータの変更を監視
    useEffect(() => {
        const currentSearch = searchParams.get('search')
        if (currentSearch !== searchText) {
            setSearchText(currentSearch || '')
        }
    }, [searchParams])

    return (
        <div className="border-b bg-white">
            <div className="p-4 space-y-3">
                {/* 検索バー */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="議事録を検索..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    {searchText && (
                        <button
                            onClick={() => {
                                setSearchText('')
                                updateFilter('search', '')
                            }}
                            className="absolute right-3 top-2.5"
                        >
                            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>

                {/* フィルター */}
                <div className="flex gap-2 flex-wrap">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="date"
                            value={searchParams.get('day') || ''}
                            onChange={(e) => updateFilter('day', e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative flex-1 min-w-[200px]">
                        <Users2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <select
                            value={searchParams.get('user') || ''}
                            onChange={(e) => updateFilter('user', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">全てのユーザー</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative flex-1 min-w-[200px]">
                        <Video className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <select
                            value={searchParams.get('meeting') || ''}
                            onChange={(e) => updateFilter('meeting', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">全ての会議</option>
                            {meetings.map(meeting => (
                                <option key={meeting.id} value={meeting.id}>
                                    {meeting.title || `会議 ${meeting.id}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* リセットボタン */}
                {(searchText || searchParams.get('day') || searchParams.get('user') || searchParams.get('meeting')) && (
                    <div className="flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <X className="h-4 w-4" />
                            フィルターをリセット
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}