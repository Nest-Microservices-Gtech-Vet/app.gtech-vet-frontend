import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserList from "./components/users/UserList";
import Sidebar from "./components/layout/Sidebar";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="flex">
        {isLoggedIn && <Sidebar />}
        <div className={`flex-1 transition-all ${isLoggedIn ? "ml-64" : "ml-0"}`}>
          <Routes>
            {!isLoggedIn ? (
              <>
               
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserList />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
