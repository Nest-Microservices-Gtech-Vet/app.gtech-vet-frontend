import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorCheck,
  PawPrint,
  SquareUser,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../../services/auth";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

// ✅ Creamos los ítems del sidebar usando el id dinámico
const getSidebarItems = (id: string | undefined) => [
  { name: "Dashboard", icon: LayoutDashboard, color: "#EC4899", href: `/mis-empresas/${id}/dashboard` },
  {
    name: "Perfil",
    icon: Users2,
    color: "#1E90FF",
    href: "#",
    submenu: [
      { name: "Crear Usuarios", href: "#" },
      {
        name: "Administrar Usuarios",
        href: "#",
        submenu: [
          { name: "Activos", href: "#" },
          { name: "Inactivos", href: "#" },
        ],
      },
    ],
  },
  { name: "Clientes", icon: SquareUser, color: "#EC4899", href: `/mis-empresas/${id}/clientes` },
  { name: "Pacientes", icon: PawPrint, color: "#32CD32", href: `/mis-empresas/${id}/pacientes` },
  { name: "Historial clínico", icon: MonitorCheck, color: "#8A2BE2", href: `/mis-empresas/${id}/historial` },
  { name: "Módulo-3", icon: MonitorCheck, color: "#20B2AA", href: `/mis-empresas/${id}/modulo3` },
];

const SidebarEmpresa = ({ isOpen, setIsOpen }: Props) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { id } = useParams();
  const navigate = useNavigate();

  const SIDEBAR_ITEMS = getSidebarItems(id); // ✅ Generamos los ítems dinámicamente

  useEffect(() => {
    if (!isOpen) {
      setOpenMenus({});
    }
  }, [isOpen]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMenuItems = (items: any[], level = 0, parentKey = "") => {
    return items.map((item, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isExpanded = !!openSubmenus[key];

      return (
        <div key={key}>
          <div
            onClick={() => {
              if (hasSubmenu) {
                toggleMenu(key);
              } else {
                navigate(item.href);
                setIsMobileOpen(false);
              }
            }}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-1 ${level > 0 ? `ml-${level * 4}` : ""}`}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <item.icon size={18} style={{ color: item.color }} />}
              {isOpen && <span className="text-base font-medium">{item.name}</span>}
            </div>
            {hasSubmenu && isOpen && (
              <ChevronDown
                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                size={16}
              />
            )}
          </div>

          <AnimatePresence>
            {hasSubmenu && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-4"
              >
                {renderMenuItems(item.submenu, level + 1, key)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md text-black"
      >
        <Menu size={24} />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <motion.div
        className={`fixed md:relative top-0 left-0 h-full bg-white text-black transition-all duration-200 z-50
        ${isMobileOpen ? "w-64" : "w-20"} md:w-20 md:hover:w-64`}
        animate={{ width: isMobileOpen ? 256 : isOpen ? 256 : 80 }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="h-full bg-white bg-opacity-50 backdrop-blur-md shadow-lg p-4 flex flex-col border-r border-gray-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-white-700 transition-colors max-w-fit"
          >
            <h1>Menú</h1>
          </motion.button>

          <nav className="mt-8 flex-grow">
            {renderMenuItems(SIDEBAR_ITEMS)}

            <div
              className="flex items-center space-x-3 p-2 hover:bg-white-700 rounded-lg cursor-pointer mt-4"
              onClick={() => {
                logout();
                navigate("/");
                setIsMobileOpen(false);
              }}
            >
              <LogOut />
              {isOpen && <span>Salir del sistema</span>}
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarEmpresa;
