import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmpresaById, updateEmpresa } from "../../services/empresas/empresas";
import { getCantones, getProvincias } from "../../services/empresas/catalogosEmpresa";
import Swal from "sweetalert2";
const EditEmpresaForm = () => {
    const { empresaId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emp_nombre: "",
        emp_correo: "",
        emp_direccion: "",
        emp_telefono: "",
        emp_ruc: "",
        emp_tipo_empresa: "",
        provincia_id: 0,
        canton_id: 0,
        activo: true,
        fecha_inicio: "",
        fecha_fin: "",
    });
    const [provincias, setProvincias] = useState([]);
    const [cantonesTodos, setCantonesTodos] = useState([]);
    const [cantones, setCantones] = useState([]);
    const [nombreAdmin, setNombreAdmin] = useState("");
    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                // 1. Obtener provincias
                const provs = await getProvincias();
                const provsMapped = provs.map((p) => ({
                    id: p.prov_id,
                    nombre: p.prov_nombre
                }));
                setProvincias(provsMapped);
                // 2. Obtener cantones
                const cants = await getCantones();
                const cantsMapped = cants.map((c) => ({
                    id: c.can_id,
                    nombre: c.can_nombre,
                    provincia_id: c.provincia_id
                }));
                setCantonesTodos(cantsMapped); // los guardas globalmente
                // 4. Obtener datos de la empresa
                const empresa = await getEmpresaById(empresaId);
                if (empresa) {
                    const { emp_id, createdBy, updatedBy, created_at, updated_at, ...empresaData } = empresa;
                    setFormData(empresaData);
                    // 5. Filtrar cantones según provincia_id de la empresa
                    const cantonesFiltrados = cantsMapped.filter((c) => c.provincia_id === empresaData.provincia_id);
                    setCantones(cantonesFiltrados);
                }
                else {
                    console.error("Empresa no encontrada");
                }
            }
            catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        fetchEmpresa();
    }, [empresaId]);
    const handleProvinciaChange = (e) => {
        const provinciaId = Number(e.target.value); // 👈 conviertes a número
        setFormData({ ...formData, provincia_id: provinciaId, canton_id: 0 });
        const cantonesFiltrados = cantonesTodos.filter(c => c.provincia_id === provinciaId);
        setCantones(cantonesFiltrados);
    };
    const updatedEmpresa = async (e) => {
        e.preventDefault();
        const empresaDataToUpdate = {
            emp_nombre: formData.emp_nombre,
            emp_correo: formData.emp_correo,
            emp_direccion: formData.emp_direccion,
            emp_telefono: formData.emp_telefono,
            emp_ruc: formData.emp_ruc,
            provincia_id: formData.provincia_id,
            canton_id: formData.canton_id,
            emp_tipo_empresa: formData.emp_tipo_empresa,
            activo: formData.activo,
            fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
            fecha_fin: new Date(formData.fecha_fin).toISOString(),
        };
        try {
            const result = await updateEmpresa(empresaId, empresaDataToUpdate);
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro modificado!',
                    text: 'Los cambios fueron guardados correctamente.',
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        navigate('/empresas'); // Ruta a la lista de empresas
                    }
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
    return (_jsxs("form", { onSubmit: updatedEmpresa, className: "w-full max-w-5xl bg-gray-800 p-5 rounded-lg shadow-md", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Editar Empresa" }), _jsxs("div", { children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-10 p-4 rounded-lg", children: [_jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_ruc, onChange: (e) => setFormData({ ...formData, emp_ruc: e.target.value }), type: "text", id: "emp_ruc", name: "emp_ruc", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_ruc", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar RUC" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_nombre, onChange: (e) => setFormData({ ...formData, emp_nombre: e.target.value }), type: "text", id: "emp_nombre", name: "emp_nombre", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_nombre", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar Nombre" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_correo, onChange: (e) => setFormData({ ...formData, emp_correo: e.target.value }), type: "email", id: "emp_correo", name: "emp_correo", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_correo", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar Email" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_direccion, onChange: (e) => setFormData({ ...formData, emp_direccion: e.target.value }), type: "text", id: "emp_direccion", name: "emp_direccion", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_direccion", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar Direccion" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsxs("select", { value: formData.provincia_id, onChange: handleProvinciaChange, className: "peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: 0, children: "Seleccione una provincia" }), provincias.map((provincia) => (_jsx("option", { value: provincia.id, children: provincia.nombre }, provincia.id)))] }), _jsx("label", { className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Provincia" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsxs("select", { value: formData.canton_id, onChange: (e) => setFormData({ ...formData, canton_id: Number(e.target.value) }), className: "peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: 0, children: "Seleccione un cant\u00F3n" }), cantones.map((canton) => (_jsx("option", { value: canton.id, children: canton.nombre }, canton.id)))] }), _jsx("label", { className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Cant\u00F3n" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_telefono, onChange: (e) => setFormData({ ...formData, emp_telefono: e.target.value }), type: "text", id: "emp_telefono", name: "emp_telefono", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_telefono", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar Celular" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsxs("select", { value: formData.activo ? "true" : "false", onChange: (e) => setFormData({ ...formData, activo: e.target.value === "true" }), className: "peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", children: [_jsx("option", { value: "true", children: "Activo" }), _jsx("option", { value: "false", children: "Inactivo" })] }), _jsx("label", { className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Estado" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.fecha_inicio?.split('T')[0] || "", onChange: (e) => setFormData({ ...formData, fecha_inicio: e.target.value }), type: "date", id: "fecha_inicio", name: "fecha_inicio", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none" }), _jsx("label", { htmlFor: "fecha_inicio", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Fecha de Inicio" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.fecha_fin?.split('T')[0] || "", onChange: (e) => setFormData({ ...formData, fecha_fin: e.target.value }), type: "date", id: "fecha_fin", name: "fecha_fin", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none" }), _jsx("label", { htmlFor: "fecha_fin", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Fecha de Fin" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg col-span-2", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_tipo_empresa, onChange: (e) => setFormData({ ...formData, emp_tipo_empresa: e.target.value }), id: "emp_tipo_empresa", name: "emp_tipo_empresa", className: "peer bg-transparent w-full rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 py-2 ring-gray-500 focus:ring-sky-600 focus:outline-none resize-none", placeholder: " ", autoComplete: "off" }), _jsx("label", { htmlFor: "emp_tipo_empresa", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Ingresar Tipo Empresa" })] }) })] }), _jsx("div", { className: "flex justify-center mt-4", children: _jsx("button", { className: "mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center", type: "submit", children: "Guardar Cambios" }) })] })] }));
};
export default EditEmpresaForm;
