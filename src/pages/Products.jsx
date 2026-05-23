import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductTable } from '../components/products/ProductTable';
import { ProductCard } from '../components/products/ProductCard';
import { ProductPagination } from '../components/products/ProductPagination';
import { ColumnCustomizer } from '../components/products/ColumnCustomizer';
import { Skeleton } from '../components/ui/Skeleton';
import { productApi } from '../services/productApi';
import { useDebounce } from '../hooks/useDebounce';
import { filterProducts, sortProducts } from '../utils/productUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters from URL state
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    rating: searchParams.get('rating') || '',
    stockStatus: searchParams.get('stockStatus') || '',
    sortBy: searchParams.get('sortBy') || 'title',
    order: searchParams.get('order') || 'asc',
  };

  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 12;

  const debouncedSearch = useDebounce(filters.search, 300);

  const [columns, setColumns] = useLocalStorage('product-columns', ['image', 'name', 'category', 'price', 'stock', 'rating', 'actions']);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.getProducts({ limit: 100 }), // Get a large batch for local filtering
          productApi.getCategories()
        ]);
        setAllProducts(prodRes.products);
        setCategories(catRes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setSearchParams(prev => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      
      // Reset page when filter changes
      if (key !== 'page') {
        prev.set('page', '1');
      }
      return prev;
    });
  }, [setSearchParams]);

  // Performance Optimization: useMemo for processed products
  const processedProducts = useMemo(() => {
    let result = allProducts;
    
    if (debouncedSearch) {
      const lowerQuery = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.brand?.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    result = filterProducts(result, filters);
    result = sortProducts(result, filters.sortBy, filters.order);
    
    return result;
  }, [allProducts, debouncedSearch, filters.category, filters.rating, filters.stockStatus, filters.sortBy, filters.order]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage) || 1;
  const currentProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return processedProducts.slice(start, start + itemsPerPage);
  }, [processedProducts, page]);

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage, filter, sort, and analyze all products.</p>
        </div>
        {!isMobile && (
          <ColumnCustomizer columns={columns} onColumnsChange={setColumns} />
        )}
      </div>

      <ProductFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        categories={categories} 
      />

      {loading ? (
        <div className="card p-3">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="flex-col gap-2 flex-1">
                <Skeleton className="w-48 h-4" />
                <Skeleton className="w-32 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <h3 className="font-medium text-lg mb-2">No products found</h3>
          <p className="text-secondary mb-4">Try adjusting your search or filters.</p>
          <button 
            className="btn btn-primary btn-md"
            onClick={() => setSearchParams({})}
          >
            Clear Filters
          </button>
        </div>
      ) : isMobile ? (
        <div className="products-grid">
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <ProductTable products={currentProducts} columns={columns} />
      )}

      {!loading && currentProducts.length > 0 && (
        <ProductPagination 
          page={page} 
          totalPages={totalPages} 
          onPageChange={(newPage) => handleFilterChange('page', newPage.toString())} 
        />
      )}
    </div>
  );
};

export default Products;
