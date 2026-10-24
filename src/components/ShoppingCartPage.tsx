import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";
import type { Product } from "./ProductCatalog";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ShoppingCartPageProps {
  items: CartItem[];
  onBackToShop: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ShoppingCartPage({
  items,
  onBackToShop,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: ShoppingCartPageProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const shipping = items.length === 0 || subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingProgress = Math.min((subtotal / 999) * 100, 100);

  return (
    <main className="min-h-[70vh] bg-[#fffdf8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={onBackToShop}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-amber-700"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </button>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-700">
              Your selection
            </p>
            <h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
              Shopping cart
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} />
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <ShoppingBag size={34} strokeWidth={1.6} />
            </div>

            <h2 className="text-2xl font-bold text-stone-900">
              Your cart is waiting
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
              Looks like you haven’t added anything yet. Explore the collection
              and find something you love.
            </p>

            <button
              type="button"
              onClick={onBackToShop}
              className="mt-7 rounded-full bg-stone-900 px-7 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
            >
              Explore products
            </button>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-4">
              {items.map(({ product, quantity }) => (
                <article
                  key={product.id}
                  className="group grid grid-cols-[96px_minmax(0,1fr)] gap-4 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm transition duration-300 hover:border-amber-200 hover:shadow-md sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-5 sm:p-5"
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex min-w-0 flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700 sm:text-xs">
                          {product.category}
                        </p>

                        <h2 className="line-clamp-2 font-bold text-stone-900 sm:text-lg">
                          {product.name}
                        </h2>

                        <p className="mt-2 text-base font-extrabold text-stone-900">
                          {formatPrice(product.price)}
                        </p>

                        {product.originalPrice > product.price && (
                          <p className="mt-0.5 text-xs text-stone-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Remove ${product.name}`}
                        title="Remove item"
                        className="shrink-0 rounded-full p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-stone-200 bg-[#fffdf8] p-1">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              product.id,
                              Math.max(1, quantity - 1),
                            )
                          }
                          disabled={quantity <= 1}
                          aria-label={`Decrease ${product.name} quantity`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="min-w-9 text-center text-sm font-bold tabular-nums text-stone-800">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(product.id, quantity + 1)
                          }
                          aria-label={`Increase ${product.name} quantity`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-white hover:text-amber-700"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <p className="text-sm font-extrabold text-stone-900">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-extrabold text-stone-900">
                Order summary
              </h2>

              <div className="mt-5 rounded-xl bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800">
                  <Truck size={17} className="text-amber-700" />
                  {subtotal >= 999
                    ? "You unlocked free shipping!"
                    : `Add ${formatPrice(999 - subtotal)} for free shipping`}
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
                  <div
                    className="h-full rounded-full bg-amber-600 transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-3 text-stone-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-stone-600">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "font-semibold text-emerald-700"
                        : "font-semibold text-stone-900"
                    }
                  >
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="border-t border-dashed border-stone-200 pt-4">
                  <div className="flex justify-between gap-3 text-base font-extrabold text-stone-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <p className="mt-1 text-xs text-stone-400">
                    Taxes included where applicable.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-md"
              >
                Proceed to checkout
                <ArrowLeft className="rotate-180" size={16} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
                <ShieldCheck size={15} className="text-emerald-700" />
                Secure checkout experience
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}