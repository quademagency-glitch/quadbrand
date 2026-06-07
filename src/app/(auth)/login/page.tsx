"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Mail, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail } from "firebase/auth";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading("google");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      
      if (res.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create session");
      }
    } catch (error) {
      console.error("Google login failed", error);
    } finally {
      setLoading(null);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading("email");
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/dashboard`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setSuccess(true);
    } catch (error) {
      console.error("Email login failed", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center mb-8">
        <Logo showText={true} />
      </div>

      <h1
        className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        id="login-heading"
      >
        Welcome back
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Log in to your QuadBrand account
      </p>

      {!success ? (
        <>
          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-hover)] transition-all duration-200 mb-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            id="login-google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading === "google" ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleEmailLogin}>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="login-email"
            >
              Email address
            </label>
            <div className="relative mb-4">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 transition-all duration-200 placeholder:text-[var(--text-tertiary)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading !== null || !email}
              className="btn-gradient w-full !rounded-xl !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              id="login-submit"
            >
              {loading === "email" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              <span>{loading === "email" ? "Sending link..." : "Send Magic Link"}</span>
            </button>
          </form>
        </>
      ) : (
        /* Success State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Check your email
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            We sent a magic link to{" "}
            <strong className="text-[var(--text-primary)]">{email}</strong>
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="text-sm text-[var(--accent-cyan)] hover:underline"
          >
            Use a different email
          </button>
        </motion.div>
      )}

      {/* Footer */}
      <p className="text-sm text-[var(--text-secondary)] mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors"
          id="login-signup-link"
        >
          Sign up free <ArrowRight className="inline w-3.5 h-3.5" />
        </Link>
      </p>
    </motion.div>
  );
}
