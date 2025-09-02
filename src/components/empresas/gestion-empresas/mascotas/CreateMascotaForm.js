import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { crearMascota } from "../../../../services/gestion-empresa/mascotas/mascotas";
import Swal from "sweetalert2";
import { getClientes } from "../../../../services/gestion-empresa/clientes/clientes";
import { getEspecies, getRazas } from "../../../../services/gestion-empresa/mascotas/catalogosMascota";
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
const CreateMascotaForm = () => {
    const { empresaId } = useParams();
    const { mascotaId } = useParams();
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const empresaIdNum = id ? parseInt(id, 10) : 0;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        mas_nombre: "",
        mas_fechaNac: "",
        mas_peso: 0,
        mas_color: "",
        mas_esterilizado: false,
        mas_microchip: "",
        mas_notas: "",
        activo: true,
        especie_id: 0,
        raza_id: 0,
        cliente_id: 0,
        empresa_id: empresaIdNum,
        fotoFile: null,
    });
    const [clientes, setClientes] = useState([]);
    const [especies, setEspecies] = useState([]);
    const [razas, setRazas] = useState([]);
    const [razastodas, setRazasTodas] = useState([]);
    useEffect(() => {
        const newClienteId = searchParams.get("newClienteId");
        if (newClienteId) {
            setFormData((prev) => ({
                ...prev,
                cliente_id: Number(newClienteId),
            }));
        }
    }, [searchParams]);
    useEffect(() => {
        const fetchData = async () => {
            const empresaId = Number(id);
            const clientesRes = await getClientes(empresaId);
            setClientes(clientesRes.data || []); // ← clientes sí devuelve { data }
            const especiesGet = await getEspecies();
            const especiasMapped = especiesGet.map((es) => ({
                id: es.esp_id,
                nombre: es.esp_nombre,
            }));
            setEspecies(especiasMapped);
            const razasGet = await getRazas();
            const razasMapped = razasGet.map((r) => ({
                id: r.raz_id,
                nombre: r.raz_nombre,
                especie_id: r.especie_id,
            }));
            setRazas(razasMapped);
            setRazasTodas(razasMapped);
        };
        fetchData();
    }, []);
    const handleEspecieCHange = (e) => {
        const especieId = Number(e.target.value);
        setFormData({ ...formData, especie_id: especieId, raza_id: 0 });
        const razasFiltradas = razastodas.filter(r => r.especie_id === especieId);
        setRazas(razasFiltradas);
    };
    const sendMascota = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("mas_nombre", formData.mas_nombre);
        data.append("mas_fechaNac", formData.mas_fechaNac);
        data.append("mas_peso", String(formData.mas_peso));
        data.append("mas_color", formData.mas_color);
        data.append("mas_esterilizado", String(formData.mas_esterilizado));
        data.append("mas_microchip", formData.mas_microchip);
        data.append("mas_notas", formData.mas_notas);
        data.append("especie_id", String(formData.especie_id));
        data.append("raza_id", String(formData.raza_id));
        data.append("cliente_id", String(formData.cliente_id));
        data.append("empresa_id", String(formData.empresa_id));
        data.append("activo", String(formData.activo));
        if (formData.fotoFile) {
            data.append("foto", formData.fotoFile);
        }
        try {
            const result = await crearMascota(data); // Asegúrate de que `crearMascota` envíe como multipart
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Mascota creada!',
                    text: 'La mascota fue registrada correctamente.',
                    timer: 5000,
                    timerProgressBar: true,
                    didClose: () => {
                        navigate(`/mis-empresas/${id}/mascotas`);
                    }
                });
            }
        }
        catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo crear la mascota", "error");
        }
    };
    return (_jsxs("form", { onSubmit: sendMascota, className: "w-full max-w-screen-xl mx-auto p-8 rounded-xl shadow bg-white", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 border-r border-gray-200 pr-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6 text-gray-800", children: "\uD83D\uDC3E Datos de la Mascota" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "mas_nombre", className: "block mb-1 text-sm font-medium text-gray-700", children: "Nombre" }), _jsx("input", { type: "text", id: "mas_nombre", value: formData.mas_nombre, onChange: (e) => setFormData({ ...formData, mas_nombre: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", placeholder: "Ingrese nombre" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_fechaNac", className: "block mb-1 text-sm font-medium text-gray-700", children: "Fecha de nacimiento" }), _jsx("input", { type: "date", id: "mas_fechaNac", value: formData.mas_fechaNac?.split("T")[0] || "", onChange: (e) => setFormData({ ...formData, mas_fechaNac: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_color", className: "block mb-1 text-sm font-medium text-gray-700", children: "Color" }), _jsx("input", { type: "text", id: "mas_color", value: formData.mas_color, onChange: (e) => setFormData({ ...formData, mas_color: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", placeholder: "Color" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_microchip", className: "block mb-1 text-sm font-medium text-gray-700", children: "Microchip" }), _jsx("input", { type: "text", id: "mas_microchip", value: formData.mas_microchip, onChange: (e) => setFormData({ ...formData, mas_microchip: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", placeholder: "Microchip" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "fotoFile", className: "block mb-1 text-sm font-medium text-gray-700", children: "Foto de la mascota" }), _jsx("input", { type: "file", id: "fotoFile", accept: "image/*", onChange: (e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setFormData({ ...formData, fotoFile: file });
                                                }, className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_notas", className: "block mb-1 text-sm font-medium text-gray-700", children: "Notas" }), _jsx("input", { type: "text", id: "mas_notas", value: formData.mas_notas, onChange: (e) => setFormData({ ...formData, mas_notas: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", placeholder: "Notas" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Esterilizado" }), _jsxs("select", { value: formData.mas_esterilizado ? "true" : "false", onChange: (e) => setFormData({ ...formData, mas_esterilizado: e.target.value === "true" }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "true", children: "S\u00ED" }), _jsx("option", { value: "false", children: "No" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Estado" }), _jsxs("select", { value: formData.activo ? "true" : "false", onChange: (e) => setFormData({ ...formData, activo: e.target.value === "true" }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "true", children: "Activo" }), _jsx("option", { value: "false", children: "Inactivo" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Especie" }), _jsxs("select", { value: formData.especie_id, onChange: handleEspecieCHange, className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: 0, children: "-- Selecciona Especie --" }), especies.map((esp) => (_jsx("option", { value: esp.id, children: esp.nombre }, esp.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Raza" }), _jsxs("select", { value: formData.raza_id, onChange: (e) => setFormData({ ...formData, raza_id: Number(e.target.value) }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "", children: "-- Selecciona Raza --" }), razas.map((raza) => (_jsx("option", { value: raza.id, children: raza.nombre }, raza.id)))] })] })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-6 text-gray-800", children: "\uD83D\uDC64 Propietario" }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Seleccionar Propietario" }), _jsxs("select", { value: formData.cliente_id, onChange: (e) => setFormData({ ...formData, cliente_id: Number(e.target.value) }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "0", children: "-- Selecciona El Propietario --" }), clientes.map((cli) => (_jsxs("option", { value: cli.cli_id, children: [cli.cli_nombre, " ", cli.cli_apellido] }, cli.cli_id)))] }), _jsx("button", { type: "button", className: "bg-blue-500 px-3 py-1 mt-2 rounded-md hover:bg-blue-600 text-white", onClick: () => {
                                            const returnTo = mascotaId
                                                ? `/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}`
                                                : `/mis-empresas/${id}/mascotas/crear-mascota`;
                                            navigate(`/mis-empresas/${id}/clientes/crear-cliente?returnTo=${encodeURIComponent(returnTo)}`);
                                        }, children: "\u2795 Crear nuevo cliente" })] })] })] }), _jsx("div", { className: "mt-10 flex justify-center", children: _jsx("div", { className: "flex justify-center mt-4", children: _jsx("button", { className: "mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center", type: "submit", children: "Guardar Cambios" }) }) })] }));
};
export default CreateMascotaForm;
