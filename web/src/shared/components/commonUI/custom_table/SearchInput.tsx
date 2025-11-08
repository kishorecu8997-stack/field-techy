

import { Search } from "lucide-react"; // lucide-react provides nice icons

export const SearchInput = () => {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-80 bg-white shadow-sm hover:shadow transition">
      <Search className="text-gray-400 w-5 h-5 mr-2" />
      <input
        type="text"
        placeholder="Search keyword"
        className="w-full outline-none text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

