import { useEffect, useRef, useState } from "react";
import { FanGallery, type FanGalleryItem } from "./fan-gallery";
import { useSiteReducedMotion } from "../AnimationPreferences";
import "./app-showcase.css";

// These are real simulator captures, using a separate synthetic ledger.
const screenshots: FanGalleryItem[] = [
  {
    src: "/images/app/subscriptions.png",
    alt: "Spendy subscriptions with upcoming Music, Cloud storage and Film club renewals",
  },
  {
    src: "/images/app/analytics.png",
    alt: "Spendy Analytics with spending trends and category breakdowns",
  },
  {
    src: "/images/app/home.png",
    alt: "Spendy Home with spending summary and recent entries",
  },
  { src: "/images/app/entry.png", alt: "The native Spendy add-entry screen" },
  { src: "/images/app/home-dark.png", alt: "Spendy Home in dark mode" },
];

export function AppShowcase() {
  const [selectedImage, setSelectedImage] = useState<FanGalleryItem | null>(
    null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduceMotion = useSiteReducedMotion();

  // Native dialog handles focus trapping, Escape and returning focus to the card.
  useEffect(() => {
    if (selectedImage) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [selectedImage]);

  return (
    <section
      className="app-showcase section"
      id="guides"
      aria-labelledby="app-showcase-title"
    >
      <div className="showcase-heading">
        <p className="eyebrow">A LITTLE LOOK INSIDE</p>
        <h2 id="app-showcase-title">
          Meet Spendy.
          <br />
          <span className="muted">From the inside.</span>
        </h2>
        <p>Your entries. Your patterns. A little more clarity.</p>
      </div>
      {reduceMotion ? (
        <div className="screenshot-static-gallery">
          {screenshots.map((image) => (
            <button
              type="button"
              key={image.src}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
            </button>
          ))}
        </div>
      ) : (
        <FanGallery
          items={screenshots}
          onSelect={setSelectedImage}
          cardWidth={162}
          aspectRatio={0.8}
          spacing={0.69}
          curve={0.14}
          tilt={14.5}
          lift={42}
          spread={0.2}
          stackFrom="left"
          speed={0.7}
          stagger={0.09}
          bounce={0.35}
          hoverSpeed={0.28}
          radius={18}
          entrance="stack"
          trigger="scroll"
          viewportStart={75}
          once={true}
          showTitle={false}
          ariaLabel="Real Spendy app screenshots"
          className="spendy-screenshot-fan"
        />
      )}
      <p className="showcase-caption">
        A few screens from the app in development. Tap one for a closer look.
        <br />
        Sample data, captured on iPhone Simulator.
      </p>
      <div className="screenshot-features">
        <article id="insights">
          <div className="screenshot-feature-copy">
            <p className="eyebrow">SEE THE PATTERN</p>
            <h3>Where did it go?</h3>
            <p>A clearer picture of the spending you add.</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedImage(screenshots[1])}
            aria-label="Enlarge the Analytics screenshot"
          >
            <img
              src={screenshots[1].src}
              alt={screenshots[1].alt}
              loading="lazy"
              width="402"
              height="874"
            />
          </button>
        </article>
        <article id="receipt">
          <div className="screenshot-feature-copy">
            <p className="eyebrow">KEEP IT SIMPLE</p>
            <h3>Start with one entry.</h3>
            <p>A coffee, a grocery run. The everyday stuff.</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedImage(screenshots[3])}
            aria-label="Enlarge the add-entry screenshot"
          >
            <img
              src={screenshots[3].src}
              alt={screenshots[3].alt}
              loading="lazy"
              width="402"
              height="874"
            />
          </button>
        </article>
      </div>
      <dialog
        ref={dialogRef}
        className="screenshot-dialog"
        onClose={() => setSelectedImage(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedImage(null);
        }}
        aria-label="App screenshot preview"
      >
        <button
          className="screenshot-close"
          type="button"
          onClick={() => setSelectedImage(null)}
          autoFocus
        >
          Close ×
        </button>
        {selectedImage && (
          <img src={selectedImage.src} alt={selectedImage.alt} />
        )}
      </dialog>
    </section>
  );
}
