// SortButton.tsx
import React from 'react';

interface SortButtonProps {
  sortOrder: 'asc' | 'desc';
  onClick: () => void; // Update this type as needed
}

const SortButton: React.FC<SortButtonProps> = ({ sortOrder, onClick }) => {
  return (
    <button className="btn btn-outline-secondary" type="button" onClick={onClick}>
      {`Сортировка (${sortOrder === 'asc' ? 'А-Я' : 'Я-А'})`}
    </button>
  );
};

export default SortButton;
