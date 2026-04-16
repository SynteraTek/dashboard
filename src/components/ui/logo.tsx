import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      <div className="flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
        <img 
          src="/logo.svg" 
          alt="SynteraTek Logo" 
          className={cn(
            "object-contain", 
            iconOnly ? "h-8 w-auto" : "h-14 w-auto"
          )}
        />
      </div>
    </div>
  );
}
