import { createRoot } from "react-dom/client";
import "./firebase-config.ts";
import "./index.css";

import { LanguageProvider } from "./Context/languageContext.tsx";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.tsx";

import store from "./store/index.ts";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </LanguageProvider>
);
