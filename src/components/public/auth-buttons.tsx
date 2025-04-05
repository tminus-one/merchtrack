"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex items-center gap-2">
      {!isSignedIn && (
        <>
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
            <Button variant="outline" size="sm" className="bg-neutral-2 font-semibold">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
            <Button size="sm" className="font-semibold text-neutral-2">
              Sign Up
            </Button>
          </SignUpButton>
        </>
      )}
      {isSignedIn && (
        <Button size="sm" className="font-semibold" asChild>
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      )}
    </div>
  );
}