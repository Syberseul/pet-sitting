import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.tsx";
import "./firebase-config.js";

import "./index.css";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { LanguageProvider } from "./Context/languageContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <LanguageProvider>
      <RouterProvider router={router}></RouterProvider>
    </LanguageProvider>
  </Provider>
);
