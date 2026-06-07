import { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "white" | "dark";
  showText?: boolean;
}

export default function Logo({ variant = "default", showText = true, className = "", ...props }: LogoProps) {
  // Check if explicit sizing is provided, otherwise use default height
  const hasSizeClass = className && (className.includes('w-') || className.includes('h-'));
  const imageClasses = hasSizeClass ? "w-full h-full object-contain" : "h-12 w-auto object-contain";

  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <img
        src={showText ? "/logo-full.svg" : "/logo.svg"}
        alt="BrandEngine Logo"
        className={imageClasses}
      />
    </div>
  );
}
