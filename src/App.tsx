import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth, Home } from "./pages";
import NavbarMobile from '../src/components/navbar/navbarMobile/NavbarMobile'
import SubNavbarMobile from '../src/components/navbar/navbarMobile/SubNavbarMobile'

function App() {
  return (
    <Router>
		<SubNavbarMobile />
		<div className="pb-16 pt-12">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
	  </div>
	  <NavbarMobile />
    </Router>
  );
}

export default App;
