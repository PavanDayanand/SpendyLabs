import { useState } from "react";
import { RefractedText } from "../components/refracted-text";
import "./refracted-preview.css";

export default function RefractedPreviewPage() {
  const [text, setText] = useState("PRO");
  const [replay, setReplay] = useState(0);
  const [white, setWhite] = useState(false);
  const [animateBeam, setAnimateBeam] = useState(true);
  return (
    <section className="refraction-preview">
      <div className="refraction-preview__intro">
        <p className="eyebrow">Spendy · Visual experiment</p>
        <h1>A little light. A different feel.</h1>
        <p>Try the original PRO treatment or see the same glass effect on Spendy’s name.</p>
        <div className="refraction-preview__controls">
          <button type="button" aria-pressed={text === "PRO"} onClick={() => setText("PRO")}>Original · PRO</button>
          <button type="button" aria-pressed={text === "SPENDY"} onClick={() => setText("SPENDY")}>Spendy</button>
          <button type="button" onClick={() => setReplay(value => value + 1)}>Replay entrance</button>
          <label><input type="checkbox" checked={white} onChange={event => setWhite(event.target.checked)} /> Pure-white light</label>
          <label><input type="checkbox" checked={animateBeam} onChange={event => setAnimateBeam(event.target.checked)} /> Animate beam</label>
        </div>
      </div>
      <div className="refraction-preview__canvas">
        <RefractedText key={`${text}-${replay}`} text={text} theme="dark"
          topColor="auto" bottomColor="auto" beamColor={white ? "#ffffff" : "auto"}
          spectrumWarmColor="auto" spectrumMiddleColor="auto" spectrumCoolColor="auto"
          reveal={true} stagger={0.55} liftDuration={1.75} ease="power4.out"
          beamFollowsLift={false} animateBeam={animateBeam} openingDuration={6.9}
          duration={13.2} intensity={1.2} dispersion={1} colorIntensity={white ? 0 : 1}
          beamPosition={0.5} fixedBeam={false} paused={false} cursorMovesBeam={false}
          fontSize="400px" fontFamily="'ReactDrops Square Display', 'Arial Black', sans-serif"
          fontWeight={900} letterSpacing="normal" extraBold={2.25} fontHeight={80} cornerRounding={1}
        />
      </div>
      <p className="refraction-preview__note">Move your cursor over the lettering to bend the light. This is a design preview; PRO does not announce a paid plan.</p>
    </section>
  );
}
