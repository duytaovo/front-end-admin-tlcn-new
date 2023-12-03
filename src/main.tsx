import React from "react";
import ReactDOM from "react-dom/client";
import App from "src/App";
import "src/i18n/i18n";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primeflex/primeflex.css"; // css utility
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css"; // core css
import "./flags.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { ConfigProvider } from "antd";
import { theme } from "./constants/antdConfig";
import GlobalStyles from "./components/GlobalStyles";
import { AppProvider } from "./contexts/app.context";
import { DarkModeProvider } from "./contexts/darkModeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ConfigProvider theme={theme}>
      <Provider store={store}>
        <PrimeReactProvider>
          <GlobalStyles>
            <AppProvider>
              <DarkModeProvider>
                <App />
              </DarkModeProvider>
            </AppProvider>
          </GlobalStyles>
        </PrimeReactProvider>
      </Provider>
    </ConfigProvider>
  </BrowserRouter>,
  // </React.StrictMode>
);

