
import { useState } from "react";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Package,
  CreditCard,
  Home,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  cartCount?: number;
  onSearch?: (query: string) => void;
  onHomeClick?: () => void;
  onShopClick?: () => void;
  onProductsClick?: () => void;
  onCategoriesClick?: () => void;
  onCartClick?: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onProfileClick?: () => void;
  onPaymentsClick?: () => void;
  onDashboardClick?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  userName?: string;
}

export default function Navbar({
  cartCount = 0,
  onSearch,
  onHomeClick,
  onShopClick,
  onProductsClick,
  onCategoriesClick,
  onCartClick,
  onLoginClick,
  onRegisterClick,
  onProfileClick,
  onPaymentsClick,
  onDashboardClick,
  onLogout,
  isLoggedIn = false,
  isAdmin = false,
  userName = "User",
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(searchQuery.trim());
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const navigate = (callback?: () => void) => {
    closeMenus();
    callback?.();
  };

  const handleDashboardClick = () => {
    if (isLoggedIn && isAdmin) {
      navigate(onDashboardClick);
    }
  };

  const navLinks = [
    {
      label: "Home",
      icon: Home,
      action: onHomeClick,
    },
    {
      label: "Products",
      icon: Package,
      action: onProductsClick ?? onShopClick,
    },
    {
      label: "Categories",
      icon: Package,
      action: onCategoriesClick,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate(onHomeClick)}
            className="flex shrink-0 items-center gap-2"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white">
              <Package size={23} />
            </span>
            <span className="text-xl font-bold tracking-tight text-stone-900">
              Shop<span className="text-amber-600">Sphere</span>
            </span>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => navigate(link.action)}
                className="text-sm font-medium text-stone-600 transition hover:text-amber-700"
              >
                {link.label}
              </button>
            ))}

            {/* Admin Dashboard link */}
            {isLoggedIn && isAdmin && (
              <button
                type="button"
                onClick={handleDashboardClick}
                className="flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-200"
              >
                <LayoutDashboard size={17} />
                Admin Dashboard
              </button>
            )}
          </nav>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden max-w-sm flex-1 items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-2 md:flex"
          >
            <Search size={17} className="shrink-0 text-stone-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="ml-2 w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
            />
            <button
              type="submit"
              className="ml-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              Search
            </button>
          </form>

          {/* Right-side actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(onCartClick)}
              aria-label={`Shopping cart, ${cartCount} items`}
              className="relative rounded-full p-2 text-stone-700 transition hover:bg-amber-50 hover:text-amber-700"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {!isLoggedIn ? (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => navigate(onLoginClick)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate(onRegisterClick)}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="flex max-w-52 items-center gap-2 rounded-lg px-3 py-2 text-stone-700 transition hover:bg-stone-100"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                    <User size={17} />
                  </span>
                  <span className="max-w-32 truncate text-sm font-medium">
                    {userName}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-stone-200 bg-white p-2 shadow-xl">
                    <button
                      type="button"
                      onClick={() => navigate(onProfileClick)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-100"
                    >
                      <User size={17} />
                      My Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(onPaymentsClick)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-100"
                    >
                      <CreditCard size={17} />
                      Payments
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={handleDashboardClick}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-amber-800 hover:bg-amber-50"
                      >
                        <LayoutDashboard size={17} />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="my-1 border-t border-stone-100" />

                    <button
                      type="button"
                      onClick={() => navigate(onLogout)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 lg:hidden"
            >
              {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-stone-100 py-4 lg:hidden">
            <form
              onSubmit={handleSearch}
              className="mb-3 flex items-center rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 md:hidden"
            >
              <Search size={17} className="text-stone-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products..."
                className="ml-2 w-full bg-transparent text-sm outline-none"
              />
              <button
                type="submit"
                className="text-sm font-semibold text-amber-700"
              >
                Search
              </button>
            </form>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => navigate(link.action)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                  >
                    <Icon size={18} />
                    {link.label}
                  </button>
                );
              })}

              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(onProfileClick)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-stone-700 hover:bg-stone-100"
                  >
                    <User size={18} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(onPaymentsClick)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-stone-700 hover:bg-stone-100"
                  >
                    <CreditCard size={18} />
                    Payments
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleDashboardClick}
                      className="flex items-center gap-3 rounded-lg bg-amber-100 px-3 py-3 text-left text-sm font-semibold text-amber-800 hover:bg-amber-200"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(onLogout)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(onLoginClick)}
                    className="rounded-lg px-3 py-3 text-left text-sm font-medium text-stone-700 hover:bg-stone-100 sm:hidden"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(onRegisterClick)}
                    className="rounded-lg px-3 py-3 text-left text-sm font-semibold text-amber-700 hover:bg-amber-50 sm:hidden"
                  >
                    Register
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
