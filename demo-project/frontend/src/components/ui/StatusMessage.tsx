import type { ReactNode } from "react";
import { Card } from "./Card";
import { Spinner } from "./Spinner";

type Variant = "loading" | "empty" | "error" | "notFound";

const styles: Record<Variant, { border: string; title: string; icon: string }> = {
  loading: { border: "border-hull-edge", title: "text-plasma", icon: "◌" },
  empty: { border: "border-ember", title: "text-ember", icon: "✦" },
  error: { border: "border-alert", title: "text-alert", icon: "⚠" },
  notFound: { border: "border-ember", title: "text-ember", icon: "✧" },
};

export function StatusMessage({
  variant,
  message,
  action,
}: {
  variant: Variant;
  message: string;
  action?: ReactNode;
}) {
  const s = styles[variant];
  return (
    <Card
      role={variant === "error" ? "alert" : "status"}
      className={`flex flex-col items-center gap-4 text-center ${s.border}`}
    >
      {variant === "loading" ? (
        <Spinner />
      ) : (
        <span aria-hidden="true" className={`text-3xl ${s.title}`}>
          {s.icon}
        </span>
      )}
      <p className={`font-display text-lg ${s.title}`}>{message}</p>
      {action}
    </Card>
  );
}
