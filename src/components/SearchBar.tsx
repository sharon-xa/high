import { Search } from 'lucide-react';
import { useState } from 'react';

const SearchBar = () => {
    const [activeInput, setActiveInput] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className={`flex items-center py-3 px-4 bg-background rounded transition-colors border-2 ${activeInput ? "border-light-border" : "border-border"}`}
        >
            <Search
                size={20}
                style={{ marginRight: "14px" }}
                color={activeInput ? "#fff" : "#888"}
            />
            <input
                type="search"
                name="search"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-transparent border-none flex-1 outline-none text-white placeholder:text-white-50"
                onFocus={() => setActiveInput(true)}
                onBlur={() => setActiveInput(false)}
            />
        </div>
    );
};

export default SearchBar;