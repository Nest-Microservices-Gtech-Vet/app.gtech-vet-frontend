import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ExamenList = ({ examenes }) => {
    if (examenes.length === 0) {
        return _jsx("p", { children: "No hay ex\u00E1menes registrados." });
    }
    return (_jsx("div", { className: "space-y-6", children: examenes.map((exam) => (_jsxs("div", { className: "p-4  rounded bg-gray-50 shadow", children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCCC Tipo:" }), " ", exam.exam_tipo] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCC5 Fecha:" }), " ", new Date(exam.created_at).toLocaleDateString()] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mt-4", children: exam.archivos.map((archivo) => (_jsxs("div", { className: " rounded p-2 bg-white shadow-sm", children: [_jsx("img", { src: `https://app.amigovet123.com:8443/uploads/${archivo.exa_url}`, alt: archivo.exa_descripcion, className: "w-full h-32 object-cover mb-2" }), _jsxs("p", { className: "text-sm", children: [_jsx("strong", { children: archivo.exa_categoria }), _jsx("br", {}), archivo.exa_descripcion] })] }, archivo.exa_id))) })] }, exam.exam_id))) }));
};
export default ExamenList;
