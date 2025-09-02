import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getUsuariosAdmin } from "../../services/users/users";
const UsuariosSelectorModal = ({ isOpen, onClose, onSave, selectedUserIds }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    useEffect(() => {
        const fetchUsuarios = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const data = await getUsuariosAdmin();
                if (Array.isArray(data)) {
                    setUsuarios(data);
                }
                else if (Array.isArray(data.usuarios)) {
                    setUsuarios(data.usuarios);
                }
                else {
                    setFetchError("Respuesta inesperada del servidor.");
                }
            }
            catch (err) {
                console.error("Error al cargar usuarios:", err);
                setFetchError("Error al cargar usuarios. Intenta nuevamente.");
            }
            finally {
                setIsLoading(false);
            }
        };
        if (isOpen) {
            fetchUsuarios();
            setSelectedIds(selectedUserIds);
        }
    }, [isOpen, selectedUserIds]);
    const toggleSelect = (id) => {
        const numId = Number(id);
        setSelectedIds((prev) => prev.includes(numId) ? prev.filter((uid) => uid !== numId) : [...prev, numId]);
    };
    const handleSave = () => {
        onSave(selectedIds);
        setSelectedIds([]);
        setShowSuccessAlert(true);
    };
    const handleClose = () => {
        setSelectedIds([]);
        setShowSuccessAlert(false);
        onClose();
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/40 flex items-center justify-center", onClick: handleClose, children: _jsxs("div", { className: "bg-gray-800 text-white-100 p-6 rounded-2xl shadow-lg w-full max-w-lg relative", onClick: (e) => e.stopPropagation(), children: [_jsx("h3", { className: "text-2xl font-semibold mb-4 text-white", children: "Selecciona Usuarios a esta empresa" }), isLoading ? (_jsx("div", { className: "text-center text-white py-8", children: "Cargando usuarios..." })) : fetchError ? (_jsx("div", { className: "text-red-600 text-center py-4", children: fetchError })) : (_jsx("div", { className: "max-h-60 overflow-y-auto space-y-2 pr-2 ", children: usuarios.map((usuario) => (_jsxs("label", { className: " text-white-100-100 flex items-center gap-2 p-2 rounded-md hover:bg-blue-600 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: selectedIds.includes(usuario.usua_id), onChange: () => toggleSelect(usuario.usua_id), className: "accent-green-600 w-4 h-4" }), _jsx("span", { className: "text-white", children: usuario.usua_nombre })] }, usuario.usua_id))) })), _jsxs("div", { className: "flex justify-end mt-6 gap-3", children: [_jsx("button", { onClick: handleClose, className: "bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition", children: "Cancelar" }), _jsx("button", { onClick: handleSave, disabled: selectedIds.length === 0, className: `px-4 py-2 rounded-lg transition text-white ${selectedIds.length === 0
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"}`, children: "Asignar" })] }), showSuccessAlert && (_jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-8 rounded-2xl shadow-2xl text-center w-[400px]", children: [_jsx("div", { className: "text-green-600 text-4xl mb-3", children: "\u2705" }), _jsx("h4", { className: "text-2xl font-bold text-green-600 mb-2", children: "\u00A1\u00C9xito!" }), _jsx("p", { className: "text-gray-800 text-lg mb-6", children: "Usuarios asignados correctamente." }), _jsx("button", { onClick: handleClose, className: "bg-green-600 hover:bg-green-300 text-white text-base px-6 py-2 rounded-lg transition", children: "OK" })] }) }))] }) }));
};
export default UsuariosSelectorModal;
