import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { copy } from "../../copy";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-starfield">
      <div aria-hidden="true" className="stars motion-safe:animate-twinkle pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <header className="mb-8 border-b border-hull-edge pb-4">
          <Link
            to="/"
            className="font-display text-xl font-bold tracking-wider text-plasma sm:text-2xl"
          >
            {copy.appName}
          </Link>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
