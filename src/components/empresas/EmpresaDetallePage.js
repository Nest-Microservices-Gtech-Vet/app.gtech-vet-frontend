import { jsx as _jsx } from "react/jsx-runtime";
// src/pages/empresas/EmpresaDetailPage.tsx
import { useParams } from "react-router-dom";
import EmpresaDetalle from "./EmpresaDetelle";
const EmpresaDetallePage = () => {
    const { id } = useParams();
    if (!id)
        return _jsx("div", { children: "ID de empresa no proporcionado" });
    return _jsx(EmpresaDetalle, { empresaId: id });
};
export default EmpresaDetallePage;
