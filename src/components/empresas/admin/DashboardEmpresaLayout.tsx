import React from "react";
import { Outlet } from "react-router-dom";
import LayoutEmpresa from "./LayoutEmpresa";

const DashboardEmpresaLayout = () => {
  return (
    <LayoutEmpresa>
      <Outlet />
    </LayoutEmpresa>
  );
};

export default DashboardEmpresaLayout;
