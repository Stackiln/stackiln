"use client";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "../lib/analytics";
import { Button } from "@product/ui/button";

const key = "analytics-consent";
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("consent-change", listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener("consent-change", listener); };
}
function snapshot(): "accepted" | "declined" | null {
  const value = localStorage.getItem(key);
  return value === "accepted" || value === "declined" ? value : null;
}
export function Consent() {
  const path = usePathname();
  const choice = useSyncExternalStore(subscribe, snapshot, () => null);
  useEffect(() => { if (choice === "accepted") analytics.track("page.viewed", { path }); }, [choice, path]);
  function choose(value: "accepted" | "declined") { localStorage.setItem(key, value); window.dispatchEvent(new Event("consent-change")); }
  if (choice !== null) return null;
  return <aside className="consent-bar" aria-label="Analytics consent"><p>May we use optional analytics to understand site visits?</p><div><Button onClick={() => choose("accepted")}>Allow</Button><Button variant="outline" onClick={() => choose("declined")}>Decline</Button></div></aside>;
}
