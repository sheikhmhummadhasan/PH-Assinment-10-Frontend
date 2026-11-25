
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/app/lib/auth-client";
import { uploadImage } from "@/app/lib/uploadImage";
import toast from "react-hot-toast";

const SignupPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [accountType, setAccountType] = useState("user");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isStrongPassword = Object.values(passwordChecks).every(Boolean);

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      event.target.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const validateForm = (data) => {
    if (!data.name?.trim() || data.name.trim().length < 2) {
      setError("Name must contain at least 2 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email?.trim() || "")) {
      setError("Please enter a valid email address");
      return false;
    }

    const passwordValue = data.password || "";

    const validPassword =
      passwordValue.length >= 8 &&
      /[A-Z]/.test(passwordValue) &&
      /[a-z]/.test(passwordValue) &&
      /[0-9]/.test(passwordValue) &&
      /[^A-Za-z0-9]/.test(passwordValue);

    if (!validPassword) {
      setError(
        "Password must contain uppercase, lowercase, number, special character and at least 8 characters"
      );
      return false;
    }

    if (!(data.photo instanceof File) || data.photo.size === 0) {
      setError("Please upload your profile photo");
      return false;
    }

    if (!data.photo.type.startsWith("image/")) {
      setError("Please select a valid image");
      return false;
    }

    if (data.photo.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return false;
    }

    if (data.accountType === "vendor") {
      if (
        !data.companyName?.trim() ||
        !data.phone?.trim() ||
        !data.businessType ||
        !data.businessAddress?.trim() ||
        !data.businessDescription?.trim()
      ) {
        setError("Please complete all business information");
        return false;
      }
    }

    return true;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (!validateForm(data)) return;

    setLoading(true);

    try {
      const imageUrl = await uploadImage(data.photo);

      const result = await authClient.signUp.email({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        image: imageUrl,
        accountType: data.accountType,
        companyName: data.companyName?.trim() || "",
        phone: data.phone?.trim() || "",
        businessType: data.businessType || "",
        businessAddress: data.businessAddress?.trim() || "",
        businessDescription: data.businessDescription?.trim() || "",
      });

      if (result.error) {
        throw new Error(result.error.message || "Signup failed");
      }

      toast.success("Signup Successful!");
      router.push("/dashboard/user");
      router.refresh();

    } catch (error) {
      const message = error.message || "Something went wrong";

      if (
        ["already", "duplicate", "unique", "exists"].some((word) =>
          message.toLowerCase().includes(word)
        )
      ) {
        setError("This email is already registered. Please sign in instead.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/user",
      });

      if (result?.error) {
        throw new Error(result.error.message || "Google signup failed");
      }
    } catch (error) {
      setError(error.message || "Google signup failed");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 dark:bg-[#0B1220]">
      <div className="w-full max-w-md rounded-md border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8 dark:border-[#1F2A3D] dark:bg-[#131C2E]">

        <div className="mb-7 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-extrabold text-[#0F172A] dark:text-[#E2E8F0]"
          >
            <span className="rounded-md bg-[#0F766E] px-2 py-1 text-white dark:bg-[#2DD4BF] dark:text-[#0B1220]">
              TB
            </span>
            Ticket
            <span className="text-[#0F766E] dark:text-[#2DD4BF]">
              Bari
            </span>
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-[#0F172A] dark:text-[#E2E8F0]">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Join TicketBari and start your journey
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="hidden"
            name="accountType"
            value={accountType}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
              Full Name
            </label>

            <div className="flex items-center gap-3 rounded-md border border-[#E2E8F0] px-3 dark:border-[#1F2A3D]">
              <FaUser className="text-[#64748B]" />

              <input
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full bg-transparent py-3 text-sm text-[#0F172A] outline-none dark:text-[#E2E8F0]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-md border border-[#E2E8F0] px-3 dark:border-[#1F2A3D]">
              <FaEnvelope className="text-[#64748B]" />

              <input
                name="email"
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
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => {
                  setAccountType("user");
                  setError("");
                }}
                className={`rounded-md border px-4 py-3 text-sm font-semibold transition ${
                  accountType === "user"
                    ? "border-[#0F766E] bg-[#CCFBF1] text-[#0F766E] dark:border-[#2DD4BF] dark:bg-[#134E4A] dark:text-[#2DD4BF]"
                    : "border-[#E2E8F0] text-[#64748B] dark:border-[#1F2A3D] dark:text-[#94A3B8]"
                }`}
              >
                User
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountType("vendor");
                  setError("");
                }}
                className={`rounded-md border px-4 py-3 text-sm font-semibold transition ${
                  accountType === "vendor"
                    ? "border-[#0F766E] bg-[#CCFBF1] text-[#0F766E] dark:border-[#2DD4BF] dark:bg-[#134E4A] dark:text-[#2DD4BF]"
                    : "border-[#E2E8F0] text-[#64748B] dark:border-[#1F2A3D] dark:text-[#94A3B8]"
                }`}
              >
                Vendor
              </button>

            </div>
          </div>

          {accountType === "vendor" && (
            <div className="space-y-4 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 dark:border-[#1F2A3D] dark:bg-[#0B1220]">

              <div>
                <h3 className="font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
                  Business Information
                </h3>

                <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Provide your business details for vendor application.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
                  Company Name
                </label>

                <input
                  name="companyName"
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Enter company name"
                  required
                  className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-3 text-sm outline-none focus:border-[#0F766E] dark:border-[#1F2A3D] dark:bg-[#131C2E] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
                  Phone Number
                </label>

                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter phone number"
                  required
                  className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-3 text-sm outline-none focus:border-[#0F766E] dark:border-[#1F2A3D] dark:bg-[#131C2E] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
                  Business Type
                </label>

                <select
                  name="businessType"
                  value={businessType}
                  onChange={(event) => setBusinessType(event.target.value)}
                  required
                  className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-3 text-sm outline-none focus:border-[#0F766E] dark:border-[#1F2A3D] dark:bg-[#131C2E] dark:text-white"
                >
                  <option value="">Select business type</option>
                  <option value="bus">Bus Service</option>
                  <option value="train">Train Service</option>
                  <option value="launch">Launch Service</option>
                  <option value="plane">Airline Service</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
                  Business Address
                </label>

                <input
                  name="businessAddress"
                  type="text"
                  value={businessAddress}
                  onChange={(event) => setBusinessAddress(event.target.value)}
                  placeholder="Enter business address"
                  required
                  className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-3 text-sm outline-none focus:border-[#0F766E] dark:border-[#1F2A3D] dark:bg-[#131C2E] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
                  Business Description
                </label>

                <textarea
                  name="businessDescription"
                  rows={3}
                  value={businessDescription}
                  onChange={(event) =>
                    setBusinessDescription(event.target.value)
                  }
                  placeholder="Describe your business..."
                  required
                  className="w-full resize-none rounded-md border border-[#E2E8F0] bg-white px-3 py-3 text-sm outline-none focus:border-[#0F766E] dark:border-[#1F2A3D] dark:bg-[#131C2E] dark:text-white"
                />
              </div>

            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
              Profile Photo
            </label>

            <div className="flex items-center gap-4 rounded-md border border-dashed border-[#CBD5E1] p-3 dark:border-[#334155]">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#F1F5F9] dark:bg-[#0B1220]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaCamera
                    size={23}
                    className="text-[#64748B]"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <label
                  htmlFor="profile-photo"
                  className="inline-flex cursor-pointer items-center rounded-md bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115E59] dark:bg-[#2DD4BF] dark:text-[#0B1220]"
                >
                  Choose Photo
                </label>

                <input
                  id="profile-photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  JPG, PNG or WebP. Maximum 5MB.
                </p>
              </div>

            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
              Password
            </label>

            <div className="flex items-center gap-3 rounded-md border border-[#E2E8F0] px-3 dark:border-[#1F2A3D]">

              <FaLock className="text-[#64748B]" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a strong password"
                minLength={8}
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

            <div className="mt-3 space-y-2">

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className={`h-1.5 flex-1 rounded-md ${
                      passwordScore >= item
                        ? "bg-[#0F766E] dark:bg-[#2DD4BF]"
                        : "bg-[#E2E8F0] dark:bg-[#1F2A3D]"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                {password.length === 0
                  ? "Password strength"
                  : isStrongPassword
                    ? "Strong password"
                    : "Your password needs:"}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["At least 8 characters", passwordChecks.length],
                  ["One uppercase letter", passwordChecks.uppercase],
                  ["One lowercase letter", passwordChecks.lowercase],
                  ["One number", passwordChecks.number],
                  ["One special character", passwordChecks.special],
                ].map(([label, valid]) => (
                  <p
                    key={label}
                    className={
                      valid
                        ? "text-[#0F766E] dark:text-[#2DD4BF]"
                        : "text-[#64748B] dark:text-[#94A3B8]"
                    }
                  >
                    {valid ? "✓" : "○"} {label}
                  </p>
                ))}
              </div>

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
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E2E8F0] dark:bg-[#1F2A3D]" />
          <span className="text-xs text-[#64748B]">
            OR CONTINUE WITH
          </span>
          <div className="h-px flex-1 bg-[#E2E8F0] dark:bg-[#1F2A3D]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-[#E2E8F0] py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F8FAFC] disabled:opacity-60 dark:border-[#1F2A3D] dark:text-[#E2E8F0] dark:hover:bg-[#0B1220]"
        >
          <FcGoogle size={20} />
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#0F766E] hover:underline dark:text-[#2DD4BF]"
          >
            Sign In
          </Link>
        </p>

      </div>
    </main>
  );
};

export default SignupPage;
