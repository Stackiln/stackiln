import type { Metadata } from "next";
import Link from "next/link";
import config from "../../product-config.json";
import { EnabledComponents } from "../components/enabled";
import "./globals.css";

export const metadata: Metadata = { title: { default: config.product.name, template: `%s | ${config.product.name}` }, description: config.product.description };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><Link className="wordmark" href="/">{config.product.name}</Link><nav aria-label="Main navigation"><Link href="/features">Features</Link><Link href="/contact">Contact</Link></nav></header><main id="main">{children}</main><footer className="site-footer"><span>{config.product.name}</span><nav aria-label="Legal"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav></footer><EnabledComponents /></body></html>;
}
