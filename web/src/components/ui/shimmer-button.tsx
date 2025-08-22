import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

export interface ShimmerButtonProps {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export const ShimmerButton = ({
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "100px",
  background = "rgba(0, 0, 0, 1)",
  className,
  children,
  onClick,
  ...props
}: ShimmerButtonProps) => {
  return (
    <button
      style={
        {
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        } as CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black",
        "before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:bg-gradient-to-br before:from-white/20 before:to-white/5 before:opacity-0 before:transition-opacity before:duration-500",
        "after:absolute after:inset-0 after:-z-10 after:m-[var(--cut)] after:h-[calc(100%-2*var(--cut))] after:w-[calc(100%-2*var(--cut))] after:[background:var(--bg)] after:[border-radius:calc(var(--radius)-var(--cut))]",
        "before:animate-shimmer before:[background-image:conic-gradient(from_var(--spread),transparent_0_5%,var(--shimmer-color)_5%_95%,transparent_95%_100%)] before:[background-size:200%_200%] before:[animation-duration:var(--speed)]",
        "group-hover:before:opacity-100",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};





