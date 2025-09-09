import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Empresa } from "../../../types/empresa/empresa";
import { useAuth } from "../../../context/AuthContext";
import { Building2, User, LogOut, ChevronDown } from "lucide-react";

type HeaderEmpresaProps = {
  title?: string;
};

const pageTitles: Record<string, string> = {
  "/mis-empresas/:id/dashboard": "Dashboard",
  "/users": "Usuarios",
  "/user": "Usuario",
  "/user-create": "Agregar Usuarios",
};

const HeaderEmpresa = ({ title }: HeaderEmpresaProps) => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedEmpresa = localStorage.getItem("empresaSeleccionada");
    if (storedEmpresa) {
      setEmpresa(JSON.parse(storedEmpresa));
    }
  }, []);

  // Cerrar menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTitle = () => {
    if (title) return title;
    if (location.pathname.startsWith("/mis-empresas/")) return "Dashboard";
    return pageTitles[location.pathname] || "Dashboard";
  };

  return (
    <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="flex justify-between items-center mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Nombre de la empresa */}
        <div>
          {empresa && (
            <p className="text-base text-gray-700 mt-1">
              {empresa.emp_nombre}
            </p>
          )}
        </div>

        {/* Menú de usuario */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2 text-base text-gray-800 font-medium hover:text-sky-600 focus:outline-none"
          >
            <span>
              {user
                ? `${user.usua_nombre} ${user.usua_apellido}`
                : "No autenticado"}
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {isMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 
                         animate-fade-in"
            >
              <button
                onClick={() => {
                  navigate("/mis-empresas");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Building2 size={16} /> Mis empresas
              </button>

              <button
                onClick={() => {
                  navigate("/user");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <User size={16} /> Perfil
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
              >
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderEmpresa;
