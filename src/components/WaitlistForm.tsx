import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { joinWaitlist, resetWaitlist } from "../store/waitlistSlice";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.waitlist);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    dispatch(joinWaitlist({ email, consent, website }));
  }

  if (status === "success")
    return (
      <div className="signup-success" role="status">
        <h3>You're on the list.</h3>
        <p>
          Thanks for being here early. We'll email you when beta invitations are
          ready.
        </p>
        <button
          className="text-button"
          onClick={() => {
            dispatch(resetWaitlist());
            setEmail("");
            setConsent(false);
          }}
        >
          Use another email
        </button>
      </div>
    );

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <label htmlFor="waitlist-email">Your email address</label>
      <div className="email-row">
        <input
          id="waitlist-email"
          type="email"
          name="email"
          placeholder="you@something.cool"
          required
          maxLength={254}
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "loading"}
          aria-describedby={error ? "signup-error" : undefined}
        />
        <button
          className="button"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining…" : "Count me in"}
        </button>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website-field">Website</label>
        <input
          id="website-field"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <label className="consent">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          Email me about Spendy's beta and launch.{" "}
          <Link to="/privacy">Privacy details</Link>.
        </span>
      </label>
      {error && (
        <p id="signup-error" className="form-error" role="alert">
          {error}
        </p>
      )}
      <p className="form-footnote">
        Just the good stuff. No launch date promises.
      </p>
    </form>
  );
}
