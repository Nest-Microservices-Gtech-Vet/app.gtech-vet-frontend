import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import SidebarEmpresa from "./SidebarEmpresa";
import HeaderEmpresa from "./HeaderEmpresa";

const LayoutEmpresa = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();



  const empresa = JSON.parse(localStorage.getItem("empresaSeleccionada") || "{}");


  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarEmpresa isOpen={isOpen} setIsOpen={setIsOpen} />


      <div className="flex-1 flex flex-col">
        <HeaderEmpresa title="" />

        <main className="flex-1 overflow-y-auto p-6 bg-white text-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutEmpresa;
