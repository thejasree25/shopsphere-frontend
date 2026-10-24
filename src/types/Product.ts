
export interface Product {
  id: number;
  backendId?: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  imageUrl?: string;
  description?: string;
  stock?: number;
  active?: boolean;
  badge?: string;
  source?: "static" | "backend";
}

export interface BackendProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  stock?: number;
  imageUrl?: string;
  active?: boolean;
  createdAt?: string;
}
