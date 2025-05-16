import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, color: "#EC4899", href: "/" },
  {
    name: "Usuarios",
    icon: Users2,
    color: "#10B981",
    href: "#",
    submenu: [
      { name: "Crear Usuarios", href: "/user-create" },
      {
        name: "Administrar Usuarios",
        href: "#",
        submenu: [
          { name: "Activos", href: "/users" },
          { name: "Inactivos", href: "/users/inactives" },
        ],
      },
    ],
  },
  {
    name: "Empresas",
    icon: Building2,
    color: "#3B82F6",
    href: "#",
    submenu: [
      { name: "Mis Empresas", href: "/mis-empresas" },
      { name: "Crear Empresas", href: "/empresa-create" },
      { name: "Administrar Empresas", href: "/empresas" },
    ],
  },
  {
    name: "Configuraciones",
    icon: LayoutDashboard,
    color: "#8B5CF6",
    href: "/user",
  },
];

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

   // Cierra submenús si se colapsa el sidebar
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
        {/* Ítem principal */}
        <div
          onClick={() => {
            if (hasSubmenu) {
              toggleMenu(key);
            } else {
              navigate(item.href);
              setIsMobileOpen(false);
            }
          }}
          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors mb-1 ${level > 0 ? `ml-${level * 4}` : ""}`}
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

        {/* Submenú si está expandido */}
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
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md text-white"
      >
        <Menu size={24} />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <motion.div
        className={`fixed md:relative top-0 left-0 h-full bg-gray-900 text-white transition-all duration-200 z-50
        ${isMobileOpen ? "w-64" : "w-20"} md:w-20 md:hover:w-64`}
        animate={{ width: isMobileOpen ? 256 : isOpen ? 256 : 80 }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
          >
            <h1>Menú</h1>
          </motion.button>

          <nav className="mt-8 flex-grow">
            {renderMenuItems(SIDEBAR_ITEMS)}

            <div
              className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer mt-4"
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

export default Sidebar;
