import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { ConfirmModalProvider } from "./components/confirm-modal/ConfirmModalContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfirmModalProvider>
      <App />
    </ConfirmModalProvider>
  </Provider>
);
