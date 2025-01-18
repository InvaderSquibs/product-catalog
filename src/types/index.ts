export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface ProductListProps {
  products: Product[];
  onLoadMore: () => void;
  isLoading: boolean;
}

export interface DatabaseError extends Error {
  code?: string;
} 