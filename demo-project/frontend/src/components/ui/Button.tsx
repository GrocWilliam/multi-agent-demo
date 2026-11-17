import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-[44px] items-center justify-center rounded-md px-5 py-2 font-semibold transition-shadow";
const variants: Record<Variant, string> = {
  primary: "bg-plasma text-void hover:shadow-glow",
  secondary: "border border-plasma text-plasma hover:shadow-glow",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  variant = "secondary",
  className = "",
  ...props
}: LinkProps & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
