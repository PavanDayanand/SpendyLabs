import { useMediaProtection } from "./useMediaProtection";
import { lazy, Suspense, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { ReadingProgress } from "./components/ReadingProgress";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { UpdatesPage } from "./pages/UpdatesPage";

const RefractedPreviewPage = lazy(() => import("./pages/RefractedPreviewPage"));

export default function App() {
  useMediaProtection();
  const { pathname, hash, state } = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Spendy | Money makes sense.",
      "/updates": "Build notes | Spendy",
      "/privacy": "Privacy Policy | Spendy",
      "/preview/refracted": "Refracted text preview | Spendy",
    };
    document.title = titles[pathname] || "Page not found | Spendy";
    if (state?.preserveScroll) return;
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash, state]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ReadingProgress />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/preview/refracted" element={<Suspense fallback={<p>Loading preview…</p>}><RefractedPreviewPage /></Suspense>} />
          <Route path="/" element={<HomePage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route
            path="*"
            element={
              <article className="document-page">
                <p className="eyebrow">404 / A little off track</p>
                <h1>Let's head home.</h1>
                <Link to="/" className="button">
                  Back to Spendy
                </Link>
              </article>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
