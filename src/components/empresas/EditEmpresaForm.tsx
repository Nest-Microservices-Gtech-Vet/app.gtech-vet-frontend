import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getEmpresaById, updateEmpresa } from "../../services/empresas/empresas";
import { getCantones, getProvincias } from "../../services/empresas/catalogosEmpresa";
import { Canton } from "../../types/empresa/canton";

interface FormState {
    emp_nombre: string;
    emp_correo: string;
    emp_direccion: string;
    emp_telefono: string;
    emp_ruc: string;
    emp_tipo_empresa: string;
    fotoFile: File | null;      // archivo nuevo seleccionado
    emp_foto?: string | null;   // nombre de archivo guardado en backend (si existe)
    fotoUrl?: string | null;    // URL para preview (si existe)
    provincia_id: number;
    canton_id: number;
    activo: boolean;
    fecha_inicio: string;
    fecha_fin: string;
}

const EditEmpresaForm: React.FC = () => {
    const { empresaId } = useParams<{ empresaId?: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormState>({
        emp_nombre: "",
        emp_correo: "",
        emp_direccion: "",
        emp_telefono: "",
        emp_ruc: "",
        emp_tipo_empresa: "",
        fotoFile: null,
        emp_foto: null,
        fotoUrl: null,
        provincia_id: 0,
        canton_id: 0,
        activo: true,
        fecha_inicio: "",
        fecha_fin: "",
    });

    const [provincias, setProvincias] = useState<{ id: number; nombre: string }[]>([]);
    const [cantonesTodos, setCantonesTodos] = useState<Canton[]>([]);
    const [cantones, setCantones] = useState<Canton[]>([]);

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                if (!empresaId) return;

                // provincias
                const provs = await getProvincias();
                setProvincias(provs.map((p: any) => ({ id: Number(p.prov_id), nombre: p.prov_nombre })));

                // cantones (aseguramos la forma Canton)
                const cants = await getCantones();
                const cantsMapped: Canton[] = cants.map((c: any) => ({
                    can_id: Number(c.can_id),
                    can_nombre: c.can_nombre,
                    provincia_id: Number(c.provincia_id),
                }));
                setCantonesTodos(cantsMapped);

                // empresa
                const empresa = await getEmpresaById(empresaId);
                if (!empresa) return;

                // desestructuro para omitir relaciones innecesarias
                const {
                    emp_id,
                    createdBy,
                    updatedBy,
                    created_at,
                    updated_at,
                    empresaUsuario,
                    admins,
                    ...empresaData
                } = empresa as any;

                // normalizo tipos numéricos y foto
                const normalized = {
                    ...empresaData,
                    provincia_id: Number(empresaData.provincia_id) || 0,
                    canton_id: Number(empresaData.canton_id) || 0,
                    emp_foto: empresaData.emp_foto ?? null,
                    fotoUrl: empresaData.emp_foto ? `http://localhost:3010/uploads/logos/${empresaData.emp_foto}` : null,
                };

                setFormData(prev => ({ ...prev, ...normalized }));

                // filtramos cantones por la provincia de la empresa (aquí tipamos el parámetro)
                const cantonesFiltrados = cantsMapped.filter((c: Canton) => c.provincia_id === normalized.provincia_id);
                setCantones(cantonesFiltrados);
            } catch (err) {
                console.error("Error al cargar empresa:", err);
            }
        };

        fetchEmpresa();
    }, [empresaId]);

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinciaId = Number(e.target.value);
        setFormData(prev => ({ ...prev, provincia_id: provinciaId, canton_id: 0 }));

        const filtrados = cantonesTodos.filter((c: Canton) => c.provincia_id === provinciaId);
        setCantones(filtrados);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (f) {
            setFormData(prev => ({ ...prev, fotoFile: f, fotoUrl: URL.createObjectURL(f) }));
        }
    };

    const updatedEmpresa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!empresaId) {
            Swal.fire("Error", "No se encontró el ID de la empresa.", "error");
            return;
        }

        // construir FormData
        const body = new FormData();
        body.append("emp_nombre", formData.emp_nombre);
        body.append("emp_correo", formData.emp_correo);
        body.append("emp_direccion", formData.emp_direccion);
        body.append("emp_telefono", formData.emp_telefono);
        body.append("emp_ruc", formData.emp_ruc);
        body.append("emp_tipo_empresa", formData.emp_tipo_empresa);
        body.append("provincia_id", String(formData.provincia_id));
        body.append("canton_id", String(formData.canton_id));
        body.append("fecha_inicio", formData.fecha_inicio || "");
        body.append("fecha_fin", formData.fecha_fin || "");
        body.append("activo", String(formData.activo));

        // Si el usuario seleccionó un archivo nuevo: clave 'foto' (eso espera tu FileInterceptor)
        if (formData.fotoFile) {
            body.append("foto", formData.fotoFile);


        } else {
            // Si no sube archivo, enviamos emp_foto con el nombre actual (si existe)
            if (formData.emp_foto) {
                body.append("emp_foto", formData.emp_foto);
            }
        }

        try {
            const resp = await updateEmpresa(empresaId, body); // tu servicio espera (id, FormData)
            // dependiendo de tu apiFetch, puede lanzar excepción en 4xx/5xx
            Swal.fire({
                icon: "success",
                title: "¡Registro modificado!",
                text: "Los cambios fueron guardados correctamente.",
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => navigate("/empresas"));
        } catch (err: any) {
            console.error("Error al actualizar:", err);
            // mostrar mensaje del backend si viene
            const msg = err?.message || "Error al actualizar la empresa";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <form onSubmit={updatedEmpresa} className="w-full max-w-5xl bg-gray-800 p-5 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-white">Editar Empresa</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 p-4 rounded-lg">
                {/* RUC */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="relative bg-inherit">
                        <input
                            value={formData.emp_ruc}
                            onChange={(e) => setFormData({ ...formData, emp_ruc: e.target.value })}
                            type="text"
                            id="emp_ruc"
                            name="emp_ruc"
                            className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                        />
                        <label htmlFor="emp_ruc" className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all">
                            Ingresar RUC
                        </label>
                    </div>
                </div>

                {/* Nombre */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="relative bg-inherit">
                        <input
                            value={formData.emp_nombre}
                            onChange={(e) => setFormData({ ...formData, emp_nombre: e.target.value })}
                            type="text"
                            id="emp_nombre"
                            name="emp_nombre"
                            className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                        />
                        <label htmlFor="emp_nombre" className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all">
                            Ingresar Nombre
                        </label>
                    </div>
                </div>

                {/* Correo */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="relative bg-inherit">
                        <input
                            value={formData.emp_correo}
                            onChange={(e) => setFormData({ ...formData, emp_correo: e.target.value })}
                            type="email"
                            id="emp_correo"
                            name="emp_correo"
                            className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                        />
                        <label htmlFor="emp_correo" className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all">
                            Ingresar Email
                        </label>
                    </div>
                </div>

                {/* Dirección */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="relative bg-inherit">
                        <input
                            value={formData.emp_direccion}
                            onChange={(e) => setFormData({ ...formData, emp_direccion: e.target.value })}
                            type="text"
                            id="emp_direccion"
                            name="emp_direccion"
                            className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                        />
                        <label htmlFor="emp_direccion" className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all">
                            Ingresar Dirección
                        </label>
                    </div>
                </div>

                {/* Teléfono */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="relative bg-inherit">
                        <input
                            value={formData.emp_telefono}
                            onChange={(e) => setFormData({ ...formData, emp_telefono: e.target.value })}
                            type="text"
                            id="emp_telefono"
                            name="emp_telefono"
                            className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                        />
                        <label htmlFor="emp_telefono" className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all">
                            Ingresar Celular
                        </label>
                    </div>
                </div>

                {/* Fecha Inicio */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="relative bg-inherit">
                        <input
                            type="date"
                            value={formData.fecha_inicio?.split("T")[0] || ""}
                            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                            className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                        />
                        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all">
                            Fecha de Inicio
                        </label>
                    </div>
                </div>

                {/* Fecha Fin */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="relative bg-inherit">
                        <input
                            type="date"
                            value={formData.fecha_fin?.split("T")[0] || ""}
                            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                            className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                        />
                        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all">
                            Fecha de Fin
                        </label>
                    </div>
                </div>

                {/* Tipo Empresa */}
                <div className="bg-gray-800 p-4 rounded-lg col-span-2">
                    <div className="relative bg-inherit">
                        <input
                            value={formData.emp_tipo_empresa}
                            onChange={(e) => setFormData({ ...formData, emp_tipo_empresa: e.target.value })}
                            id="emp_tipo_empresa"
                            name="emp_tipo_empresa"
                            className="peer bg-transparent w-full rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 py-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                        />
                        <label htmlFor="emp_tipo_empresa" className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all">
                            Ingresar Tipo Empresa
                        </label>
                    </div>
                </div>

                {/* Imagen */}
                <div className="bg-gray-800 p-4 rounded-lg col-span-2">
                    <div className="flex flex-col items-start">
                        {formData.fotoUrl && <img src={formData.fotoUrl} alt="Preview" className="w-32 h-32 object-cover mb-2 rounded-lg" />}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="text-gray-200" />
                    </div>
                </div>

                {/* Provincia */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <select value={formData.provincia_id} onChange={handleProvinciaChange} className="peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600">
                        <option value={0}>Seleccione una provincia</option>
                        {provincias.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                    <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1">Provincia</label>
                </div>

                {/* Cantón */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <select
                        value={formData.canton_id}
                        onChange={(e) => setFormData({ ...formData, canton_id: Number(e.target.value) })}
                        className="peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600"
                    >
                        <option value={0}>Seleccione un cantón</option>
                        {cantones.map((c) => <option key={c.can_id} value={c.can_id}>{c.can_nombre}</option>)}
                    </select>
                    <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1">Cantón</label>
                </div>

                {/* Activo */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <select value={formData.activo ? "true" : "false"} onChange={(e) => setFormData({ ...formData, activo: e.target.value === "true" })} className="peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600">
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                    <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1">Estado</label>
                </div>
            </div>

            <div className="flex justify-center mt-4">
                <button className="mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center text-white" type="submit">Guardar Cambios</button>
            </div>
        </form>
    );
};

export default EditEmpresaForm;
