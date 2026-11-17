import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-hull-edge bg-hull p-5 motion-safe:animate-float-in ${className}`}
      {...props}
    />
  );
}
