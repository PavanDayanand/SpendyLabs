import { useEffect } from "react";

// Deter casual saving. Publicly displayed media cannot be made copy-proof.
export function useMediaProtection() {
  useEffect(() => {
    function preventMediaSave(event: Event) {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(
          "img, picture, video, canvas, .fan-gallery-card, .screenshot-frame",
        )
      ) {
        event.preventDefault();
      }
    }
    document.addEventListener("contextmenu", preventMediaSave);
    document.addEventListener("dragstart", preventMediaSave);
    return () => {
      document.removeEventListener("contextmenu", preventMediaSave);
      document.removeEventListener("dragstart", preventMediaSave);
    };
  }, []);
}
