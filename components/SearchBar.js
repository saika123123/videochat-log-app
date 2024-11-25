'use client'

export default function SearchBar() {
    return (
        <input
            type="text"
            placeholder="議事録を検索..."
            className="w-full p-2 border rounded"
            onChange={(e) => {
                const searchParams = new URLSearchParams(window.location.search)
                searchParams.set('search', e.target.value)
                const newUrl = `${window.location.pathname}?${searchParams.toString()}`
                window.history.pushState(null, '', newUrl)
            }}
        />
    )
}