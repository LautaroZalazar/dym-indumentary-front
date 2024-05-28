import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth, Home } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
