import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import UserList from "./components/users/UserList";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Usuarios from "./components/users/Usuarios";
import DashboardLayout from "./components/layout/DashboardLayout";
import CreateUserForm from "./components/users/CreateUserForm";
import EditUserForm from "./components/users/EditUserForm";
import EmpresasList from "./components/empresas/EmpresasList";
import { motion } from "framer-motion";
import CreateEmpresaForm from "./components/empresas/CreateEmpresaForm";
import MisEmpresas from "./components/empresas/MisEmpresas";
import UserListInactives from "./components/users/UserListInactives";
import EmpresaDetailPage from "./components/empresas/EmpresaDetailPage";
import EditEmpresaForm from "./components/empresas/EditEmpresaForm";
import EmpresasListInactive from "./components/empresas/EmpresasListInactive";
import EmpresaDetallePage from "./components/empresas/EmpresaDetallePage";
import DashboardEmpresa from "./components/empresas/admin/DashboardEmpresas";
import ClientesList from "./components/empresas/gestion-empresas/clientes/ClientesList";
import DashboardEmpresaLayout from "./components/empresas/admin/DashboardEmpresaLayout";
import CreateClienteForm from "./components/empresas/gestion-empresas/clientes/CreateClienteForm";
import EditClienteForm from "./components/empresas/gestion-empresas/clientes/EditClienteForm";
import MascotasList from "./components/empresas/gestion-empresas/mascotas/MascotasList";
import CreateMascotaForm from "./components/empresas/gestion-empresas/mascotas/CreateMascotaForm";
import EditMascotaForm from "./components/empresas/gestion-empresas/mascotas/EditMascotaForm";
import CreateConsultaForm from "./components/empresas/gestion-empresas/consultas/CreateConsultaForm";
import HistoriaClinicaList from "./components/empresas/gestion-empresas/historia-clinica/HistoriaClinicaList";
import EditConsultaForm from "./components/empresas/gestion-empresas/consultas/EditConsultaForm";
import CreateVacunasForm from "./components/empresas/gestion-empresas/vacunas/CreateVacunasForm";
import ConsultaDetalle from "./components/empresas/gestion-empresas/consultas/ConsultaDetalle";
const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : _jsx(Navigate, { to: "/login" });
};
// Layout sin sidebar ni header para ADMIN
const AdminOnlyLayout = ({ children }) => {
    return (_jsx("div", { className: "h-screen p-4 bg-white-900 text-white overflow-auto", children: children }));
};
const RoleBasedDashboard = () => {
    const { user } = useAuth();
    if (!user)
        return null;
    if (user.usua_rol === "ADMIN") {
        return _jsx(Navigate, { to: "/mis-empresas" });
    }
    return _jsx(DashboardLayout, {});
};
const MainLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs("div", { className: "flex h-screen bg-gray-900 text-gray-100 flex-initial overflow-auto relative z-10 ", children: [_jsx(Sidebar, { isOpen: isOpen, setIsOpen: setIsOpen }), _jsxs("div", { className: "flex flex-col flex-grow", children: [_jsx(Header, {}), _jsx("main", { className: "flex-grow min-w-0 p-4 overflow-auto  mx-auto ", children: _jsx(motion.div, { className: 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 mb-8', initial: { opacity: 0, y: 20 }, animate: { opacity: 15, y: 0 }, transition: { duration: 1 }, children: children }) })] })] }));
};
const App = () => {
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(DashboardLayout, {}) }) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(DashboardLayout, {}) }) }) }), _jsx(Route, { path: "/users", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(UserList, {}) }) }) }), _jsx(Route, { path: "/users/inactives", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(UserListInactives, {}) }) }) }), _jsx(Route, { path: "/user-create", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(CreateUserForm, {}) }) }) }), _jsx(Route, { path: "/user-edit/:userId", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(EditUserForm, {}) }) }) }), _jsx(Route, { path: "/user", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(Usuarios, {}) }) }) }), _jsx(Route, { path: "/empresas", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(EmpresasList, {}) }) }) }), _jsx(Route, { path: "/empresas/inactivas", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(EmpresasListInactive, {}) }) }) }), _jsx(Route, { path: "/empresa-create", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(CreateEmpresaForm, {}) }) }) }), _jsx(Route, { path: "/empresa/detalle/:id", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(EmpresaDetallePage, {}) }) }) }), _jsx(Route, { path: "/empresa-edit/:empresaId", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(EditEmpresaForm, {}) }) }) }), _jsx(Route, { path: "/empresas/:id", element: _jsx(PrivateRoute, { children: _jsx(MainLayout, { children: _jsx(EmpresaDetailPage, {}) }) }) }), _jsx(Route, { path: "/mis-empresas", element: _jsx(PrivateRoute, { children: _jsx(AdminOnlyLayout, { children: _jsx(MisEmpresas, {}) }) }) }), _jsxs(Route, { path: "/mis-empresas/:id", element: _jsx(PrivateRoute, { children: _jsx(DashboardEmpresaLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(DashboardEmpresa, {}) }), _jsx(Route, { path: "dashboard", element: _jsx(DashboardEmpresa, {}) }), _jsx(Route, { path: "clientes", element: _jsx(ClientesList, {}) }), _jsx(Route, { path: "clientes/crear-cliente", element: _jsx(CreateClienteForm, {}) }), _jsx(Route, { path: "clientes/editar-cliente/:clienteId", element: _jsx(EditClienteForm, {}) }), _jsx(Route, { path: "mascotas", element: _jsx(MascotasList, {}) }), _jsx(Route, { path: "mascotas/crear-mascota", element: _jsx(CreateMascotaForm, {}) }), _jsx(Route, { path: "mascotas/editar-mascota/:mascotaId", element: _jsx(EditMascotaForm, {}) }), _jsx(Route, { path: "mascotas/:mascotaId/historia-clinica", element: _jsx(HistoriaClinicaList, {}) }), _jsx(Route, { path: "mascotas/editar-mascota/:mascotaId/historia-clinica/nueva", element: _jsx(CreateConsultaForm, {}) }), _jsx(Route, { path: "mascotas/editar-mascota/:mascotaId/historia-clinica/:consultaId/modificar", element: _jsx(EditConsultaForm, {}) }), _jsx(Route, { path: "/mis-empresas/:id/mascotas/editar-mascota/:mascotaId/historia-clinica/consulta/:consultaId/vacuna/registrar", element: _jsx(CreateVacunasForm, {}) }), _jsx(Route, { path: "/mis-empresas/:id/mascotas/editar-mascota/:mascotaId/historia-clinica/consulta/:consultaId/ver", element: _jsx(ConsultaDetalle, {}) }), _jsx(Route, { path: "mascotas/:mascotaId/registrar-vacuna", element: _jsx(CreateVacunasForm, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login" }) })] }) }) }));
};
export default App;
