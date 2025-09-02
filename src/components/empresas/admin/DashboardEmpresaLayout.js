import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import LayoutEmpresa from "./LayoutEmpresa";
const DashboardEmpresaLayout = () => {
    return (_jsx(LayoutEmpresa, { children: _jsx(Outlet, {}) }));
};
export default DashboardEmpresaLayout;
