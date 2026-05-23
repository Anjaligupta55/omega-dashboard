import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '../ui/Button';

const allColumns = [
  { id: 'image', label: 'Image' },
  { id: 'name', label: 'Product Name' },
  { id: 'category', label: 'Category' },
  { id: 'price', label: 'Price' },
  { id: 'stock', label: 'Stock Status' },
  { id: 'rating', label: 'Rating' },
  { id: 'actions', label: 'Actions' }
];

export const ColumnCustomizer = ({ columns, onColumnsChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = (id) => {
    if (columns.includes(id)) {
      onColumnsChange(columns.filter(c => c !== id));
    } else {
      onColumnsChange([...columns, id]);
    }
  };

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
        <Settings size={16} />
        <span>Columns</span>
      </Button>

      {isOpen && (
        <div className="columns-dropdown card">
          <div className="p-3 border-b border-color">
            <h4 className="font-medium text-sm">Customize Columns</h4>
          </div>
          <div className="p-2">
            {allColumns.map(col => (
              <label key={col.id} className="column-label">
                <input 
                  type="checkbox" 
                  checked={columns.includes(col.id)}
                  onChange={() => toggleColumn(col.id)}
                  className="mr-2"
                />
                <span className="text-sm">{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
