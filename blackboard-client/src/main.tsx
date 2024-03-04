import ReactDOM from "react-dom/client";
import "./index.css";
import RouteComponent from "./components/router";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-auth-kit";

ReactDOM.createRoot(document.getElementById("root")!).render(
    //axios 중복 호출 문제때문에 React.StrictMode 제거
    <AuthProvider authType="localstorage" authName={"_auth"}>
      <BrowserRouter>
        <RouteComponent />
      </BrowserRouter>
    </AuthProvider>
);
