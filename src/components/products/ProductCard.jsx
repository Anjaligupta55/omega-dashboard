import React from 'react';
import { Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { getStockStatus } from '../../utils/productUtils';
import './products.css';

export const ProductCard = React.memo(({ product }) => {
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-card card">
      <div className="card-img-wrapper">
        <img src={product.thumbnail} alt={product.title} className="card-img" loading="lazy" />
        <Badge variant={stockStatus.variant} className="card-badge">{stockStatus.label}</Badge>
      </div>
      <div className="card-content">
        <div className="card-header">
          <div>
            <h3 className="card-title">{product.title}</h3>
            <span className="text-xs text-secondary capitalize">{product.category}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="card-footer">
          <span className="card-price">{formatCurrency(product.price)}</span>
          <Link to={`/products/${product.id}`}>
            <button className="btn btn-primary btn-sm rounded-full px-4">View</button>
          </Link>
        </div>
      </div>
    </div>
  );
});
