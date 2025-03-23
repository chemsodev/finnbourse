"use client";
import { useState } from "react";
import { FaFilter } from "react-icons/fa"; // Pour l'icône de filtre

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white">
      <div className="flex items-center border border-gray-300 rounded-[50px] p-2 w-1/2 min-w-[60vw]">
        <img
          src="/ai-upscale-spark--magnifier-zoom-view-find-search-ai.png"
          className="mx-2"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Rechercher"
          className="outline-none bg-transparent text-sm text-gray-700 w-full"
        />
        <div>
          <img src="/Vector.png" className="mx-2" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-[#15383E] text-white rounded-[50px]">
          + Ajouter
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
