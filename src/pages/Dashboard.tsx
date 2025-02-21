import { useEffect, useState } from "react";
import { Home, Table, CreditCard, Bell, User, LogIn, LogOut, Menu, User2, User2Icon, Users2Icon, Building2 } from "lucide-react";
import { logout } from "../services/auth";
import { Link, Route, Router, useNavigate } from "react-router-dom";


const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/"); // 🔥 Redirige al login si no hay sesión activa
    }
  }, [navigate]);

  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col h-full p-2">
        <div className="flex items-center justify-center p-4">
          <Menu size={28} />
        </div>
        <nav className="flex-1 space-y-4">
        <div onClick={() => navigate("/users")} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
        <Table />
        {isOpen && <span>Tables</span>}
          </div>
          {[
            { icon: <Home />, text: "Dashboard" },
            { icon: <Users2Icon />, text: "Usuarios" },
            { icon: <Building2 />, text: "Empresas" },
            { icon: <Bell />, text: "Notifications" },
            { icon: <User />, text: "Profile" },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
              {item.icon}
              {isOpen && <span>{item.text}</span>}
            </div>
          ))}
          <Link to="/users" className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"></Link>
        </nav>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
            <LogIn />
            {isOpen && <span>Sign In</span>}
          </div>
          <div
            className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut />
            {isOpen && <span>Salir del sistema</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`transition-all duration-300 p-6 flex-1 min-h-screen bg-gray-100 ${isOpen ? "ml-64" : "ml-16"
          }`}
      >
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
    
     
      </div>
    </div>
  );
};

export default Dashboard;
