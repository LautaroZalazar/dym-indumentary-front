import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./pages";
import Login from "./pages/auth/login/Login";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
