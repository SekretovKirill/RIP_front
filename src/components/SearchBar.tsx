// SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string; // new prop for the value
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value }) => {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Поиск"
        value={searchQuery}
        onChange={handleChange}
      />
      <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
        Поиск
      </button>
    </div>
  );
};

export default SearchBar;
