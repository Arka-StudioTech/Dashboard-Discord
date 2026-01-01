import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PartnersPage from "./pages/parntr";
import { LanguageProvider } from "./LanguageContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard/Dashboard.jsx"
import ServerControlPanel from './pages/Dashboard/ServerControlPanel.jsx';
function ProtectedRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/check-admin", { withCredentials: true })
      .then((response) => {
        console.log("Admin check response:", response.data);
        setIsAdmin(response.data.isAdmin);
      })
      .catch((error) => {
        console.error("Error checking admin:", error);
        setIsAdmin(false);
      });
  }, []);

  if (isAdmin === null) return <div>Loading...</div>;

  return isAdmin ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/server/:id/overview" element={<ServerControlPanel />} />
          <Route
            path="/admin/partner"
            element={
              <ProtectedRoute>
                <PartnersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
