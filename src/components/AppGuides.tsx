import { useState } from "react";
import { appGuides } from "../data/appGuides";
import { Reveal } from "./Reveal";
import { SetupVisual } from "./SetupVisual";
import { FeaturePanel, FeatureTabs } from "./FeatureTabs";

const locations = [
  "Home → Recent activity → See all",
  "Home menu → Budget",
  "Subscriptions",
  "Home → Analytics → Category spending",
];

export function AppGuides() {
  const [selected, setSelected] = useState(0);
  const guide = appGuides[selected];
  return (
    <section className="section guide-section" id="guides">
      <Reveal className="section-heading compact-heading">
        <div>
          <p className="eyebrow">01 / THE APP, AT A GLANCE</p>
          <h2>
            A place for each part
            <br />
            <span className="muted">of your money.</span>
          </h2>
        </div>
        <p>
          Pick a part of Spendy. See what it does, where to find it, and how to
          get started.
        </p>
      </Reveal>
      <FeatureTabs
        id="app-guide"
        label="Explore the app"
        items={appGuides.map((item) => item.name)}
        selected={selected}
        onSelect={setSelected}
      />
      <FeaturePanel id="app-guide" selected={selected}>
        <div className="product-explorer">
          <div className="guide-info">
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
            <div className="location-note">
              <span className="eyebrow">FIND IT IN SPENDY</span>
              <p>{locations[selected]}</p>
            </div>
            <details className="more-details">
              <summary>
                How to use {guide.name.toLowerCase()}
                <span className="disclosure" aria-hidden="true">
                  +
                </span>
              </summary>
              <ol className="compact-steps">
                {guide.steps.map((step) => (
                  <li key={step.title}>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </details>
          </div>
          <div className="guide-art">
            <SetupVisual topic={guide.name} />
            <p className="small-note">{guide.note}</p>
          </div>
        </div>
      </FeaturePanel>
    </section>
  );
}
