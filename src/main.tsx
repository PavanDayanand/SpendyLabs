import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import App from "./App";
import { AnimationPreferences } from "./AnimationPreferences";
import "./styles.css";
import "./interactive.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AnimationPreferences>
          <App />
        </AnimationPreferences>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
