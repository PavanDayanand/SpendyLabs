import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSiteReducedMotion } from "../AnimationPreferences";
import TearTicket from "./TearTicket";
import "./waitlist-ticket.css";

export function WaitlistTicket({ email }: { email: string }) {
  const reduceMotion = useSiteReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(true);
  const [torn, setTorn] = useState(false);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    dialog?.querySelector<HTMLElement>(".tear-ticket__piece--stub")?.focus();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <dialog ref={dialogRef} className="ticket-reveal" data-reduced-motion={reduceMotion || undefined} aria-labelledby="ticket-reveal-title"
      aria-describedby="ticket-reveal-description" onCancel={() => setOpen(false)}>
      <div className="ticket-smoke" aria-hidden="true" />
      <button className="ticket-close" type="button" aria-label="Close ticket" onClick={() => setOpen(false)}>×</button>
      <div className="ticket-reveal-center">
        <div className="ticket-reveal-intro">
          <p className="eyebrow">WELCOME TO SPENDY</p>
          <h3 id="ticket-reveal-title">A little something for being early.</h3>
        </div>
        <div className="waitlist-ticket-scene">
          <div className="ticket-stickers" aria-hidden="true">
            <span className="ticket-sticker ticket-sticker-coin">₹</span>
            <span className="ticket-sticker ticket-sticker-note"><span>$</span><i /><i /></span>
            <span className="ticket-sticker ticket-sticker-spark">✳</span>
            <span className="ticket-sticker ticket-sticker-plus">+</span>
          </div>
        <div className="waitlist-ticket">
          <TearTicket width={560} height={300} stubSize={140} rotate={-3} tiltMax={4}
            background="var(--field)" color="var(--ink)" onTear={() => setTorn(true)}
            ariaLabel="Tear off your Spendy waitlist ticket stub"
            stub={<div className="waitlist-ticket-stub">
              <span>WAITLIST</span>
              <strong>You’re in.</strong>
              <span className="ticket-pull">Pull here <span aria-hidden="true">↗</span></span>
            </div>}>
            <div className="waitlist-ticket-body">
              <div className="ticket-brand"><img src="/images/spendy-ios-icon-dark.png" alt="" width="42" height="42" /><span>Spendy</span></div>
              <p className="ticket-message">Good things<br />start small.</p>
              <div className="ticket-email"><span>RESERVED FOR</span><span title={email}>{email}</span></div>
              <div className="ticket-footer"><span>YOUR EARLY HELLO.</span><span>SPENDY FOR iOS</span></div>
            </div>
          </TearTicket>
        </div>
        </div>
        <div className="ticket-reveal-outro" aria-live="polite">
          <p id="ticket-reveal-description">{torn ? "You’re on the list. We’ll email you when there’s news." : "Your signup is confirmed. Pull the edge to make it yours."}</p>
          {torn ? <button className="ticket-done" type="button" onClick={() => setOpen(false)}>Back to Spendy <span aria-hidden="true">↗</span></button>
            : <p className="ticket-keyboard-hint">Or press Enter / Space on the ticket edge.</p>}
        </div>
      </div>
    </dialog>, document.body,
  );
}
