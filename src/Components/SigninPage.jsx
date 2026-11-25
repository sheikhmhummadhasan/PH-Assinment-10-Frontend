"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/app/lib/auth-client";
import toast from "react-hot-toast";

const SigninPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Sign in failed");
      }
      toast.success('Login Successfully Done!!')
      router.push("/adminDashbord");
      router.refresh();
    } catch (error) {
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/user",
      });

      if (result?.error) {
        throw new Error(result.error.message || "Google sign in failed");
      }
    } catch (error) {
      setError(error.message || "Google sign in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 dark:bg-[#0B1220]">
      <div className="w-full max-w-md rounded-md border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8 dark:border-[#1F2A3D] dark:bg-[#131C2E]">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-extrabold text-[#0F172A] dark:text-[#E2E8F0]"
          >
            <span className="rounded-md bg-[#0F766E] px-2 py-1 text-white dark:bg-[#2DD4BF] dark:text-[#0B1220]">
              TB
            </span>
            Ticket<span className="text-[#0F766E] dark:text-[#2DD4BF]">Bari</span>
          </Link>

          <h1 className="mt-7 text-2xl font-bold text-[#0F172A] dark:text-[#E2E8F0]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSignin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-md border border-[#E2E8F0] px-3 dark:border-[#1F2A3D]">
              <FaEnvelope className="text-[#64748B]" />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-transparent py-3 text-sm text-[#0F172A] outline-none dark:text-[#E2E8F0]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
              Password
            </label>

            <div className="flex items-center gap-3 rounded-md border border-[#E2E8F0] px-3 dark:border-[#1F2A3D]">
              <FaLock className="text-[#64748B]" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-transparent py-3 text-sm text-[#0F172A] outline-none dark:text-[#E2E8F0]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-[#64748B]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-md bg-[#0F766E] py-3 font-semibold text-white transition-colors hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#2DD4BF] dark:text-[#0B1220] dark:hover:bg-[#5EEAD4]"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E2E8F0] dark:bg-[#1F2A3D]" />
          <span className="text-xs text-[#64748B]">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-[#E2E8F0] dark:bg-[#1F2A3D]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignin}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-[#E2E8F0] py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F8FAFC] disabled:opacity-60 dark:border-[#1F2A3D] dark:text-[#E2E8F0] dark:hover:bg-[#0B1220]"
        >
          <FcGoogle size={20} />
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
          Do not have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#0F766E] hover:underline dark:text-[#2DD4BF]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SigninPage;