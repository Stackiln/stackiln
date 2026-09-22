import type { Metadata } from "next";
import Link from "next/link";
import config from "../../product-config.json";
import { EnabledComponents } from "../components/enabled";
import { MainNavigation, LegalNavigation } from "../components/navigation";
import "./globals.css";
import "./theme.css";

export const metadata: Metadata = {
  title: {
    default: config.product.name,
    template: `%s | ${config.product.name}`,
  },
  description: config.product.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="wordmark" href="/">
            {config.product.name}
          </Link>
          <MainNavigation />
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <span>{config.product.name}</span>
          <LegalNavigation />
        </footer>
        <EnabledComponents />
      </body>
    </html>
  );
}
