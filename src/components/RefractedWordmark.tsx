import { RefractedText } from "./refracted-text";
import "./refracted-wordmark.css";

export function RefractedWordmark() {
  return (
    <div className="refracted-wordmark">
      <div className="refracted-wordmark__canvas">
        <RefractedText
          text="SPENDY"
          theme="dark"
          topColor="auto"
          bottomColor="auto"
          beamColor="auto"
          spectrumWarmColor="auto"
          spectrumMiddleColor="auto"
          spectrumCoolColor="auto"
          reveal={false}
          stagger={0.55}
          liftDuration={1.75}
          ease="power4.out"
          beamFollowsLift={false}
          animateBeam={true}
          openingDuration={6.9}
          duration={13.2}
          intensity={1.2}
          dispersion={1}
          colorIntensity={1}
          beamPosition={0.5}
          fixedBeam={false}
          paused={false}
          cursorMovesBeam={false}
          fontSize="400px"
          fontFamily="'ReactDrops Square Display', 'Arial Black', sans-serif"
          fontWeight={900}
          letterSpacing="normal"
          extraBold={2.25}
          fontHeight={80}
          cornerRounding={1}
        />
      </div>
    </div>
  );
}
