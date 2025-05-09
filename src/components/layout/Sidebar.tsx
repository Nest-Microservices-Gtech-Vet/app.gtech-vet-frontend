import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronDown, LayoutDashboard, LogOut, Menu, Users2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

const SIDEBAR_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard, color: "#EC4899", href: "/" },
    {
      name: "Usuarios",
      icon: Users2,
      color: "#10B981",
      href: "#", // No necesita un href si tiene submenú
      submenu: [
        { name: "Crear Usuarios", href: "/user-create" },
        { name: "Administrar Usuarios", href: "/users" },
      ],
    },
    { name: "Empresas", icon: Building2, color: "#3B82F6", href: "#",submenu: [
      { name: "Crear Empresas", href: "/empresa-create" },
      { name: "Administrar Empresas", href: "/empresas" },
    ],
   },
    { name: "Configuraciones", icon: LayoutDashboard, color: "#8B5CF6", href: "/user" },
  ];

  const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null); // Tipamos como number o null
    const navigate = useNavigate();
  
    const toggleSubmenu = (index: number) => {
      setOpenSubmenu(openSubmenu === index ? null : index);
    };
  
    return (
      <>
        {/* Botón Hamburguesa (Sólo en Móviles) */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md text-white"
        >
          <Menu size={24} />
        </button>
  
        {/* Overlay en móviles */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
  
        {/* Sidebar */}
        <motion.div
          className={`fixed md:relative top-0 left-0 h-full bg-gray-900 text-white transition-all duration-200 z-50
            ${isMobileOpen ? "w-64" : "w-20"} md:w-20 md:hover:w-64`}
          animate={{ width: isMobileOpen ? 256 : isOpen ? 256 : 80 }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
            {/* Botón del menú */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
            >
              <h1>Menú</h1>
            </motion.button>
  
            {/* Navegación */}
            <nav className="mt-8 flex-grow">
              {SIDEBAR_ITEMS.map((item, index) => (
                <div key={item.href}>
                  <div
                    onClick={() => {
                      if (item.submenu) {
                        toggleSubmenu(index); // Abrir/cerrar submenú
                      } else {
                        navigate(item.href); // Navegar si no tiene submenú
                        setIsMobileOpen(false); // Cerrar sidebar en móviles
                      }
                    }}
                    className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
                  >
                    <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap flex-grow"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.1, delay: 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {item.submenu && (isOpen || !isMobileOpen) && (
                      <ChevronDown
                        className={`ml-2 transition-transform ${
                          openSubmenu === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
  
                  {/* Submenú */}
                  <AnimatePresence>
                    {openSubmenu === index && item.submenu && isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-8"
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            onClick={() => {
                              navigate(subItem.href); // Navegar al subitem
                              setIsMobileOpen(false); // Cerrar sidebar en móviles
                            }}
                            className="block p-2 text-sm hover:bg-gray-700 rounded-lg mb-1 cursor-pointer"
                          >
                            {subItem.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
  
              {/* Botón de Cerrar Sesión */}
              <div
                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
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
