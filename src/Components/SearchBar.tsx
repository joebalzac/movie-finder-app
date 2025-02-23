import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) {
      onSearch(search);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white p-2 rounded-full shadow-md">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 text-gray-800 bg-transparent border-none outline-none focus:ring-0"
      />
      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-indigo-600 text-white rounded-full transition-all duration-300 hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
