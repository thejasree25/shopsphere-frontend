
import { useState } from "react";
import type { FormEvent } from "react";
import {
  ShoppingBag,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { registerUser } from "../utils/auth";

interface RegisterProps {
  onLoginClick?: () => void;
  onRegisterSuccess?: () => void;
}

export default function Register({
  onLoginClick,
  onRegisterSuccess,
}: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(
        `${response.message || "Registration successful."} Redirecting to sign in...`
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        onRegisterSuccess?.();
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[75vh] bg-[#fffdf9] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-xl shadow-stone-900/5 lg:grid-cols-2">
        {/* Left decorative panel */}
        <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-amber-950 p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-amber-200/20" />
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-amber-200/20" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-amber-700/20 blur-2xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <ShoppingBag size={25} />
            </div>

            <div>
              <p className="text-2xl font-black tracking-tight">
                ShopSphere
              </p>
              <p className="text-xs tracking-[0.2em] text-amber-200">
                YOUR EVERYDAY STORE
              </p>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-100/10 px-4 py-2 text-xs font-semibold tracking-wide text-amber-200">
              JOIN OUR COMMUNITY
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight xl:text-5xl">
              Your next favorite thing is just around the corner.
            </h1>

            <p className="mt-5 text-base leading-7 text-amber-100/80">
              Create your account to explore products, keep track of orders,
              and make your shopping experience more convenient.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Discover products you love",
                "Manage your shopping cart",
                "Keep your orders organized",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-amber-300"
                  />
                  <span className="text-sm text-amber-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-amber-200/60">
            Shop smart. Shop simple. ShopSphere.
          </p>
        </section>

        {/* Registration form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-800 text-white">
                  <ShoppingBag size={23} />
                </div>

                <p className="text-2xl font-black text-stone-900">
                  Shop<span className="text-amber-800">Sphere</span>
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-800">
                Create an account
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
                Join ShopSphere
              </h2>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                Fill in your details to get started with your shopping journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {/* Full name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Full name
                </label>

                <div className="flex items-center rounded-xl border border-stone-200 bg-[#fffdf9] px-4 transition focus-within:border-amber-700 focus-within:ring-4 focus-within:ring-amber-700/10">
                  <UserRound size={19} className="shrink-0 text-stone-400" />

                  <input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent px-3 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Email address
                </label>

                <div className="flex items-center rounded-xl border border-stone-200 bg-[#fffdf9] px-4 transition focus-within:border-amber-700 focus-within:ring-4 focus-within:ring-amber-700/10">
                  <Mail size={19} className="shrink-0 text-stone-400" />

                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent px-3 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-stone-200 bg-[#fffdf9] px-4 transition focus-within:border-amber-700 focus-within:ring-4 focus-within:ring-amber-700/10">
                  <LockKeyhole
                    size={19}
                    className="shrink-0 text-stone-400"
                  />

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent px-3 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-stone-400 transition hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Confirm password
                </label>

                <div className="flex items-center rounded-xl border border-stone-200 bg-[#fffdf9] px-4 transition focus-within:border-amber-700 focus-within:ring-4 focus-within:ring-amber-700/10">
                  <LockKeyhole
                    size={19}
                    className="shrink-0 text-stone-400"
                  />

                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Re-enter your password"
                    className="w-full bg-transparent px-3 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="shrink-0 text-stone-400 transition hover:text-stone-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Success message */}
              {success && (
                <p
                  role="status"
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-800"
                >
                  {success}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-800 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-900/10 transition hover:-translate-y-0.5 hover:bg-amber-900 focus:outline-none focus:ring-4 focus:ring-amber-800/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Creating account..." : "Create account"}

                {!isLoading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-stone-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="font-bold text-amber-800 transition hover:text-amber-950"
              >
                Sign in
              </button>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-stone-400">
              Your account details will be securely stored once registration
              is completed.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
