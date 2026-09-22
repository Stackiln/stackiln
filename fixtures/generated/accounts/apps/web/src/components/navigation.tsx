import Link from "next/link";
const main: { label: string; href: string }[] = [
  { label: "Contact", href: "/contact" },
  { label: "Account", href: "/account" },
  { label: "Features", href: "/features" },
];
const legal: { label: string; href: string }[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
export function MainNavigation() {
  return main.length ? (
    <nav aria-label="Main navigation">
      {main.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  ) : null;
}
export function LegalNavigation() {
  return legal.length ? (
    <nav aria-label="Legal">
      {legal.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  ) : null;
}
