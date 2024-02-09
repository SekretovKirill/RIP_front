import { FC, useState } from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        id="name-input"
        placeholder="Поиск"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="button" id="search-button" onClick={handleSearchClick}>
        Искать
      </button>
    </div>
  );
};

export default SearchBar;
