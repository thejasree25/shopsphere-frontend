
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "./ProductCatalog";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const productImages: Record<number, string[]> = {
  1: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=90",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85",
  ],
  2: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=90",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=85",
  ],
  3: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=90",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=85",
  ],
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  const images = productImages[product.id] ?? [product.image];
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="min-h-screen bg-[#fffdf8] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-amber-50 hover:text-amber-800"
        >
          <ArrowLeft size={17} />
          Back to products
        </button>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product image gallery */}
          <div className="animate-[categoryEnter_0.5s_ease-out_both]">
            <div className="group relative aspect-square overflow-hidden rounded-3xl bg-stone-100">
              <img
                key={images[selectedImage]}
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {discount > 0 && (
                <span className="absolute left-5 top-5 rounded-full bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
                  SAVE {discount}%
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label={
                  isFavorite ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`absolute right-5 top-5 grid size-12 place-items-center rounded-full shadow-md transition-all duration-300 hover:scale-110 ${
                  isFavorite
                    ? "bg-rose-500 text-white"
                    : "bg-white/90 text-stone-700 hover:bg-white"
                }`}
              >
                <Heart
                  size={21}
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  className={`aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                    selectedImage === index
                      ? "border-amber-600 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center animate-[categoryEnter_0.6s_ease-out_both]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-800">
              {product.category}
            </p>

            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2">
                <Star size={16} fill="#d97706" className="text-amber-600" />
                <span className="text-sm font-bold text-stone-900">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-stone-500">
                Customer rating
              </span>
              <span className="h-4 w-px bg-stone-300" />
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={16} />
                Available to order
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-black text-stone-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
              Meet your new everyday favorite. Carefully selected for its
              style, quality, and practicality, this product is a great
              addition to your collection.
            </p>

            <div className="my-8 h-px bg-stone-200" />

            {/* Quantity selector */}
            <div>
              <p className="mb-3 text-sm font-bold text-stone-900">
                Quantity
              </p>

              <div className="inline-flex items-center overflow-hidden rounded-xl border border-stone-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="grid size-12 place-items-center text-stone-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-12 text-center text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(10, current + 1))}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                  className="grid size-12 place-items-center text-stone-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="mt-2 text-xs text-stone-400">
                Maximum 10 units per selection
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-amber-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-stone-600">
                  Total for {quantity} {quantity === 1 ? "item" : "items"}
                </span>
                <span className="text-xl font-black text-stone-900">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`mt-5 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                added
                  ? "bg-emerald-700"
                  : "bg-stone-900 hover:bg-amber-700"
              }`}
            >
              {added ? <CheckCircle2 size={19} /> : <ShoppingCart size={19} />}
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-stone-200/80 p-3">
                <Truck size={20} className="shrink-0 text-amber-800" />
                <div>
                  <p className="text-xs font-bold text-stone-900">Delivery</p>
                  <p className="mt-1 text-[10px] text-stone-500">Details at checkout</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-stone-200/80 p-3">
                <ShieldCheck size={20} className="shrink-0 text-amber-800" />
                <div>
                  <p className="text-xs font-bold text-stone-900">Secure</p>
                  <p className="mt-1 text-[10px] text-stone-500">Safe shopping</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-stone-200/80 p-3">
                <RotateCcw size={20} className="shrink-0 text-amber-800" />
                <div>
                  <p className="text-xs font-bold text-stone-900">Returns</p>
                  <p className="mt-1 text-[10px] text-stone-500">Policy at checkout</p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-stone-400">
              Product descriptions, inventory, delivery estimates, and return
              policies will be connected to the backend later.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
