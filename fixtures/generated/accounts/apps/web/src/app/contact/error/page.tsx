import Link from "next/link";
export default function ContactError() { return <section className="content-page"><h1>Message unavailable</h1><p>Message could not be sent. Please retry.</p><Link className="text-link" href="/contact">Return to contact</Link></section>; }
