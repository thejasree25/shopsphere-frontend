
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  AlertCircle,
} from "lucide-react";

import {
  createShopOrder,
  makeDemoPayment,
  type CustomerDetails,
} from "../service/paymentService";

interface PaymentItem {
  product: {
    id: number;
    backendId?: number;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

interface PaymentsPageProps {
  items: PaymentItem[];
  userEmail?: string;
  onBack: () => void;
  onPaymentSuccess: (paymentId: string) => void;
}

const initialCustomer = (email: string): CustomerDetails => ({
  customerName: "",
  email,
  phone: "",
  shippingAddress: "",
});

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export default function PaymentsPage({
  items,
  userEmail = "",
  onBack,
  onPaymentSuccess,
}: PaymentsPageProps) {
  const [customer, setCustomer] = useState<CustomerDetails>(() =>
    initialCustomer(userEmail)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successPaymentId, setSuccessPaymentId] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = Number(item.product.price);
        const quantity = Number(item.quantity);

        if (
          !Number.isFinite(price) ||
          price < 0 ||
          !Number.isFinite(quantity) ||
          quantity <= 0
        ) {
          return sum;
        }

        return sum + price * quantity;
      }, 0),
    [items]
  );

  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const displayedTotal = subtotal + shippingFee;

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setCustomer((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (loading) return;

    if (!items.length) {
      setError("Your cart is empty. Add a product before checkout.");
      return;
    }

    if (
      !Number.isFinite(displayedTotal) ||
      displayedTotal <= 0
    ) {
      setError("Your order total must be greater than zero.");
      return;
    }

    if (
      !customer.customerName.trim() ||
      !customer.email.trim() ||
      !customer.phone.trim() ||
      !customer.shippingAddress.trim()
    ) {
      setError("Please complete all delivery details.");
      return;
    }

    if (customer.customerName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9+() -]{7,20}$/.test(customer.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (customer.shippingAddress.trim().length < 8) {
      setError("Please enter your complete delivery address.");
      return;
    }

    let orderItems: { productId: number; quantity: number }[];

    try {
      orderItems = items.map((item) => {
        const productId = item.product.backendId;

        if (
          typeof productId !== "number" ||
          !Number.isInteger(productId) ||
          productId <= 0
        ) {
          throw new Error(
            `${item.product.name} has an invalid backend product ID. Remove it from your cart and add it again from the catalog.`
          );
        }

        if (
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          throw new Error(
            `The quantity for ${item.product.name} is invalid.`
          );
        }

        return {
          productId,
          quantity: item.quantity,
        };
      });
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Your cart contains an invalid product."
      );
      return;
    }

    setLoading(true);

    try {
      const cleanedCustomer: CustomerDetails = {
        customerName: customer.customerName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        shippingAddress: customer.shippingAddress.trim(),
      };

      // Step 1: Create the order through the Spring Boot backend.
      const shopOrderId = await createShopOrder(
        orderItems,
        cleanedCustomer
      );

      // Step 2: Simulate a payment using the existing demo API.
      // No card details or real payment gateway are used here.
      const payment = await makeDemoPayment(shopOrderId);

      if (payment.status !== "SUCCESS") {
        throw new Error(
          payment.message || "Demo payment could not be completed."
        );
      }

      const paymentId = String(payment.paymentId);
      const amount = Number(payment.amount);

      if (!paymentId || !Number.isFinite(amount) || amount < 0) {
        throw new Error(
          "The server returned invalid payment confirmation details."
        );
      }

      setSuccessOrderId(payment.orderReferenceId);
      setPaidAmount(amount);
      setSuccessPaymentId(paymentId);

      // Keep the callback expected by the parent component.
      onPaymentSuccess(paymentId);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to complete the demo payment."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e6d7c5] bg-white px-4 py-3 text-sm text-[#3c2a20] outline-none transition placeholder:text-[#ad9b89] focus:border-[#805238] focus:ring-2 focus:ring-[#805238]/15 disabled:cursor-not-allowed disabled:bg-[#f5efe5]";

  if (successPaymentId) {
    return (
      <main className="min-h-screen bg-[#faf5e9] px-4 py-12 text-[#3c2a20] sm:px-6">
        <section className="mx-auto max-w-xl rounded-3xl border border-[#eddfc7] bg-white p-6 text-center shadow-[0_20px_60px_rgba(75,47,28,0.09)] sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f4df] text-[#47783c]">
            <CheckCircle2 size={48} strokeWidth={1.7} />
          </div>

          <p className="mt-6 text-xs font-bold tracking-[0.24em] text-[#96724d]">
            DEMO PAYMENT CONFIRMED
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#887666]">
            Your demo payment was successful. No real money was charged,
            and no card details were collected.
          </p>

          <div className="mt-8 space-y-4 rounded-2xl bg-[#faf5e9] p-5 text-left">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#887666]">Order ID</span>
              <strong>#{successOrderId}</strong>
            </div>

            <div className="border-t border-[#e8dcc9]" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#887666]">Amount paid</span>
              <strong className="text-lg">
                {formatMoney(paidAmount)}
              </strong>
            </div>

            <div className="border-t border-[#e8dcc9]" />

            <div>
              <span className="text-sm text-[#887666]">
                Demo payment ID
              </span>
              <p className="mt-1 break-all text-sm font-semibold">
                {successPaymentId}
              </p>
            </div>

            <div className="border-t border-[#e8dcc9]" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#887666]">
                Payment status
              </span>
              <span className="flex items-center gap-2 text-sm font-bold text-[#47783c]">
                <CheckCircle2 size={17} />
                SUCCESS
              </span>
            </div>

            <div className="border-t border-[#e8dcc9]" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#887666]">
                Payment method
              </span>
              <strong className="text-sm">Dummy Payment</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#70452c] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#58351f] sm:w-auto"
          >
            <ShoppingBag size={18} />
            Continue shopping
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf5e9] px-4 py-6 text-[#3c2a20] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="mb-7 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-[#79573e] transition hover:text-[#3c2a20] disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Back to shopping cart
        </button>

        <header className="mb-9">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#70452c] text-[#fff2c9] shadow-lg shadow-[#70452c]/15">
            <ShoppingBag size={25} />
          </div>

          <p className="text-xs font-bold tracking-[0.25em] text-[#a07a4e]">
            SHOPSPHERE CHECKOUT
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Almost yours.
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#887666]">
            Add your delivery details and place your test order.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-8">
          <form
            onSubmit={handleCheckout}
            className="min-w-0 space-y-6"
          >
            <section className="rounded-2xl border border-[#eddfc7] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2c9] text-[#70452c]">
                  <MapPin size={21} />
                </div>

                <div>
                  <h2 className="font-bold">Delivery details</h2>
                  <p className="mt-1 text-xs text-[#998675]">
                    Where should we send your order?
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="customerName"
                    className="text-sm font-semibold"
                  >
                    Full name
                  </label>
                  <input
                    id="customerName"
                    name="customerName"
                    className={inputClass}
                    autoComplete="name"
                    value={customer.customerName}
                    onChange={(event) =>
                      updateField("customerName", event.target.value)
                    }
                    placeholder="Enter your full name"
                    minLength={2}
                    maxLength={100}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-semibold">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={inputClass}
                    autoComplete="email"
                    value={customer.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    maxLength={254}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-semibold">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={inputClass}
                    autoComplete="tel"
                    value={customer.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="Enter your phone number"
                    minLength={7}
                    maxLength={20}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="shippingAddress"
                    className="text-sm font-semibold"
                  >
                    Complete delivery address
                  </label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    className={`${inputClass} resize-y`}
                    autoComplete="street-address"
                    value={customer.shippingAddress}
                    onChange={(event) =>
                      updateField("shippingAddress", event.target.value)
                    }
                    placeholder="House number, street, city, state and PIN code"
                    minLength={8}
                    maxLength={1000}
                    rows={4}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#eddfc7] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2c9] text-[#70452c]">
                  <LockKeyhole size={21} />
                </div>

                <div>
                  <h2 className="font-bold">Payment method</h2>
                  <p className="mt-1 text-xs text-[#998675]">
                    Demo mode — no real payment gateway
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border-2 border-[#805238] bg-[#fffaf0] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2c9] text-[#70452c]">
                  <CheckCircle2 size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">Dummy Payment</p>
                  <p className="mt-1 text-xs leading-5 text-[#887666]">
                    Simulates successful payment for project testing.
                    No card details, OTP, or real charge.
                  </p>
                </div>

                <span className="rounded-full bg-[#e8f4df] px-2.5 py-1 text-xs font-bold text-[#47783c]">
                  Selected
                </span>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#887666]">
                This mode is intended for project demonstrations. The
                backend demo endpoint must be enabled.
              </p>
            </section>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#70452c] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#70452c]/15 transition hover:bg-[#58351f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Processing dummy payment...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Place Test Order · {formatMoney(displayedTotal)}
                </>
              )}
            </button>

            <p className="px-2 text-center text-xs leading-5 text-[#998675]">
              Dummy payment only · No real money charged
            </p>
          </form>

          <aside className="overflow-hidden rounded-2xl border border-[#eddfc7] bg-white shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center justify-between border-b border-[#f0e6d7] px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold">Your order</h2>
              <span className="rounded-full bg-[#fff2c9] px-3 py-1 text-xs font-semibold text-[#70452c]">
                {items.length} item type(s)
              </span>
            </div>

            {items.length === 0 ? (
              <p className="p-6 text-sm text-[#887666]">
                Your cart is empty.
              </p>
            ) : (
              <div className="space-y-5 px-5 py-6 sm:px-6">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.backendId ?? item.product.id}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-xl bg-[#faf5e9]">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <ShoppingBag
                          size={25}
                          className="text-[#a58a70]"
                        />
                      )}

                      <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#70452c] px-1.5 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-xs text-[#998675]">
                        {formatMoney(Number(item.product.price))} each
                      </p>
                    </div>

                    <strong className="shrink-0 text-sm">
                      {formatMoney(
                        Number(item.product.price) * item.quantity
                      )}
                    </strong>
                  </div>
                ))}
              </div>
            )}

            <div className="mx-5 border-t border-dashed border-[#e8dcc9] sm:mx-6" />

            <div className="space-y-4 px-5 py-6 sm:px-6">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[#887666]">Subtotal</span>
                <span className="font-semibold">
                  {formatMoney(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[#887666]">Shipping</span>
                <span
                  className={
                    shippingFee === 0
                      ? "font-bold text-[#47783c]"
                      : "font-semibold"
                  }
                >
                  {shippingFee === 0 ? "FREE" : formatMoney(shippingFee)}
                </span>
              </div>

              {subtotal < 999 && subtotal > 0 && (
                <div className="rounded-xl bg-[#fff7df] p-3 text-xs leading-5 text-[#79573e]">
                  Add <strong>{formatMoney(999 - subtotal)}</strong> more
                  for free shipping.
                </div>
              )}

              <div className="border-t border-[#f0e6d7] pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold">Total</span>
                  <strong className="text-2xl tracking-tight">
                    {formatMoney(displayedTotal)}
                  </strong>
                </div>

                <p className="mt-1 text-right text-xs text-[#998675]">
                  The backend should calculate and validate the final amount.
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#f0e6d7] bg-[#fffdf8] px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">
                <Truck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#805238]"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Delivery to your doorstep
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#998675]">
                    Your delivery address is collected before checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#47783c]"
                />
                <div>
                  <p className="text-sm font-semibold">Demo checkout</p>
                  <p className="mt-1 text-xs leading-5 text-[#998675]">
                    No card information is requested or submitted.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PackageCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#805238]"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Order confirmation
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#998675]">
                    Your order is confirmed when the demo payment succeeds.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="py-8 text-center text-xs tracking-wide text-[#a18d78]">
          SHOPSPHERE · A thoughtful shopping experience
        </footer>
      </div>
    </main>
  );
}
