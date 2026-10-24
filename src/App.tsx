
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryList from "./components/CategoryList";
import ProductCatalog, { type Product } from "./components/ProductCatalog";
import ProductDetails from "./components/ProductDetails";
import ShoppingCartPage, {
  type CartItem,
} from "./components/ShoppingCartPage";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentsPage from "./pages/PaymentsPage";
import "./App.css";
import Footer from "./components/Footer";
import {
  getCurrentUser,
  logoutUser,
  type ShopSphereUser,
} from "./utils/auth";

type Page =
  | "shop"
  | "cart"
  | "login"
  | "register"
  | "profile"
  | "dashboard"
  | "payments"
  | "payment-history"
  | "product-details";

type PaymentRecord = {
  id: string;
  userEmail: string;
  date: string;
  amount: number;
  status: string;
  paymentMethod: string;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
};

const PAYMENT_STORAGE_KEY = "shopspherePayments";

function loadPayments(): PaymentRecord[] {
  try {
    const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (payment): payment is PaymentRecord =>
        payment !== null &&
        typeof payment === "object" &&
        typeof payment.id === "string" &&
        typeof payment.userEmail === "string" &&
        typeof payment.date === "string" &&
        typeof payment.amount === "number" &&
        typeof payment.status === "string" &&
        typeof payment.paymentMethod === "string" &&
        Array.isArray(payment.items)
    );
  } catch {
    return [];
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("shop");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [currentUser, setCurrentUser] =
    useState<ShopSphereUser | null>(() => getCurrentUser());

  const [completedPayment, setCompletedPayment] =
    useState<PaymentRecord | null>(null);

  const [payments, setPayments] =
    useState<PaymentRecord[]>(loadPayments);

  const [paymentToDelete, setPaymentToDelete] =
    useState<string | null>(null);

  const [paymentMessage, setPaymentMessage] = useState("");

  const isLoggedIn = Boolean(currentUser);

  const role = String(currentUser?.role ?? "")
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase();

  const isAdmin =
    Boolean(currentUser) &&
    (role === "ADMIN" ||
      currentUser?.email?.trim().toLowerCase() === "admin@gmail.com");

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const shipping =
    subtotal === 0 || subtotal >= 999 ? 0 : 49;

  const total = subtotal + shipping;

  useEffect(() => {
    try {
      localStorage.setItem(
        PAYMENT_STORAGE_KEY,
        JSON.stringify(payments)
      );
    } catch {
      setPaymentMessage(
        "Unable to save payment history in this browser."
      );
    }
  }, [payments]);

  // Do not allow a non-admin to remain on the admin dashboard.
  useEffect(() => {
    if (currentPage === "dashboard" && !isAdmin) {
      setCurrentPage("shop");
    }
  }, [currentPage, isAdmin]);

  // Payment history and checkout require a signed-in user.
  useEffect(() => {
    if (
      !isLoggedIn &&
      (currentPage === "payment-history" ||
        currentPage === "payments" ||
        currentPage === "profile")
    ) {
      setCurrentPage("login");
    }
  }, [isLoggedIn, currentPage]);

  // Read the logged-in user and identify the admin account.
  function handleLoginSuccess() {
    const user = getCurrentUser();

    if (!user) {
      window.alert(
        "Login could not be completed. Please try logging in again."
      );
      return;
    }

    setCurrentUser(user);

    const userRole = String(user.role ?? "")
      .replace(/^ROLE_/i, "")
      .trim()
      .toUpperCase();

    const isAdminUser =
      userRole === "ADMIN" ||
      user.email?.trim().toLowerCase() === "admin@gmail.com";

    setCurrentPage(isAdminUser ? "dashboard" : "shop");
  }

  function handleRegisterSuccess() {
    setCurrentPage("login");
  }

  function handleLogout() {
    logoutUser();
    setCurrentUser(null);
    setSelectedProduct(null);
    setCompletedPayment(null);
    setPaymentToDelete(null);
    setPaymentMessage("");
    setCurrentPage("shop");
  }

  function handleAddToCart(product: Product) {
    setCart((previous) => {
      const existing = previous.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return previous.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { product, quantity: 1 }];
    });

    setSelectedProduct(null);
    setCurrentPage("cart");
  }

  function handleUpdateQuantity(
    productId: number,
    quantity: number
  ) {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    setCart((previous) =>
      previous.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  function handleRemoveFromCart(productId: number) {
    setCart((previous) =>
      previous.filter(
        (item) => item.product.id !== productId
      )
    );
  }

  function handleCheckout() {
    if (!currentUser) {
      setCurrentPage("login");
      return;
    }

    if (cart.length === 0) {
      window.alert("Your cart is empty.");
      return;
    }

    setCompletedPayment(null);
    setCurrentPage("payments");
  }

  function handleVerifiedPayment(paymentId: string) {
    const existingPayment = payments.find(
      (payment) => payment.id === paymentId
    );

    if (existingPayment) {
      setCompletedPayment(existingPayment);
      setCart([]);
      setCurrentPage("payments");
      return;
    }

    const record: PaymentRecord = {
      id: paymentId,
      userEmail: String(currentUser?.email ?? ""),
      date: new Date().toISOString(),
      amount: total,
      status: "SUCCESS",
      paymentMethod: "Razorpay Test Checkout",
      items: cart.map((item) => ({
        productId: Number(item.product.id),
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
      })),
    };

    setPayments((previous) => [record, ...previous]);
    setCompletedPayment(record);
    setCart([]);
    setCurrentPage("payments");
  }

  function handleDeletePayment(paymentId: string) {
    const payment = payments.find(
      (item) => item.id === paymentId
    );

    if (!payment) {
      setPaymentToDelete(null);
      return;
    }

    const userEmail = String(currentUser?.email ?? "")
      .toLowerCase();

    if (payment.userEmail.toLowerCase() !== userEmail) {
      setPaymentMessage(
        "You can only delete payment history belonging to your account."
      );
      setPaymentToDelete(null);
      return;
    }

    setPayments((previous) =>
      previous.filter((item) => item.id !== paymentId)
    );

    if (completedPayment?.id === paymentId) {
      setCompletedPayment(null);
    }

    setPaymentMessage("Payment history record deleted.");
    setPaymentToDelete(null);
  }

  function scrollToSection(id: string) {
    setCurrentPage("shop");

    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  const userPayments = payments
    .filter(
      (payment) =>
        payment.userEmail.toLowerCase() ===
        String(currentUser?.email ?? "").toLowerCase()
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  function renderPaymentSuccess() {
    if (!completedPayment) {
      return null;
    }

    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-amber-900 to-stone-800 px-6 py-10 text-center text-white sm:px-12">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-8 ring-white/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-11 w-11"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  d="m5 12 4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">
              Payment confirmed
            </p>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Thank you for your order!
            </h1>

            <p className="mt-3 text-amber-100">
              Your payment was successfully verified.
            </p>

            <p className="mt-6 text-4xl font-extrabold">
              ₹{completedPayment.amount.toFixed(2)}
            </p>
          </div>

          <div className="p-6 sm:p-9">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Payment ID
                </p>
                <p className="mt-2 break-all text-sm font-bold text-stone-900">
                  {completedPayment.id}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Payment status
                </p>
                <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                  {completedPayment.status}
                </span>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Date
                </p>
                <p className="mt-2 text-sm font-semibold text-stone-900">
                  {new Date(completedPayment.date).toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Payment method
                </p>
                <p className="mt-2 text-sm font-semibold text-stone-900">
                  {completedPayment.paymentMethod}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold text-stone-900">
                Order summary
              </h2>

              <div className="mt-4 divide-y divide-stone-100 rounded-2xl border border-stone-100">
                {completedPayment.items.map((item, index) => (
                  <div
                    key={`${completedPayment.id}-${item.productId}-${index}`}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-stone-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-stone-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setCompletedPayment(null);
                  setCurrentPage("shop");
                  setSelectedProduct(null);
                }}
                className="flex-1 rounded-xl bg-amber-900 px-6 py-3.5 font-bold text-white transition hover:bg-amber-950 focus:outline-none focus:ring-4 focus:ring-amber-200"
              >
                Continue shopping
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMessage("");
                  setCurrentPage("payment-history");
                }}
                className="flex-1 rounded-xl border border-stone-300 bg-white px-6 py-3.5 font-bold text-stone-800 transition hover:border-amber-400 hover:bg-amber-50"
              >
                View payment history
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Navbar
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        userName={
          currentUser?.name ||
          currentUser?.email ||
          "User"
        }
        onHomeClick={() => scrollToSection("home")}
        onShopClick={() => scrollToSection("products")}
        onProductsClick={() => scrollToSection("products")}
        onCategoriesClick={() => scrollToSection("categories")}
        onCartClick={() => setCurrentPage("cart")}
        onLoginClick={() => setCurrentPage("login")}
        onRegisterClick={() => setCurrentPage("register")}
        onPaymentsClick={() => {
          setPaymentMessage("");
          setCurrentPage(
            isLoggedIn ? "payment-history" : "login"
          );
        }}
        onDashboardClick={() => {
          const user = getCurrentUser();

          const userRole = String(user?.role ?? "")
            .replace(/^ROLE_/i, "")
            .trim()
            .toUpperCase();

          if (
            user &&
            (userRole === "ADMIN" ||
              user.email?.trim().toLowerCase() === "admin@gmail.com")
          ) {
            setCurrentUser(user);
            setCurrentPage("dashboard");
          }
        }}
        onProfileClick={() => {
          setCurrentPage(isLoggedIn ? "profile" : "login");
        }}
        onLogout={handleLogout}
      />

      {currentPage === "shop" && (
        <>
          <section id="home">
            <Hero onShopNow={() => scrollToSection("products")} />
          </section>

          <section id="categories">
            <CategoryList
              onCategoryClick={() => scrollToSection("products")}
            />
          </section>

          <section id="products">
            <ProductCatalog
              onProductSelect={(product: Product) => {
                setSelectedProduct(product);
                setCurrentPage("product-details");
              }}
              onAddToCart={handleAddToCart}
            />
          </section>
        </>
      )}

      {currentPage === "product-details" && selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onBack={() => setCurrentPage("shop")}
        />
      )}

      {currentPage === "cart" && (
        <ShoppingCartPage
          items={cart}
          onBackToShop={() => setCurrentPage("shop")}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={() => setCart([])}
          onCheckout={handleCheckout}
        />
      )}

      {currentPage === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setCurrentPage("register")}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onLoginClick={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "profile" && isLoggedIn && (
        <main className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-stone-900">
            My Profile
          </h1>

          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p>
              <strong>Name:</strong>{" "}
              {currentUser?.name || "Not available"}
            </p>
            <p>
              <strong>Email:</strong> {currentUser?.email}
            </p>
            <p>
              <strong>Role:</strong> {isAdmin ? "Admin" : "Customer"}
            </p>
          </div>
        </main>
      )}

      {currentPage === "payments" && isLoggedIn && (
        completedPayment ? (
          renderPaymentSuccess()
        ) : (
          <PaymentsPage
            items={cart}
            userEmail={String(currentUser?.email ?? "")}
            onBack={() => setCurrentPage("cart")}
            onPaymentSuccess={handleVerifiedPayment}
          />
        )
      )}

      {currentPage === "payment-history" && isLoggedIn && (
        <main className="mx-auto max-w-5xl px-4 py-10">
          <button
            type="button"
            onClick={() => {
              setPaymentMessage("");
              setCurrentPage("shop");
            }}
            className="mb-6 rounded-lg px-3 py-2 text-sm font-bold text-amber-900 transition hover:bg-amber-100"
          >
            ← Continue shopping
          </button>

          <div className="mb-8 rounded-2xl bg-gradient-to-r from-amber-900 to-stone-800 p-7 text-white shadow-lg sm:p-9">
            <p className="text-sm font-semibold text-amber-100">
              YOUR ACCOUNT
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">
              Payment History
            </h1>
            <p className="mt-2 text-amber-100">
              Review your completed ShopSphere payments.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-xs font-medium text-amber-100">
                  Total records
                </p>
                <p className="mt-1 text-2xl font-extrabold">
                  {userPayments.length}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-xs font-medium text-amber-100">
                  Successful payments
                </p>
                <p className="mt-1 text-2xl font-extrabold">
                  {
                    userPayments.filter(
                      (payment) =>
                        payment.status.toUpperCase() === "SUCCESS"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          {paymentMessage && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
            >
              <div className="flex items-center justify-between gap-3">
                <span>{paymentMessage}</span>
                <button
                  type="button"
                  onClick={() => setPaymentMessage("")}
                  className="font-bold text-amber-900"
                  aria-label="Dismiss message"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {userPayments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-900">
                ₹
              </div>
              <h2 className="mt-5 text-xl font-bold text-stone-900">
                No payment history yet
              </h2>
              <p className="mt-2 text-stone-500">
                Verified payments will appear here after checkout.
              </p>
              <button
                type="button"
                onClick={() => setCurrentPage("shop")}
                className="mt-6 rounded-xl bg-amber-900 px-5 py-3 font-bold text-white transition hover:bg-amber-950"
              >
                Explore products
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {userPayments.map((payment) => (
                <article
                  key={payment.id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-amber-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Payment reference
                      </p>
                      <h2 className="mt-1 break-all font-bold text-stone-900">
                        {payment.id}
                      </h2>
                      <p className="mt-2 text-sm text-stone-500">
                        {new Date(payment.date).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {payment.paymentMethod}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-stone-900">
                        ₹{payment.amount.toFixed(2)}
                      </p>
                      <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {payment.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-stone-100 pt-4">
                    <p className="mb-3 text-sm font-bold text-stone-800">
                      Items purchased
                    </p>

                    {payment.items.map((item, index) => (
                      <div
                        key={`${payment.id}-${item.productId}-${index}`}
                        className="flex justify-between gap-4 py-2 text-sm"
                      >
                        <span className="text-stone-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="shrink-0 font-semibold text-stone-900">
                          ₹{(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col justify-between gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center">
                    <p className="text-xs text-stone-500">
                      Payment history record
                    </p>

                    {paymentToDelete === payment.id ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-stone-700">
                          Delete this record?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeletePayment(payment.id)}
                          className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
                        >
                          Confirm delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentToDelete(null)}
                          className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMessage("");
                          setPaymentToDelete(payment.id);
                        }}
                        className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50"
                      >
                        Delete payment
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {currentPage === "dashboard" && isAdmin && (
        <AdminDashboard />
      )}
 <Footer
        onHomeClick={() => scrollToSection("home")}
        onShopClick={() => scrollToSection("products")}
      />
    </div>
  );
}

export default App;
