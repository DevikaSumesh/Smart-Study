"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-3xl p-8 md:p-12">
        <div className="flex justify-center mb-6">
          <div className="relative h-12 w-12 md:h-16 md:w-16">
            {/* simple quill/feather icon mark */}
            <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
              <path
                d="M10 46c14-22 28-30 44-30-8 10-16 22-26 32-6 6-12 8-18 8 0-4 0-8 0-10z"
                fill="currentColor"
                className="text-[color:var(--brand)]/70"
              />
              <path
                d="M14 54c8 0 14-4 20-10"
                stroke="currentColor"
                className="text-[color:var(--brand-dark)]"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-center text-2xl md:text-3xl font-semibold text-[color:var(--brand-dark)]">
          Sign up with Study Smart for free
        </h1>

        <form
          className="mt-8 space-y-5 max-w-2xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault()
            router.push("/onboarding")
          }}
        >
          <div>
            <label className="block text-lg font-semibold text-[color:var(--ink)] mb-3">
              Enter your email address to get started.
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white px-5 py-3.5 text-base outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
            />
          </div>

          <button type="submit" className="btn-primary w-full rounded-full text-lg py-3">
            Get Started
          </button>

          <div className="relative my-2">
            <hr className="border-black/10" />
            <span className="absolute left-1/2 top-1 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-[color:var(--ink)]/70">
              or
            </span>
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="btn-outline rounded-full py-3 font-semibold"
            >
              SIGN UP WITH GOOGLE
            </button>
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="btn-outline rounded-full py-3 font-semibold"
            >
              SIGN UP WITH MICROSOFT
            </button>
          </div>
        </form>

        <p className="mt-8 text-sm text-center text-[color:var(--ink)]/70">
          Already have an account?
          <Link className="text-[color:var(--brand)] underline font-medium ml-1" href="/dashboard">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
