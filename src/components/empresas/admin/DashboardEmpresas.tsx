import { useEffect, useState } from "react";
import LayoutEmpresa from "./LayoutEmpresa";
import { useNavigate, useParams } from "react-router-dom";


const DashboardEmpresa = () => {
    const [empresa, setEmpresa] = useState<any>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const storedEmpresa = localStorage.getItem("empresaSeleccionada");
        if (storedEmpresa) {
            setEmpresa(JSON.parse(storedEmpresa));
        }

        // Asegurar tema claro
        document.documentElement.classList.remove("dark");
    }, []);

    if (!empresa) return <p>Cargando empresa...</p>;
    return (
        <LayoutEmpresa>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p>Aquí puedes mostrar widgets, estadísticas, etc.</p>
        </LayoutEmpresa>
    );
};

export default DashboardEmpresa;
