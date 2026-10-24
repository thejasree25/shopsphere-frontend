
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface FooterProps {
  onShopClick?: () => void;
  onHomeClick?: () => void;
}

export default function Footer({
  onShopClick,
  onHomeClick,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 w-full bg-stone-950 text-stone-300">
      <div className="border-b border-stone-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Discover Something You’ll Love
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Explore our collection and find your next favorite product.
            </p>
          </div>

          <button
            type="button"
            onClick={onShopClick}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            Shop Now
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-9 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8">
        <div>
          <button
            type="button"
            onClick={onHomeClick}
            className="inline-flex items-center gap-3 text-left"
          >
            <span className="rounded-xl bg-amber-500 p-2.5 text-stone-950">
              <ShoppingBag size={24} />
            </span>
            <span className="text-2xl font-extrabold text-white">
              Shop<span className="text-amber-500">Sphere</span>
            </span>
          </button>

          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
            Your one-stop destination for discovering quality products,
            exploring new trends, and enjoying a convenient shopping
            experience.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold text-white">
            Quick Links
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <button
                type="button"
                onClick={onHomeClick}
                className="transition hover:text-amber-400"
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onShopClick}
                className="transition hover:text-amber-400"
              >
                Shop Products
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onShopClick}
                className="transition hover:text-amber-400"
              >
                Categories
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold text-white">
            Customer Service
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <a
                href="mailto:support@shopsphere.example"
                className="transition hover:text-amber-400"
              >
                Contact Support
              </a>
            </li>
            <li>
              <a
                href="mailto:support@shopsphere.example?subject=Order%20Help"
                className="transition hover:text-amber-400"
              >
                Order Help
              </a>
            </li>
            <li>
              <a
                href="mailto:support@shopsphere.example?subject=Returns"
                className="transition hover:text-amber-400"
              >
                Returns & Refunds
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold text-white">
            Get in Touch
          </h3>
          <ul className="space-y-5 text-sm">
            <li className="flex items-start gap-3">
              <Mail size={19} className="mt-0.5 shrink-0 text-amber-500" />
              <a
                href="mailto:support@shopsphere.example"
                className="break-all transition hover:text-amber-400"
              >
                Contact us by email
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={19} className="mt-0.5 shrink-0 text-amber-500" />
              <span>Customer support</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={19} className="mt-0.5 shrink-0 text-amber-500" />
              <span>Online shopping, wherever you are</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-stone-500 sm:px-6 md:flex-row md:text-left lg:px-8">
          <p>© {currentYear} ShopSphere. All rights reserved.</p>
          <p>Crafted for a better shopping experience.</p>
        </div>
      </div>
    </footer>
  );
}
