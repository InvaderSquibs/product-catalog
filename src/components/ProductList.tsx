import React from 'react';
import { ProductListProps } from '../types';

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onLoadMore
}) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.imageUrl} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
      ))}
      <button onClick={onLoadMore}>
        Load More
      </button>
    </div>
  );
};

export default ProductList; 