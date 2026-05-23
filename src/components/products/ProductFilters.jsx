import React from 'react';
import { Search } from 'lucide-react';
import './products.css';

export const ProductFilters = ({ filters, onFilterChange, categories }) => {
  return (
    <div className="filters-bar">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search products..." 
          className="input search-input-field"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="filters-group">
        <select 
          className="input filter-select"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        <select 
          className="input filter-select"
          value={filters.stockStatus}
          onChange={(e) => onFilterChange('stockStatus', e.target.value)}
        >
          <option value="">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <select 
          className="input filter-select"
          value={filters.rating}
          onChange={(e) => onFilterChange('rating', e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>

        <select 
          className="input filter-select"
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            onFilterChange('sortBy', sortBy);
            onFilterChange('order', order);
          }}
        >
          <option value="title-asc">Name (A-Z)</option>
          <option value="title-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low-High)</option>
          <option value="price-desc">Price (High-Low)</option>
          <option value="rating-desc">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};
