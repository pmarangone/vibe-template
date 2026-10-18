import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

/** shadcn-style button (local variant, no registry dep).
 * Renders a Tailwind-styled button. Time: O(1); Space: O(1). */
export function Button({ children, variant = "primary", ...rest }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-700"
      : "bg-slate-100 text-slate-900 hover:bg-slate-200";
  return (
    <button className={`${base} ${styles}`} {...rest}>
      {children}
    </button>
  );
}

/** Card container for app sections.
 * Time: O(1); Space: O(children). */
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}
