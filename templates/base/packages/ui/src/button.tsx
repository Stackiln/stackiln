import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};
export function Button({ className, variant = "default", ...props }: Props) {
  return (
    <button
      className={twMerge(clsx("button", `button-${variant}`, className))}
      {...props}
    />
  );
}
