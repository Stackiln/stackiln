"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@product/ui/button";
export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending");
    const fields = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(fields)) });
      setStatus(response.ok ? "sent" : "error");
    } catch { setStatus("error"); }
  }
  return <section className="content-page"><h1>Contact</h1><p>Send a message to the team.</p>{status === "sent" ? <p role="status">Message received. Thank you.</p> : <form onSubmit={submit}><label className="field">Name<input name="name" autoComplete="name" required maxLength={100} /></label><label className="field">Email<input name="email" type="email" autoComplete="email" required /></label><label className="field">Message<textarea name="message" rows={7} required maxLength={5000} /></label><Button disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send message"}</Button>{status === "error" && <p role="alert">Message could not be sent. Please retry.</p>}</form>}</section>;
}
