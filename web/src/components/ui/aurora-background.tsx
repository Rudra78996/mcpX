"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div className="absolute -top-1/3 -left-1/4 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.35),transparent_60%)] blur-3xl animate-aurora-slow" />
      <div className="absolute top-1/2 -right-1/3 h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.30),transparent_60%)] blur-3xl animate-aurora-med" />
      <div className="absolute -bottom-1/3 left-1/3 h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.28),transparent_60%)] blur-3xl animate-aurora-fast" />

      <style jsx>{`
        @keyframes auroraMoveSlow {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(4%, -2%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes auroraMoveMed {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-3%, 3%, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes auroraMoveFast {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(2%, 2%, 0) scale(1.06);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .animate-aurora-slow {
          animation: auroraMoveSlow 18s ease-in-out infinite;
        }
        .animate-aurora-med {
          animation: auroraMoveMed 14s ease-in-out infinite;
        }
        .animate-aurora-fast {
          animation: auroraMoveFast 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
