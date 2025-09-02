import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClienteById, updateCliente } from "../../../../services/gestion-empresa/clientes/clientes";
import Swal from "sweetalert2";
const EditClienteForm = () => {
    const { id: empresaId } = useParams();
    const { clienteId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cli_identificacion: "",
        cli_nombre: "",
        cli_apellido: "",
        cli_email: "",
        cli_celular: "",
        cli_direccion: "",
        cli_observaciones: "",
        activo: true,
        empresa_id: Number(empresaId),
    });
    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const cliente = await getClienteById(clienteId);
                console.log("Usuario obtenido:", cliente);
                if (cliente) {
                    // Elimina propiedades no permitidas antes de actualizar el estado
                    const { cli_id, createdBy, updatedBy, created_at, updated_at, ...clienteData } = cliente;
                    setFormData(clienteData); // Llena el formulario con los datos permitidos
                }
                else {
                    console.error("cliente no encontrado");
                }
            }
            catch (error) {
                console.error("Error al obtener el cliente:", error);
            }
        };
        fetchCliente();
    }, [clienteId]);
    const updatedCliente = async (e) => {
        e.preventDefault();
        const clienteDataToUpdate = {
            cli_identificacion: formData.cli_identificacion,
            cli_nombre: formData.cli_nombre,
            cli_apellido: formData.cli_apellido,
            cli_email: formData.cli_email,
            cli_celular: formData.cli_celular,
            cli_direccion: formData.cli_direccion,
            cli_observaciones: formData.cli_observaciones,
            activo: formData.activo,
            empresa_id: formData.empresa_id,
        };
        try {
            const result = await updateCliente(clienteId, clienteDataToUpdate);
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro modificado!',
                    text: 'Los cambios fueron guardados correctamente.',
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        navigate(`/mis-empresas/${empresaId}/clientes`); // Ruta a la lista de empresas
                    }
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al modificar',
                    text: 'Ocurrió un error al guardar los cambios.',
                });
            }
        }
        catch (error) {
            console.error(Swal.fire({
                icon: 'error',
                title: 'Error al modificar',
                text: 'Ocurrió un error al guardar los cambios.',
            }), error);
        }
    };
    return (_jsx("form", { onSubmit: updatedCliente, className: "w-full max-w-5xl bg-gray-50 p-5 rounded-lg shadow-md", children: _jsxs("div", { className: "w-full max-w-5xl bg-gray-50 p-5 rounded-lg shadow-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Ingrese los datos del cliente" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-10 p-4 rounded-lg", children: [_jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.cli_identificacion, onChange: (e) => setFormData({ ...formData, cli_identificacion: e.target.value }), type: "text", id: "cli_identificacion", name: "cli_identificacion", className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "cli_identificacion", className: "absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ", children: "Ingresar RUC o Cedula" })] }) }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.cli_nombre, onChange: (e) => setFormData({ ...formData, cli_nombre: e.target.value }), type: "text", id: "cli_nombre", name: "cli_nombre", className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "cli_nombre", className: "absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ", children: "Ingresar Nombre" })] }) }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.cli_apellido, onChange: (e) => setFormData({ ...formData, cli_apellido: e.target.value }), type: "text", id: "cli_apellido", name: "cli_apellido", className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "cli_apellido", className: "absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ", children: "Ingresar Apellido" })] }) }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.cli_email, onChange: (e) => setFormData({ ...formData, cli_email: e.target.value }), type: "email", id: "cli_email", name: "cli_email", className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "cli_email", className: "absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ", children: "Ingresar Email" })] }) }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.cli_celular, onChange: (e) => setFormData({ ...formData, cli_celular: e.target.value }), type: "text", id: "cli_celular", name: "cli_celular", className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "cli_celular", className: "absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ", children: "Ingresar Celular" })] }) }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.cli_direccion, onChange: (e) => setFormData({ ...formData, cli_direccion: e.target.value }), type: "text", id: "cli_direccion", name: "cli_direccion", className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "cli_direccion", className: "absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ", children: "Ingresar Direccion" })] }) }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { value: formData.cli_observaciones, onChange: (e) => setFormData({ ...formData, cli_observaciones: e.target.value }), type: "text", id: "cli_observaciones", name: "cli_observaciones", className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", placeholder: " ", autoComplete: "new-password" }), _jsx("label", { htmlFor: "cli_observaciones", className: "absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ", children: "Ingresar Observaciones" })] }) }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsxs("select", { value: formData.activo ? "true" : "false", onChange: (e) => setFormData({ ...formData, activo: e.target.value === "true" }), className: "peer bg-gray-50 h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600", children: [_jsx("option", { value: "true", children: "Activo" }), _jsx("option", { value: "false", children: "Inactivo" })] }), _jsx("label", { className: "absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ", children: "Estado" })] }) })] }), _jsx("div", { className: "flex justify-center mt-4", children: _jsx("button", { className: "mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center", type: "submit", children: "Guardar Cambios" }) })] }) }));
};
export default EditClienteForm;
