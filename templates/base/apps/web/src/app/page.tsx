import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return <><section className="home-intro"><div className="home-copy"><p className="eyebrow">A useful place to begin</p><h1>Make the work<br />worth sharing.</h1><p className="lead">A flexible home for what you are building. Replace this product-owned copy with a clear statement of your offer.</p><Link className="text-link" href="/contact">Get in touch <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="home-media" role="img" aria-label="Sunlit architectural workspace" /></section><section className="content-band"><div><p className="eyebrow">What matters</p><h2>A thoughtful foundation for your next chapter.</h2></div><p>Make this page your own with real product details, photography, and customer proof before launch.</p></section></>;
}
