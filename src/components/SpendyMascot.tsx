import { useSiteReducedMotion } from "../AnimationPreferences";
import { useEffect, useRef, useState } from "react";
import type { Rive } from "@rive-app/webgl2";
import wasmUrl from "@rive-app/webgl2/rive.wasm?url";

/** The same coffee interaction used by the iPhone welcome screen. */
export function SpendyMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<Rive | null>(null);
  const reduceMotion = useSiteReducedMotion();
  const [ready, setReady] = useState(false);
  const [pose, setPose] = useState("idle");

  useEffect(() => {
    if (reduceMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    let disposed = false;
    let runtime: Rive | undefined;
    let resize: ResizeObserver | undefined;
    let visibility: IntersectionObserver | undefined;
    let inView = true;
    const updatePlayback = () => {
      if (document.hidden || !inView) runtime?.pause();
      else runtime?.play("Coffee");
    };

    void import("@rive-app/webgl2")
      .then(({ Rive, RuntimeLoader }) => {
        if (disposed) return;
        // Serve WASM with the site, so the mascot does not depend on a CDN.
        RuntimeLoader.setWasmUrl(wasmUrl);
        runtime = new Rive({
          src: "/mascot/spendy-coffee.riv",
          canvas,
          artboard: "Spendy Coffee",
          stateMachines: "Coffee",
          autoplay: true,
          autoBind: true,
          shouldDisableRiveListeners: true,
          onLoad: () => {
            if (disposed || !runtime) return;
            runtimeRef.current = runtime;
            runtime.resizeDrawingSurfaceToCanvas();
            setReady(true);
            resize = new ResizeObserver(() =>
              runtime?.resizeDrawingSurfaceToCanvas(),
            );
            resize.observe(canvas);
            visibility = new IntersectionObserver(([entry]) => {
              inView = entry.isIntersecting;
              updatePlayback();
            });
            visibility.observe(canvas);
            updatePlayback();
          },
          onStateChange: ({ data }) => {
            if (!disposed && Array.isArray(data)) {
              setPose(data.includes("Sip") ? "sip" : "idle");
            }
          },
          onLoadError: () => {
            if (!disposed) setReady(false);
          },
        });
      })
      .catch(() => {
        if (!disposed) setReady(false);
      });

    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", updatePlayback);
      resize?.disconnect();
      visibility?.disconnect();
      runtimeRef.current = null;
      runtime?.cleanup();
      setReady(false);
      setPose("idle");
    };
  }, [reduceMotion]);

  const sip = () => {
    if (!reduceMotion)
      runtimeRef.current?.viewModelInstance?.trigger("sip")?.trigger();
  };

  return (
    <button
      type="button"
      className="spendy-mascot"
      aria-label={
        reduceMotion ? "Spendy’s coffee character" : "Make Spendy sip coffee"
      }
      disabled={reduceMotion || !ready}
      data-pose={pose}
      data-ready={ready}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") sip();
      }}
      onClick={sip}
    >
      <img
        src="/mascot/spendy-coffee.svg"
        alt=""
        width="420"
        height="460"
        aria-hidden="true"
        style={{ opacity: ready && !reduceMotion ? 0 : 1 }}
      />
      <canvas
        ref={canvasRef}
        width="420"
        height="460"
        aria-hidden="true"
        style={{ opacity: ready && !reduceMotion ? 1 : 0 }}
      />
    </button>
  );
}
