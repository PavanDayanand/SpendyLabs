import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import App from "./App";
import { ThemeProvider } from "./Theme";
import { AnimationPreferences } from "./AnimationPreferences";
import "./styles.css";
import "./interactive.css";
import "./theme.css";
import "./components/product-motion.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AnimationPreferences>
          <ThemeProvider><App /></ThemeProvider>
        </AnimationPreferences>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
