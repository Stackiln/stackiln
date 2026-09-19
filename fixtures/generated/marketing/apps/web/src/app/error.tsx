"use client";
import { useEffect } from "react";
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <section className="content-page"><h1>Something went wrong</h1><p>Please try again.</p><button className="button button-default" onClick={reset}>Retry</button></section>;
}
