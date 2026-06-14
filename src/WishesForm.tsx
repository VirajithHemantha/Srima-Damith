import React, { useState } from "react";
import { MessageCircle, CheckCircle2 } from "lucide-react";

export function WishesForm() {
  const endpoint = "https://script.google.com/macros/s/AKfycbz3yrzmGPnNL5nj1QRusq2mWHUdKvioDyxVvcjI8D2Sc1yXKgrcCbFsfcdhD9BJX62_Jw/exec";

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Please enter a message.");
      return;
    }

    const payload = {
      name,
      message,
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const formBody = new URLSearchParams();
      formBody.append("payload", JSON.stringify(payload));

      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });
      setSuccessMessage("Wishes sent. Thank you!");
      setName("");
      setMessage("");
    } catch {
      setErrorMessage("Could not send wishes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-no-flip className="w-full cursor-auto">
      <CheckCircle2 size={24} className="text-umber mb-2 md:mb-4 mx-auto opacity-80 md:w-8 md:h-8" />
      <h4 className="serif text-3xl md:text-4xl text-umber font-bold mb-2 md:mb-3 text-center">Wishes</h4>
      <p className="text-[12px] md:text-sm text-umber/80 font-bold uppercase tracking-widest mb-4 md:mb-6 text-center leading-relaxed">
        Leave a message for the couple
      </p>

      <form onSubmit={submit} className="space-y-4 md:space-y-4 px-1 md:px-2">
        <input
          data-no-flip
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-sage/20 bg-white/60 px-3 py-2.5 text-xs text-zinc-700 outline-none"
        />

        <textarea
          data-no-flip
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
          placeholder="Your wishes..."
          rows={3}
          className="w-full rounded-xl border border-sage/20 bg-white/60 px-3 py-2.5 text-xs text-zinc-700 outline-none resize-none"
        />

        {errorMessage && <p className="text-[10px] md:text-xs text-red-700 font-semibold">{errorMessage}</p>}
        {successMessage && <p className="text-[10px] md:text-xs text-sage font-bold">{successMessage}</p>}

        <button
          type="submit"
          data-no-flip
          disabled={submitting}
          className="w-full bg-umber text-white py-3 md:py-3 rounded-xl text-[12px] md:text-sm uppercase tracking-widest font-bold disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Wishes"}
        </button>
      </form>
    </div>
  );
}
