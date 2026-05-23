import React from 'react';
import { Star, Edit, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { getStockStatus } from '../../utils/productUtils';
import './products.css';

export const ProductTable = React.memo(({ products, columns }) => {
  return (
    <div className="table-container card">
      <table className="product-table">
        <thead>
          <tr>
            {columns.includes('image') && <th>Image</th>}
            {columns.includes('name') && <th>Product Name</th>}
            {columns.includes('category') && <th>Category</th>}
            {columns.includes('price') && <th>Price</th>}
            {columns.includes('stock') && <th>Stock Status</th>}
            {columns.includes('rating') && <th>Rating</th>}
            {columns.includes('actions') && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            
            return (
              <tr key={product.id}>
                {columns.includes('image') && (
                  <td>
                    <img src={product.thumbnail} alt={product.title} className="table-img" loading="lazy" />
                  </td>
                )}
                {columns.includes('name') && (
                  <td>
                    <div className="flex-col">
                      <span className="font-bold">{product.title}</span>
                      {product.brand && <span className="text-xs text-secondary">{product.brand}</span>}
                    </div>
                  </td>
                )}
                {columns.includes('category') && (
                  <td><span className="capitalize">{product.category}</span></td>
                )}
                {columns.includes('price') && (
                  <td className="font-medium">{formatCurrency(product.price)}</td>
                )}
                {columns.includes('stock') && (
                  <td><Badge variant={stockStatus.variant}>{stockStatus.label}</Badge></td>
                )}
                {columns.includes('rating') && (
                  <td>
                    <div className="flex items-center gap-1">
                      <Star size={16} fill="#F59E0B" color="#F59E0B" />
                      <span className="font-medium">{product.rating.toFixed(1)}</span>
                    </div>
                  </td>
                )}
                {columns.includes('actions') && (
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/products/${product.id}`}>
                        <Button variant="ghost" size="sm" className="action-btn">
                          <Eye size={16} />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
