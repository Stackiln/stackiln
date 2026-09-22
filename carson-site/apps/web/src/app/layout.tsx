import type { Metadata } from "next";
import Link from "next/link";
import config from "../../product-config.json";
import { EnabledComponents } from "../components/enabled";
import { MainNavigation, LegalNavigation } from "../components/navigation";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://carson.stackiln.com"),
  title: {
    default: "Carson | Oakridge Security Desk",
    template: `%s | ${config.product.name}`,
  },
  description: config.product.description,
  openGraph: {
    title: "Carson | Oakridge Security Desk",
    description: config.product.description,
    type: "website",
  },
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
            <span>OAKRIDGE</span>
            <strong>{config.product.name}</strong>
          </Link>
          <MainNavigation />
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <span>Carson · Oakridge security desk · Fictional facility</span>
          <LegalNavigation />
        </footer>
        <EnabledComponents />
      </body>
    </html>
  );
}
