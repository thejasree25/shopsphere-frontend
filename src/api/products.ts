
export interface BackendProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  imageUrl: string | null;
  active: boolean;
}


const API_URL = "http://localhost:8080/api/products";

export async function getProducts(): Promise<BackendProduct[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Unable to load products: ${response.status}`);
  }

  return response.json();
}
