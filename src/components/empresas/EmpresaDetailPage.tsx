// src/pages/empresas/EmpresaDetailPage.tsx
import { useParams } from "react-router-dom";
import EmpresaDetail from "./EmpresaById";


const EmpresaDetailPage = () => {
  const { id } = useParams();

  if (!id) return <div>ID de empresa no proporcionado</div>;

  return <EmpresaDetail empresaId={id} />;
};

export default EmpresaDetailPage;
