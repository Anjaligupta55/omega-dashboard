import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProductPagination = ({ page, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="pagination">
      <Button 
        variant="outline" 
        size="sm" 
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </Button>

      <div className="flex gap-1">
        {pages.map(p => {
          // simple pagination logic to avoid too many pages
          if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
            return (
              <button
                key={p}
                className={`page-num ${page === p ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            );
          }
          if (p === page - 2 || p === page + 2) {
            return <span key={p} className="text-secondary">...</span>;
          }
          return null;
        })}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
