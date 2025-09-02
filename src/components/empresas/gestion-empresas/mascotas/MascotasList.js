import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMascotas, removeMascota } from "../../../../services/gestion-empresa/mascotas/mascotas";
import Swal from "sweetalert2";
const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
};
const MascotasList = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        const fetchMascotas = async () => {
            setLoading(true);
            try {
                const empresaId = Number(id);
                const data = await getMascotas(empresaId, debouncedSearch);
                if (Array.isArray(data)) {
                    setMascotas(data);
                }
                else {
                    console.error("La respuesta no es un array:", data);
                }
            }
            catch (error) {
                console.error("Error al obtener mascotas:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMascotas();
    }, [id, debouncedSearch]);
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const crearMascota = () => {
        navigate(`/mis-empresas/${id}/mascotas/crear-mascota`);
    };
    const updatedMascota = (mascotaId) => {
        navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}`);
    };
    const historiClinica = (mascotaId) => {
        navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica`);
    };
    const removedMascota = async (mascotaId) => {
        const result = await Swal.fire({
            title: "¿Estás seguro de desactivar este registro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Desactivar",
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            const desactMascota = await removeMascota(mascotaId);
            if (desactMascota) {
                Swal.fire("Registro Desactivado!", "El Cliente ha sido desactivado.", "success");
                setMascotas((prevMascotas) => prevMascotas.filter((mascotas) => mascotas.mas_id !== mascotaId));
            }
            else {
                Swal.fire("Error", "No se pudo desactivar el cliente.", "error");
            }
        }
    };
    return (_jsxs("div", { className: "max-w-full flex flex-col items-center bg-gray-50 text-black p-15", children: [_jsxs("div", { className: "w-full bg-white rounded-lg shadow-sm px-6 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 w-full md:w-1/3 text-left", children: "\uD83D\uDC36 Nuestras Mascotas" }), _jsxs("div", { className: "w-full md:w-1/3 relative", children: [_jsx("span", { className: "absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400", children: "\uD83D\uDD0D" }), _jsx("input", { type: "text", placeholder: "Buscar mascota...", value: search, onChange: handleSearchChange, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsx("div", { className: "w-full md:w-1/3 text-left md:text-right", children: _jsx("button", { className: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300", onClick: crearMascota, children: "\u2795 Crear Mascota" }) })] }), _jsx("div", { className: "w-full overflow-x-auto", children: _jsxs("table", { className: "w-full bg-gray-50 rounded-lg overflow-hidden", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { className: "text-left", children: [_jsx("th", { className: "p-2", children: "Nombres" }), _jsx("th", { className: "p-2", children: "Fecha Nacimiento" }), _jsx("th", { className: "p-2", children: "Especie" }), _jsx("th", { className: "p-2", children: "Color" }), _jsx("th", { className: "p-2", children: "Esterilizado" }), _jsx("th", { className: "p-2", children: "Estado" }), _jsx("th", { className: "p-2", children: "Acciones" }), _jsx("th", { className: "p-2", children: "Medico" }), _jsx("th", { className: "p-2", children: "Desactivar" })] }) }), _jsx("tbody", { children: mascotas.map((mascota, index) => (_jsxs("tr", { className: "shadow-amber-50", children: [_jsx("td", { className: "p-2 whitespace-nowrap", children: mascota.mas_nombre }), _jsx("td", { className: "p-2 whitespace-nowrap", children: mascota.mas_fechaNac?.split('T')[0] || "" }), _jsxs("td", { className: "p-2 whitespace-nowrap", children: [" ", mascota.especie?.esp_nombre ?? 'Sin especie'] }), _jsx("td", { className: "p-2 whitespace-nowrap", children: mascota.mas_color }), _jsx("td", { className: "p-2 whitespace-nowrap", children: mascota.mas_esterilizado ? (_jsx("span", { className: "text-green-500", children: "Si" })) : (_jsx("span", { className: "text-red-500", children: "No" })) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: mascota.activo ? (_jsx("span", { className: "text-green-500", children: "Activo" })) : (_jsx("span", { className: "text-red-500", children: "Inactivo" })) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => updatedMascota(mascota.mas_id), className: "bg-orange-500 px-3 py-1 rounded-md hover:bg-orange-600", children: "\uD83D\uDCDD Ver" }) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => historiClinica(mascota.mas_id), className: "bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600", children: "\uD83D\uDD0E Historia Clinica" }) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => removedMascota(mascota.mas_id), className: "bg-red-500 px-3 py-1 rounded-md hover:bg-red-600", children: "\uD83D\uDEAB Desactivar" }) })] }, mascota.mas_id))) })] }) })] }));
};
export default MascotasList;
