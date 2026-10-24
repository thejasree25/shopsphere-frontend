
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#faf6ef]"
    >
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">

        {/* Left content */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-xs font-semibold text-amber-900 shadow-sm">
            <Sparkles size={15} />
            YOUR NEW FAVORITE STORE
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.08] tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
            Discover Your
            <span className="mt-2 block text-amber-800">
              Next Favorite.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-stone-600 sm:text-lg">
            From everyday essentials to standout styles, discover
            thoughtfully selected products that make every day
            a little better.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#products"
              className="group inline-flex items-center gap-3 rounded-full bg-amber-800 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition duration-300 hover:-translate-y-1 hover:bg-amber-900"
            >
              Shop Collection
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href="#categories"
              className="rounded-full border border-stone-300 bg-white/70 px-7 py-4 text-sm font-bold text-stone-800 transition hover:border-amber-800 hover:text-amber-800"
            >
              Explore Categories
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-3 border-t border-stone-200 pt-7">
            <div>
              <Truck size={21} className="mb-3 text-amber-800" />
              <p className="text-xs font-bold text-stone-900 sm:text-sm">
                Fast Delivery
              </p>
              <p className="mt-1 text-[11px] text-stone-500 sm:text-xs">
                To your doorstep
              </p>
            </div>

            <div>
              <ShieldCheck
                size={21}
                className="mb-3 text-amber-800"
              />
              <p className="text-xs font-bold text-stone-900 sm:text-sm">
                Secure Shopping
              </p>
              <p className="mt-1 text-[11px] text-stone-500 sm:text-xs">
                Shop confidently
              </p>
            </div>

            <div>
              <RotateCcw size={21} className="mb-3 text-amber-800" />
              <p className="text-xs font-bold text-stone-900 sm:text-sm">
                Easy Returns
              </p>
              <p className="mt-1 text-[11px] text-stone-500 sm:text-xs">
                Hassle-free support
              </p>
            </div>
          </div>
        </div>

        {/* Right image collage */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-2 top-8 h-64 w-64 rounded-full bg-amber-200/50 blur-3xl sm:h-80 sm:w-80" />

          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-10">
              <div className="group relative overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-900/5">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
                  alt="Red lifestyle sneakers"
                  className="h-52 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-64"
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-stone-800">
                  Everyday Style
                </div>
              </div>

              <div className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-900/5">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85"
                  alt="Minimal wristwatch"
                  className="h-40 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-48"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-900/5">
                <img
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85"
                  alt="Fashion handbag"
                  className="h-48 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-60"
                />
              </div>

              <div className="group relative overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-900/5">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85"
                  alt="Wireless headphones"
                  className="h-60 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-72"
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-stone-800">
                  Tech Essentials
                </div>
              </div>
            </div>
          </div>

          {/* Floating promotion */}
          <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white bg-white/95 p-4 shadow-xl sm:bottom-5 sm:left-0 sm:translate-x-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
              <Sparkles size={22} />
            </div>
            <div className="whitespace-nowrap">
              <p className="text-sm font-bold text-stone-900">
                Find your favorites
              </p>
              <p className="mt-1 text-xs text-stone-500">
                A collection picked for you
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
