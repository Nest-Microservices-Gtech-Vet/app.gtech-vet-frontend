import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createEmpresa } from "../../services/empresas/empresas";
import { getCantones, getProvincias } from "../../services/empresas/catalogosEmpresa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const CreateEmpresaForm = () => {
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
    useEffect(() => {
        const fetchData = async () => {
            const provs = await getProvincias();
            const provsMapped = provs.map((p) => ({
                id: p.prov_id,
                nombre: p.prov_nombre
            }));
            setProvincias(provsMapped);
            const cants = await getCantones();
            const cantsMapped = cants.map((c) => ({
                id: c.can_id,
                nombre: c.can_nombre,
                provincia_id: c.provincia_id
            }));
            setCantonesTodos(cantsMapped);
        };
        fetchData();
    }, []);
    const handleProvinciaChange = (e) => {
        const provinciaId = Number(e.target.value); // 👈 conviertes a número
        setFormData({ ...formData, provincia_id: provinciaId, canton_id: 0 });
        const cantonesFiltrados = cantonesTodos.filter(c => c.provincia_id === provinciaId);
        setCantones(cantonesFiltrados);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const sendEmpresa = async (e) => {
        e.preventDefault();
        const formDataFixed = {
            ...formData,
            provincia_id: Number(formData.provincia_id),
            canton_id: Number(formData.canton_id),
            fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
            fecha_fin: new Date(formData.fecha_fin).toISOString(),
        };
        console.log("Enviando empresa:", formDataFixed);
        const resultado = await createEmpresa(formDataFixed);
        if (resultado) {
            Swal.fire({
                icon: 'success',
                title: '¡Empresa creada!',
                text: 'La empresa fue registrada correctamente.',
                confirmButtonColor: '#10B981' // verde
            }).then(() => {
                navigate('/empresas'); // ⬅️ cambia esta ruta según tu app
            });
            ;
            setFormData({
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
        }
        else {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pudo crear la empresa.',
                confirmButtonColor: '#EF4444' // rojo
            });
        }
    };
    return (_jsxs("form", { onSubmit: sendEmpresa, className: "w-full max-w-5xl bg-gray-800 p-5 rounded-lg shadow-md", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Agreger Empresa" }), _jsxs("div", { className: "w-full max-w-5xl bg-gray-800 p-5 rounded-lg shadow-md", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-10 p-4 rounded-lg", children: [_jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_nombre, onChange: (e) => setFormData({ ...formData, emp_nombre: e.target.value }), type: "text", id: "emp_nombre", name: "emp_nombre", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_nombre", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar Nombre" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_correo, onChange: (e) => setFormData({ ...formData, emp_correo: e.target.value }), type: "email", id: "emp_correo", name: "emp_correo", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_correo", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar Correo" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_direccion, onChange: (e) => setFormData({ ...formData, emp_direccion: e.target.value }), type: "text", id: "emp_direccion", name: "emp_direccion", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_direccion", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar direccion" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsxs("select", { value: formData.provincia_id, onChange: handleProvinciaChange, className: "peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: 0, children: "Seleccione una provincia" }), provincias.map((provincia) => (_jsx("option", { value: provincia.id, children: provincia.nombre }, provincia.id)))] }), _jsx("label", { className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Provincia" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsxs("select", { value: formData.canton_id, onChange: (e) => setFormData({ ...formData, canton_id: Number(e.target.value) }), className: "peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none", children: [_jsx("option", { value: "", children: "Seleccione un cant\u00F3n" }), cantones.map((canton) => (_jsx("option", { value: canton.id, children: canton.nombre }, canton.id)))] }), _jsx("label", { className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Cant\u00F3n" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_telefono, onChange: (e) => setFormData({ ...formData, emp_telefono: e.target.value }), type: "text", id: "emp_telefono", name: "emp_telefono", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_telefono", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar Telefono" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_ruc, onChange: (e) => setFormData({ ...formData, emp_ruc: e.target.value }), type: "text", id: "emp_ruc", name: "emp_ruc", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "emp_ruc", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Ingresar RUC" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg col-span-2", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.emp_tipo_empresa, onChange: (e) => setFormData({ ...formData, emp_tipo_empresa: e.target.value }), id: "emp_tipo_empresa", name: "emp_tipo_empresa", className: "peer bg-transparent w-full rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 py-2 ring-gray-500 focus:ring-sky-600 focus:outline-none resize-none", placeholder: " ", autoComplete: "off" }), _jsx("label", { htmlFor: "emp_tipo_empresa", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Ingresar Tipo Empresa" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsxs("select", { value: formData.activo ? "true" : "false", onChange: (e) => setFormData({ ...formData, activo: e.target.value === "true" }), className: "peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", children: [_jsx("option", { value: "true", children: "Activo" }), _jsx("option", { value: "false", children: "Inactivo" })] }), _jsx("label", { className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ", children: "Estado" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.fecha_inicio, onChange: (e) => setFormData({ ...formData, fecha_inicio: e.target.value }), type: "date", id: "fecha_inicio", name: "fecha_inicio", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none" }), _jsx("label", { htmlFor: "fecha_inicio", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Fecha de Inicio" })] }) }), _jsx("div", { className: "bg-gray-800 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.fecha_fin, onChange: (e) => setFormData({ ...formData, fecha_fin: e.target.value }), type: "date", id: "fecha_fin", name: "fecha_fin", className: "peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none" }), _jsx("label", { htmlFor: "fecha_fin", className: "absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800", children: "Fecha de Fin" })] }) })] }), _jsx("div", { className: "flex justify-center mt-4", children: _jsx("button", { className: "mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center", type: "submit", children: "Crear Empresa" }) })] })] }));
};
export default CreateEmpresaForm;
