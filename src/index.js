import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import "rsuite/dist/rsuite.min.css";
import Routers from "./routes";
import store, { persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router } from "react-router-dom";
import { CountdownProvider } from "./context/CountdownContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <CountdownProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Router>
              <Routers />
            </Router>
        </PersistGate>
      </Provider>
    </CountdownProvider>
  </AuthProvider>
);
