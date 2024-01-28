import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RouteComponent from "./components/router";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-auth-kit";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider authType="localstorage" authName={"_auth"}>
      <BrowserRouter>
        <RouteComponent />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
