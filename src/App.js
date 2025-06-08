import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import AdminStatsPage from "./pages/AdminStatsPage";
import AdminSpecialtiesPage from "./pages/AdminSpecialtiesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dat-lich" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/stats" element={<AdminStatsPage />} />
        <Route path="/admin/specialties" element={<AdminSpecialtiesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
