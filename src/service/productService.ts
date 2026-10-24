
import type { Product, BackendProduct } from "../types/Product";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const PRODUCTS_URL = `${API_BASE_URL}/api/products`;

export interface ProductPayload {
  name: string;
  category: string;
  price: number;
  description?: string;
  stock?: number;
  imageUrl?: string;
  active?: boolean;
  originalPrice?: number;
  rating?: number;
  image?: string;
  badge?: string;
}

type ApiProduct = Partial<BackendProduct> & {
  productId?: number | string;
  _id?: number | string;
  productName?: string;
  categoryName?: string;
  sellingPrice?: number | string;
  originalPrice?: number | string;
  rating?: number | string;
  image?: string;
  imageURL?: string;
  data?: unknown;
  product?: unknown;
};

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

function unwrapProductList(result: unknown): ApiProduct[] {
  if (Array.isArray(result)) {
    return result as ApiProduct[];
  }

  if (result && typeof result === "object") {
    const response = result as Record<string, unknown>;

    if (Array.isArray(response.products)) {
      return response.products as ApiProduct[];
    }

    if (Array.isArray(response.data)) {
      return response.data as ApiProduct[];
    }

    if (Array.isArray(response.content)) {
      return response.content as ApiProduct[];
    }
  }

  return [];
}

function normalizeProduct(item: ApiProduct): Product {
  const id = Number(item.id ?? item.productId ?? item._id ?? 0);
  const price = Number(item.price ?? item.sellingPrice ?? 0);
  const image =
    item.imageUrl?.trim() ||
    item.imageURL?.trim() ||
    item.image?.trim() ||
    "";

  return {
    id,
    backendId: id,
    name: String(item.name ?? item.productName ?? "Unnamed product"),
    category: String(item.category ?? item.categoryName ?? "Other"),
    price,
    originalPrice: Number(item.originalPrice ?? price),
    rating: Number(item.rating ?? 0),
    image,
    imageUrl: image,
    description: String(item.description ?? ""),
    stock: Number(item.stock ?? 0),
    active: item.active !== false,
    source: "backend",
  };
}

function toBackendPayload(payload: ProductPayload) {
  return {
    name: payload.name.trim(),
    category: payload.category.trim(),
    price: Number(payload.price),
    description: payload.description ?? "",
    stock: Number(payload.stock ?? 0),
    imageUrl: (payload.imageUrl ?? payload.image ?? "").trim(),
    active: payload.active ?? true,
  };
}

export async function getProducts(): Promise<Product[]> {
  const result = await request<unknown>(PRODUCTS_URL);
  return unwrapProductList(result)
    .map(normalizeProduct)
    .filter((product) => product.id > 0 && product.active !== false);
}

export async function getProductById(id: number): Promise<Product> {
  const result = await request<ApiProduct>(`${PRODUCTS_URL}/${id}`);
  const item = (result.product ?? result.data ?? result) as ApiProduct;
  return normalizeProduct(item);
}

export async function createProduct(
  payload: ProductPayload
): Promise<Product> {
  const result = await request<ApiProduct>(PRODUCTS_URL, {
    method: "POST",
    body: JSON.stringify(toBackendPayload(payload)),
  });

  const item = (result?.product ?? result?.data ?? result) as ApiProduct;
  return normalizeProduct(item);
}

export async function updateProduct(
  id: number,
  payload: ProductPayload
): Promise<Product> {
  const result = await request<ApiProduct>(`${PRODUCTS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toBackendPayload(payload)),
  });

  const item = (result?.product ?? result?.data ?? result) as ApiProduct;
  return normalizeProduct(item);
}

export async function deleteProduct(id: number): Promise<void> {
  await request<void>(`${PRODUCTS_URL}/${id}`, {
    method: "DELETE",
  });
}

