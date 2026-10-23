import { useEffect, useRef, useState } from "react";
import type { Rive } from "@rive-app/webgl2";
import wasmUrl from "@rive-app/webgl2/rive.wasm?url";

/** Plays the ribbon reveal once when the Insights heading enters view. */
export function SpendyInsightsLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (reduceMotion || !canvas) return;
    let disposed = false;
    let started = false;
    let completed = false;
    let inView = false;
    let runtime: Rive | undefined;
    let resize: ResizeObserver | undefined;
    const playback = () => {
      if (completed) return;
      if (document.hidden || !inView) runtime?.pause();
      else runtime?.play("Ribbon Reveal");
    };
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView || started) {
        playback();
        return;
      }
      started = true;
      void import("@rive-app/webgl2").then(({ Rive, RuntimeLoader }) => {
        if (disposed) return;
        RuntimeLoader.setWasmUrl(wasmUrl);
        runtime = new Rive({
          src: "/insights/spendy-insights.riv",
          canvas,
          artboard: "Spendy Insights · Ribbon Reveal",
          animations: "Ribbon Reveal",
          autoplay: false,
          shouldDisableRiveListeners: true,
          onLoad: () => {
            if (disposed || !runtime) return;
            runtime.resizeDrawingSurfaceToCanvas();
            resize = new ResizeObserver(() => runtime?.resizeDrawingSurfaceToCanvas());
            resize.observe(canvas);
            setReady(true);
            playback();
          },
          onStop: () => { completed = true; },
          onLoadError: () => { if (!disposed) setReady(false); },
        });
      }).catch(() => { if (!disposed) setReady(false); });
    }, { threshold: 0.2 });
    visibility.observe(canvas);
    document.addEventListener("visibilitychange", playback);
    return () => {
      disposed = true;
      visibility.disconnect();
      resize?.disconnect();
      document.removeEventListener("visibilitychange", playback);
      runtime?.cleanup();
      setReady(false);
    };
  }, [reduceMotion]);

  return (
    <span className="spendy-insights-logo" aria-hidden="true" data-ready={ready}>
      <img src="/images/SpendyInsight.png" alt="" width="64" height="64"
        style={{ opacity: ready && !reduceMotion ? 0 : 1 }} />
      <canvas ref={canvasRef} width="128" height="128"
        style={{ opacity: ready && !reduceMotion ? 1 : 0 }} />
    </span>
  );
}
