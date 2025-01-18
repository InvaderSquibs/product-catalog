import React, { useState, useEffect, Suspense } from 'react';
import { fetchProductPage } from '../utils/mockData';
import { Product } from '../types';
import '../styles/ProductCatalog.css';

const ProductList = React.lazy(() => import('./ProductList'));

export const ProductCatalog: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const result = await fetchProductPage(page, search);
      setProducts(prev => page === 1 ? result.data : [...prev, ...result.data]);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset and reload when search changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    loadProducts();
  }, [search]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadProducts();
    }
  }, [page]);

  return (
    <div className="product-catalog">
      <input 
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="search-input"
      />
      
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList 
          products={products}
          onLoadMore={() => setPage(p => p + 1)}
        />
      </Suspense>
    </div>
  );
}; 