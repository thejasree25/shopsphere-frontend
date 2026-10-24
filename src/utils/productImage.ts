
export const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/600x600?text=ShopSphere+Product";

export function getProductImage(imageUrl?: string | null): string {
  return imageUrl?.trim() || DEFAULT_PRODUCT_IMAGE;
}
