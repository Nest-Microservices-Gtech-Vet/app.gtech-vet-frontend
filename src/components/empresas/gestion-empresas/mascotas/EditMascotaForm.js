import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientes } from "../../../../services/gestion-empresa/clientes/clientes";
import { getEspecies, getRazas } from "../../../../services/gestion-empresa/mascotas/catalogosMascota";
import { getMascotaById, updateMascota } from "../../../../services/gestion-empresa/mascotas/mascotas";
import Swal from "sweetalert2";
const EditMascotaForm = () => {
    const { empresaId } = useParams();
    const { mascotaId } = useParams();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        mas_nombre: "",
        mas_fechaNac: "",
        mas_peso: 0,
        mas_color: "",
        mas_esterilizado: false,
        mas_microchip: "",
        mas_foto: null,
        mas_notas: "",
        especie_id: 0,
        raza_id: 0,
        cliente_id: 0,
        empresa_id: Number(empresaId),
        activo: true,
    });
    const [clientes, setClientes] = useState([]);
    const [especies, setEspecies] = useState([]);
    const [razas, setRazas] = useState([]);
    const [razastodas, setRazasTodas] = useState([]);
    useEffect(() => {
        const fetchMascota = async () => {
            try {
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
                const mascota = await getMascotaById(mascotaId);
                if (mascota) {
                    const { mas_id, createdBy, updatedBy, created_at, updated_at, ...mascotaData } = mascota;
                    setFormData(mascotaData);
                    const razasFiltradas = razasMapped.filter((r) => r.especie_id === mascotaData.especie_id);
                    setRazas(razasFiltradas);
                }
                else {
                    console.error("mascota no encontrada");
                }
            }
            catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        fetchMascota();
    }, [mascotaId]);
    const handleEspecieCHange = (e) => {
        const especieId = Number(e.target.value);
        setFormData({ ...formData, especie_id: especieId, raza_id: 0 });
        const razasFiltradas = razastodas.filter(r => r.especie_id === especieId);
        setRazas(razasFiltradas);
    };
    const updatedMascotaq = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("mas_nombre", formData.mas_nombre);
        form.append("mas_fechaNac", formData.mas_fechaNac);
        form.append("mas_peso", String(formData.mas_peso));
        form.append("mas_color", formData.mas_color);
        form.append("mas_esterilizado", String(formData.mas_esterilizado));
        form.append("mas_microchip", formData.mas_microchip);
        form.append("mas_notas", formData.mas_notas);
        form.append("especie_id", String(formData.especie_id));
        form.append("raza_id", String(formData.raza_id));
        form.append("cliente_id", String(formData.cliente_id));
        form.append("empresa_id", String(formData.empresa_id));
        form.append("activo", String(formData.activo));
        // Solo si se seleccionó una nueva foto, la agregamos
        if (formData.mas_foto && formData.mas_foto instanceof File) {
            form.append("mas_foto", formData.mas_foto);
        }
        try {
            const result = await updateMascota(Number(mascotaId ?? 0), form); // ← nuevo
            if (result) {
                Swal.fire({
                    icon: "success",
                    title: "¡Registro modificado!",
                    text: "Los cambios fueron guardados correctamente.",
                    timer: 2300,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        navigate(`/mis-empresas/${id}/mascotas`);
                    },
                });
            }
            else {
                alert("Error al actualizar el registro");
            }
        }
        catch (error) {
            console.error("Error al actualizar el registro:", error);
        }
    };
    return (_jsxs("div", { className: "w-full max-w-screen-xl mx-auto mb-4", children: [_jsx("div", { className: "flex flex-wrap justify-items-start items-center px-6 py-4", children: _jsxs("div", { className: "flex gap-3 mt-2 lg:mt-0 flex-wrap", children: [_jsx("button", { onClick: () => navigate(`/mis-empresas/${id}/mascotas`), className: "bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition", children: "\uD83D\uDD19 Volver a Mascota" }), _jsx("button", { onClick: () => navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica`), className: "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition", children: "\uD83E\uDE7A Historial Cl\u00EDnico" }), _jsx("button", { onClick: () => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/nueva`), className: "bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md transition", children: "\u2795 Nueva Consulta" }), _jsx("button", { onClick: () => navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/vacunas`), className: "bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition", children: "\uD83D\uDC89 Vacunas" })] }) }), _jsxs("form", { onSubmit: updatedMascotaq, className: "w-full max-w-screen-xl mx-auto p-8 rounded-xl shadow bg-white", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 border-r border-gray-200 pr-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6 text-gray-800", children: "\uD83D\uDC3E Datos de la Mascota" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6", children: [_jsxs("div", { className: "col-span-full", children: [typeof formData.mas_foto === "string" && (_jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Foto actual" }), _jsx("img", { src: `https://app.amigovet123.com:8443/uploads/perfil/${formData.mas_foto}`, alt: "Foto mascota", className: "w-32 h-32 object-cover rounded border" })] })), formData.mas_foto instanceof File && (_jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Nueva foto seleccionada" }), _jsx("img", { src: URL.createObjectURL(formData.mas_foto), alt: "Nueva foto", className: "w-32 h-32 object-cover rounded border" })] })), _jsx("label", { htmlFor: "mas_foto", className: "block mb-1 text-sm font-medium text-gray-700", children: "Cambiar foto" }), _jsx("input", { type: "file", id: "mas_foto", accept: "image/*", onChange: (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setFormData({ ...formData, mas_foto: file });
                                                            }
                                                        }, className: "w-2xs h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_nombre", className: "block mb-1 text-sm font-medium text-gray-700", children: "Nombre" }), _jsx("input", { type: "text", id: "mas_nombre", value: formData.mas_nombre, onChange: (e) => setFormData({ ...formData, mas_nombre: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", placeholder: "Ingrese nombre" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_fechaNac", className: "block mb-1 text-sm font-medium text-gray-700", children: "Fecha de nacimiento" }), _jsx("input", { type: "date", id: "mas_fechaNac", value: formData.mas_fechaNac?.split("T")[0] || "", onChange: (e) => setFormData({ ...formData, mas_fechaNac: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_color", className: "block mb-1 text-sm font-medium text-gray-700", children: "Color" }), _jsx("input", { type: "text", id: "mas_color", value: formData.mas_color, onChange: (e) => setFormData({ ...formData, mas_color: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", placeholder: "Color" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_microchip", className: "block mb-1 text-sm font-medium text-gray-700", children: "Microchip" }), _jsx("input", { type: "text", id: "mas_microchip", value: formData.mas_microchip, onChange: (e) => setFormData({ ...formData, mas_microchip: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", placeholder: "Microchip" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "mas_notas", className: "block mb-1 text-sm font-medium text-gray-700", children: "Notas" }), _jsx("input", { type: "text", id: "mas_notas", value: formData.mas_notas, onChange: (e) => setFormData({ ...formData, mas_notas: e.target.value }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", placeholder: "Notas" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Esterilizado" }), _jsxs("select", { value: formData.mas_esterilizado ? "true" : "false", onChange: (e) => setFormData({ ...formData, mas_esterilizado: e.target.value === "true" }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "true", children: "S\u00ED" }), _jsx("option", { value: "false", children: "No" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Estado" }), _jsxs("select", { value: formData.activo ? "true" : "false", onChange: (e) => setFormData({ ...formData, activo: e.target.value === "true" }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "true", children: "Activo" }), _jsx("option", { value: "false", children: "Inactivo" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Especie" }), _jsxs("select", { value: formData.especie_id, onChange: handleEspecieCHange, className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: 0, children: "-- Selecciona Especie --" }), especies.map((esp) => (_jsx("option", { value: esp.id, children: esp.nombre }, esp.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Raza" }), _jsxs("select", { value: formData.raza_id, onChange: (e) => setFormData({ ...formData, raza_id: Number(e.target.value) }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "", children: "-- Selecciona Raza --" }), razas.map((raza) => (_jsx("option", { value: raza.id, children: raza.nombre }, raza.id)))] })] })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-6 text-gray-800", children: "\uD83D\uDC64 Propietario" }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Seleccionar Propietario" }), _jsxs("select", { value: formData.cliente_id, onChange: (e) => setFormData({ ...formData, cliente_id: Number(e.target.value) }), className: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "0", children: "-- Selecciona Cliente --" }), clientes.map((cli) => (_jsxs("option", { value: cli.cli_id, children: [cli.cli_nombre, " ", cli.cli_apellido] }, cli.cli_id)))] }), _jsx("button", { type: "button", onClick: () => navigate(`/mis-empresas/${id}/clientes/crear-cliente?returnTo=/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}`), className: "mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition", children: "+ Crear Propietario" })] })] })] }), _jsx("div", { className: "mt-10 flex justify-center", children: _jsx("div", { className: "flex justify-center mt-4", children: _jsx("button", { className: "mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center", type: "submit", children: "Guardar Cambios" }) }) })] })] }));
};
export default EditMascotaForm;
