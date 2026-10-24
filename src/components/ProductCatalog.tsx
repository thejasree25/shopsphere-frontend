
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { getProducts } from "../service/productService";
import type { Product } from "../types/Product";

export type { Product } from "../types/Product";

type ProductCatalogProps = {
  onProductSelect?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  [key: string]: unknown;
};

const fallbackImage =
  "https://placehold.co/600x400/f3f4f6/6b7280?text=Product";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

export default function ProductCatalog(props: ProductCatalogProps) {
  const [backendProducts, setBackendProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<number[]>([]);

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const products = await getProducts();

      console.log("Products received from backend:", products);

      const mappedProducts = products.map((product) => {
        const backendId = product.backendId ?? product.id;

        return {
          ...product,
          // Keep the real database ID in backendId for orders.
          // The negative display ID avoids conflicts with old demo IDs.
          id: -Math.abs(backendId),
          backendId,
          image:
            product.imageUrl?.trim() ||
            product.image?.trim() ||
            fallbackImage,
          originalPrice: product.originalPrice || product.price,
          rating: product.rating ?? 0,
          source: "backend" as const,
        };
      });

      setBackendProducts(mappedProducts);
    } catch (err) {
      console.error("Unable to load products from backend:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products from the backend."
      );
      setBackendProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  // Only show real products returned by the backend.
  const allProducts = useMemo(
    () => backendProducts,
    [backendProducts]
  );

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(allProducts.map((product) => product.category.trim()))
      )
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    ],
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      const query = searchTerm.trim().toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [allProducts, searchTerm, selectedCategory, sortBy]);

  function toggleWishlist(product: Product) {
    setWishlist((previous) =>
      previous.includes(product.id)
        ? previous.filter((id) => id !== product.id)
        : [...previous, product.id]
    );

    props.onToggleWishlist?.(product);
    props.onAddToWishlist?.(product);
  }

  function addToCart(product: Product) {
    if (props.onAddToCart) {
      props.onAddToCart(product);
    } else {
      console.warn(
        "onAddToCart was not provided by the parent component.",
        product
      );
    }
  }

  function selectProduct(product: Product) {
    props.onProductSelect?.(product);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Discover your favourites
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Our Products
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Explore products from our store.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadProducts()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh products
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products by name or category..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
              selectedCategory === category
                ? "bg-gray-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-12 text-gray-600">
          <LoaderCircle size={22} className="animate-spin" />
          <span>Loading products...</span>
        </div>
      )}

      {!loading && error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-semibold text-red-800">
            Could not load backend products
          </h3>
          <p className="mt-1 break-words text-sm text-red-700">{error}</p>
          <p className="mt-2 text-sm text-red-700">
            Check that Spring Boot is running on port 8080 and that CORS allows
            your frontend origin.
          </p>
          <button
            type="button"
            onClick={() => void loadProducts()}
            className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && (
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          <p className="text-xs text-gray-400">
            {backendProducts.length} product(s) loaded from backend
          </p>
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const outOfStock = (product.stock ?? 0) <= 0;

            return (
              <article
                key={`backend-${product.backendId ?? product.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="relative cursor-pointer overflow-hidden bg-gray-50"
                  onClick={() => selectProduct(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectProduct(product);
                    }
                  }}
                >
                  <img
                    src={product.image || fallbackImage}
                    alt={product.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {product.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-800 shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  <span className="absolute bottom-3 left-3 rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                    Store product
                  </span>

                  <button
                    type="button"
                    aria-label={
                      wishlist.includes(product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
                  >
                    <Heart
                      size={19}
                      className={
                        wishlist.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }
                    />
                  </button>
                </div>

                <div className="p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    {product.category}
                  </p>

                  <button
                    type="button"
                    onClick={() => selectProduct(product)}
                    className="block w-full text-left"
                  >
                    <h3 className="line-clamp-1 text-base font-semibold text-gray-900 hover:text-indigo-600">
                      {product.name}
                    </h3>
                  </button>

                  <p className="mt-2 min-h-10 line-clamp-2 text-sm text-gray-500">
                    {product.description || "Discover this product in our store."}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-sm text-amber-500">
                    <Star size={15} className="fill-current" />
                    <span className="font-medium text-gray-700">
                      {product.rating > 0
                        ? product.rating.toFixed(1)
                        : "Not rated"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>

                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-2 text-xs ${
                      outOfStock ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {outOfStock
                      ? "Out of stock"
                      : `Stock available: ${product.stock ?? 0}`}
                  </p>

                  <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() => addToCart(product)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <ShoppingCart size={17} />
                    {outOfStock ? "Out of stock" : "Add to Cart"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-16 text-center">
          <Search size={32} className="mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No products found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try a different search term or category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
