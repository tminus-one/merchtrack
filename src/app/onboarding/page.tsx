'use client';

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import OnboardingBackground from "@/app/onboarding/(components)/onboarding-background";
import OnboardingForm from "@/app/onboarding/(components)/onboarding-form";

export default function OnboardingPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/sign-in');
    }

    if (isLoaded && isSignedIn && user?.publicMetadata?.onboardingComplete) {
      redirect('/dashboard');
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Interactive Particle Background */}
      <OnboardingBackground 
        density={70}
        connectionDistance={150}
        particleSize={1.5}
        speed={0.3}
        interactive={true}
      />
      
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-md">
          {/* Logo Header */}
          <div className="mb-6 flex flex-col items-center justify-center rounded-md bg-neutral-2/80 py-4 text-center backdrop-blur-sm">
            <div className="relative mb-2 size-16">
              <Image
                src="/img/logo.png"
                alt="MerchTrack Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-primary">Welcome to MerchTrack</h1>
            <p className="text-sm text-gray-600">Please complete your profile to continue</p>
          </div>

          {/* Card with Form */}
          <Card className="rounded-xl border-none bg-white/90 p-6 backdrop-blur-sm">
            <CardContent className="p-0 pb-4 pt-2">
              <OnboardingForm />
              
              {/* Security notice */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="size-4 text-primary" />
                <span>Your data is secure and private</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}