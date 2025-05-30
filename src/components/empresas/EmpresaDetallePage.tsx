// src/pages/empresas/EmpresaDetailPage.tsx
import { useParams } from "react-router-dom";
import EmpresaDetail from "./EmpresaById";
import EmpresaDetalle from "./EmpresaDetelle";


const EmpresaDetallePage = () => {
  const { id } = useParams();

  if (!id) return <div>ID de empresa no proporcionado</div>;

  return <EmpresaDetalle empresaId={id} />;
};

export default EmpresaDetallePage;
