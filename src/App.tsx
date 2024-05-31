import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth, Home, ProductDetail } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<ProductDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
