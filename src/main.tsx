import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.tsx";
import "./firebase-config.js";

import "./index.css";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { LanguageProvider } from "./Context/languageContext.tsx";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </LanguageProvider>
);
