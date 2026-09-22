import Link from "next/link";
const main: { label: string; href: string }[] = [
  { label: "Briefing", href: "/#briefing" },
  { label: "Protocol", href: "/#protocol" },
];
const legal: { label: string; href: string }[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
export function MainNavigation() {
  return (
    <nav aria-label="Main navigation">
      {main.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
export function LegalNavigation() {
  return (
    <nav aria-label="Legal">
      {legal.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
