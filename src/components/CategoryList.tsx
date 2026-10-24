
import {
  Laptop,
  Shirt,
  House,
  Sparkles,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets, smart devices and accessories.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85",
    icon: Laptop,
    count: "Smart technology",
  },
  {
    id: 2,
    name: "Fashion",
    description: "Trending clothing, footwear and accessories.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
    icon: Shirt,
    count: "New season styles",
  },
  {
    id: 3,
    name: "Home & Living",
    description: "Furniture, decor and essentials for your home.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    icon: House,
    count: "Beautiful living",
  },
  {
    id: 4,
    name: "Beauty",
    description: "Skincare, makeup and personal care products.",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
    icon: Sparkles,
    count: "Your beauty essentials",
  },
];

interface CategoryListProps {
  onSelectCategory?: (categoryName: string) => void;
}

export default function CategoryList({
  onSelectCategory,
}: CategoryListProps) {
  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-[#fffdf8] px-5 py-20 sm:px-8 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-32 top-32 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-bold tracking-[0.22em] text-amber-900">
            <ShoppingBag size={14} />
            FIND YOUR STYLE
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            Shop by{" "}
            <span className="text-amber-800">Category</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-stone-500 sm:text-base">
            Explore our top categories and find the things you
            love, all in one place.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory?.(category.name)}
                className="group relative animate-[categoryEnter_0.6s_ease-out_both] overflow-hidden rounded-[1.5rem] border border-stone-200/80 bg-white p-3 text-left shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-amber-600 hover:shadow-[0_22px_55px_-20px_rgba(120,53,15,0.25)] focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-[1.1rem] bg-stone-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-48 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-44"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                  <span className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-wide text-stone-800 backdrop-blur-md">
                    {category.count}
                  </span>
                </div>

                {/* Floating category icon */}
                <div className="relative -mt-6 ml-4 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white bg-amber-800 text-white shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-stone-900">
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                {/* Card content */}
                <div className="px-4 pb-3 pt-3">
                  <h3 className="text-lg font-bold tracking-tight text-stone-900 transition-colors duration-300 group-hover:text-amber-800">
                    {category.name}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-stone-500">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-stone-800 transition-colors group-hover:text-amber-800">
                      Explore
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f1e7] text-amber-900 transition-all duration-300 group-hover:bg-amber-800 group-hover:text-white">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-amber-700 transition-all duration-500 group-hover:w-full" />
              </button>
            );
          })}
        </div>

        {/* Bottom message */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm text-stone-500">
          <Sparkles size={16} className="text-amber-700" />
          <span>Something special for every style and every day.</span>
        </div>
      </div>
    </section>
  );
}
