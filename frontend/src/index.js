import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import "bootstrap/dist/js/bootstrap.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "flag-icon-css/css/flag-icons.min.css";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "/assets/locales/{{lng}}/translation.json",
    },
    supportedLngs: ["en", "fr", "es", "tr"],

    react: { useSuspense: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

axios.defaults.baseURL = "http://127.0.0.1:8000/";
