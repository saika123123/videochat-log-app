import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function UserSearchInput({ users, onChange }) {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (value) => {
        setSearchText(value);
        // 検索文字列を直接渡す
        onChange(value);
    };

    const handleClear = () => {
        setSearchText('');
        onChange('');
    };

    return (
        <div className="relative flex-1 min-w-[200px]">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="ユーザー名で検索..."
                    className="w-full pl-10 pr-10 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchText && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-2.5"
                    >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );
}