import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import SidebarEmpresa from "./SidebarEmpresa";
import HeaderEmpresa from "./HeaderEmpresa";
const LayoutEmpresa = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const empresa = JSON.parse(localStorage.getItem("empresaSeleccionada") || "{}");
    return (_jsxs("div", { className: "flex h-screen overflow-hidden", children: [_jsx(SidebarEmpresa, { isOpen: isOpen, setIsOpen: setIsOpen }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(HeaderEmpresa, { title: "" }), _jsx("main", { className: "flex-1 overflow-y-auto p-6 bg-white text-gray-800", children: children })] })] }));
};
export default LayoutEmpresa;
