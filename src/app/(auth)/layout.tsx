import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Log In — QuadBrand",
  description: "Log in to your QuadBrand account to generate on-brand visuals.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: "var(--gradient-primary)" }}
      >
        {/* Animated Orbs */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 -top-20 -left-20 blur-3xl" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 bottom-10 right-10 blur-3xl" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <Link href="/" className="inline-flex justify-center mb-8">
            <Logo variant="white" showText={false} className="w-16 h-16 opacity-90" />
          </Link>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Generate On-Brand
            <br />
            Visuals in Seconds
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            Join 500+ brands using AI to create scroll-stopping marketing visuals
            that are always on-brand.
          </p>

          {/* Testimonial */}
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left border border-white/10">
            <p className="text-white/90 text-sm leading-relaxed italic mb-4">
              &ldquo;QuadBrand cut our design turnaround from days to minutes. Our
              entire marketing team now creates on-brand assets without touching
              Figma.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs text-white font-bold">
                SM
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Sarah Mitchell</p>
                <p className="text-white/50 text-xs">Head of Marketing, TechCo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
