// SortButton.tsx
import { FC } from 'react';
import '../styles/SortButton.css';

interface SortButtonProps {
  sortOrder: string;
  onClick: () => void;
}

const SortButton: FC<SortButtonProps> = ({ sortOrder, onClick }) => {
  return (
    <div className="sort-button-container text-center">
      <button type="button" id="sort-button" onClick={onClick}>
        Сортировка: {sortOrder === 'asc' ? 'А-Я' : 'Я-А'}
      </button>
    </div>
  );
};

export default SortButton;
