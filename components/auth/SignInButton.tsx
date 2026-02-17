"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function SignInButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="rounded-md border px-4 py-2 text-sm font-medium"
      >
        Sign out
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn("email")}
      className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
    >
      Sign in to bid
    </button>
  )
}
