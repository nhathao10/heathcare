import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dat-lich" element={<BookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
