"use client";

import { useEffect, useMemo, useState } from "react";

const topics = [
  "AI Workforce",
  "Team AI Enablement",
  "CAIO™ Certification",
  "Enterprise AI transformation",
];

const whatsappNumber = "971525295577";

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        fill="currentColor"
        d="M16.03 3.2A12.55 12.55 0 0 0 5.4 22.43L3.2 28.8l6.58-2.12a12.56 12.56 0 1 0 6.25-23.48Zm0 22.81c-2 0-3.96-.58-5.62-1.67l-.4-.24-3.9 1.26 1.3-3.79-.26-.39A10.25 10.25 0 1 1 16.03 26Zm5.62-7.67c-.31-.15-1.82-.9-2.1-1-.28-.1-.49-.15-.69.15-.2.31-.8 1-.98 1.2-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.48-1.53a9.25 9.25 0 0 1-1.72-2.14c-.18-.31-.02-.47.14-.63.14-.14.31-.36.46-.54.15-.18.2-.31.31-.51.1-.21.05-.39-.03-.54-.08-.16-.69-1.67-.95-2.29-.25-.6-.5-.52-.69-.53h-.58c-.2 0-.52.08-.8.39-.28.3-1.05 1.02-1.05 2.5s1.08 2.91 1.23 3.12c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.82-.75 2.08-1.46.25-.72.25-1.34.18-1.47-.08-.12-.28-.2-.59-.35Z"
      />
    </svg>
  );
}

export function WhatsAppSupport() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Hi Lymora, I would like to discuss ");

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message.trim())}`;
  }, [message]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const selectTopic = (topic: string) => {
    setMessage(`Hi Lymora, I would like to discuss ${topic}.`);
  };

  return (
    <aside className={`whatsapp-support ${open ? "is-open" : ""}`} aria-label="WhatsApp support">
      <div className="whatsapp-panel" aria-hidden={!open}>
        <div className="whatsapp-panel-head">
          <div className="whatsapp-brand">
            <span><WhatsAppIcon size={22} /></span>
            <div><strong>Lymora support</strong><small>Continue the conversation in WhatsApp</small></div>
          </div>
          <button className="whatsapp-close" type="button" onClick={() => setOpen(false)} aria-label="Close WhatsApp support">×</button>
        </div>

        <div className="whatsapp-panel-body">
          <h2>How can we help?</h2>
          <p>Choose a topic or write a short message. We will take it from there.</p>
          <div className="whatsapp-topics" aria-label="Support topics">
            {topics.map(topic => (
              <button type="button" key={topic} onClick={() => selectTopic(topic)}>{topic}</button>
            ))}
          </div>
          <label htmlFor="whatsapp-message">Your message</label>
          <textarea
            id="whatsapp-message"
            value={message}
            onChange={event => setMessage(event.target.value)}
            rows={3}
          />
          <a
            className="whatsapp-send"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Continue this conversation in WhatsApp"
          >
            <WhatsAppIcon size={20} />
            Continue in WhatsApp
            <span>↗</span>
          </a>
        </div>
      </div>

      <button
        className="whatsapp-launcher"
        type="button"
        onClick={() => setOpen(current => !current)}
        aria-label={open ? "Close WhatsApp support" : "Open WhatsApp support"}
        aria-expanded={open}
      >
        <WhatsAppIcon size={29} />
      </button>
    </aside>
  );
}
