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
   <form onSubmit={updatedEmpresa} className="w-full max-w-6xl bg-gray-800 p-5 rounded-lg shadow-md">
  <h1 className="text-3xl font-bold mb-6">Editar Empresa</h1>

  <div className="grid grid-cols-4 gap-6">

    {/* Logo de la empresa */}
   <div className="bg-gray-800 p-4 rounded-lg col-span-1 row-span-3 flex flex-col items-center justify-center">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {formData.fotoUrl ? "Cambiar Foto" : "Escoger Foto"}
      </label>
      {formData.fotoUrl && (
        <img
          src={formData.fotoUrl}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg ring-2 ring-gray-600 mb-2"
        />
      )}
      <label className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md cursor-pointer">
        Escoger archivo
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
      {formData.fotoFile && <span className="text-gray-300 mt-2">{formData.fotoFile.name}</span>}
    </div>

    {/* RUC */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <input
          value={formData.emp_ruc}
          onChange={(e) => setFormData({ ...formData, emp_ruc: e.target.value })}
          type="text"
          id="emp_ruc"
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="emp_ruc"
          className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
        >
          RUC
        </label>
      </div>
    </div>

    {/* Nombre */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <input
          value={formData.emp_nombre}
          onChange={(e) => setFormData({ ...formData, emp_nombre: e.target.value })}
          type="text"
          id="emp_nombre"
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="emp_nombre"
          className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
        >
          Nombre
        </label>
      </div>
    </div>

    {/* Correo */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <input
          value={formData.emp_correo}
          onChange={(e) => setFormData({ ...formData, emp_correo: e.target.value })}
          type="email"
          id="emp_correo"
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="emp_correo"
          className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
        >
          Correo
        </label>
      </div>
    </div>

    {/* Teléfono */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <input
          value={formData.emp_telefono}
          onChange={(e) => setFormData({ ...formData, emp_telefono: e.target.value })}
          type="text"
          id="emp_telefono"
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="emp_telefono"
          className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
        >
          Teléfono
        </label>
      </div>
    </div>

    {/* Dirección */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <input
          value={formData.emp_direccion}
          onChange={(e) => setFormData({ ...formData, emp_direccion: e.target.value })}
          type="text"
          id="emp_direccion"
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="emp_direccion"
          className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
        >
          Dirección
        </label>
      </div>
    </div>

    {/* Tipo de Empresa */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <input
          value={formData.emp_tipo_empresa}
          onChange={(e) => setFormData({ ...formData, emp_tipo_empresa: e.target.value })}
          id="emp_tipo_empresa"
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
        />
        <label
          htmlFor="emp_tipo_empresa"
          className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
        >
          Tipo de Empresa
        </label>
      </div>
    </div>

    {/* Fecha Inicio */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <input
          type="date"
          value={formData.fecha_inicio?.split("T")[0] || ""}
          onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
        />
        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
          Fecha de Inicio
        </label>
      </div>
    </div>

    {/* Fecha Fin */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <input
          type="date"
          value={formData.fecha_fin?.split("T")[0] || ""}
          onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
        />
        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
          Fecha de Fin
        </label>
      </div>
    </div>

    {/* Provincia */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <select
          value={formData.provincia_id}
          onChange={handleProvinciaChange}
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
        >
          <option value={0}>Seleccione una provincia</option>
          {provincias.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
          Provincia
        </label>
      </div>
    </div>

    {/* Cantón */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <select
          value={formData.canton_id}
          onChange={(e) => setFormData({ ...formData, canton_id: Number(e.target.value) })}
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
        >
          <option value={0}>Seleccione un cantón</option>
          {cantones.map((c) => (
            <option key={c.can_id} value={c.can_id}>{c.can_nombre}</option>
          ))}
        </select>
        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
          Cantón
        </label>
      </div>
    </div>

    {/* Estado */}
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="relative">
        <select
          value={formData.activo ? "true" : "false"}
          onChange={(e) => setFormData({ ...formData, activo: e.target.value === "true" })}
          className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
          Estado
        </label>
      </div>
    </div>

  </div>

  {/* Botón */}
  <div className="flex justify-center mt-8">
    <button
      className="bg-green-600 px-8 py-3 rounded-lg text-white font-semibold shadow-md hover:bg-green-700 transition"
      type="submit"
    >
      Guardar Cambios
    </button>
  </div>
</form>



    );
};

export default EditEmpresaForm;
