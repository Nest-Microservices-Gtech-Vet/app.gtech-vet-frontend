import { jsx as _jsx } from "react/jsx-runtime";
// src/pages/empresas/EmpresaDetailPage.tsx
import { useParams } from "react-router-dom";
import EmpresaDetail from "./EmpresaById";
const EmpresaDetailPage = () => {
    const { id } = useParams();
    if (!id)
        return _jsx("div", { children: "ID de empresa no proporcionado" });
    return _jsx(EmpresaDetail, { empresaId: Number(id) });
};
export default EmpresaDetailPage;
