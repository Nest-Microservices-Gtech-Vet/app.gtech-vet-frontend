import React, { useEffect, useState } from "react"
import { createEmpresa } from "../../services/empresas/empresas";
import { getCantones, getProvincias } from "../../services/empresas/catalogosEmpresa";
import { Canton } from "../../types/empresa/canton";
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
        fotoFile: null as File | null,
    });

    const [provincias, setProvincias] = useState([]);
    const [cantonesTodos, setCantonesTodos] = useState<Canton[]>([]);
    const [cantones, setCantones] = useState<Canton[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const provs = await getProvincias();
            const provsMapped = provs.map((p: any) => ({
                id: p.prov_id,
                nombre: p.prov_nombre
            }));
            setProvincias(provsMapped);


            const cants = await getCantones();
            const cantsMapped = cants.map((c: any) => ({
                id: c.can_id,
                nombre: c.can_nombre,
                provincia_id: c.provincia_id
            }));
            setCantonesTodos(cantsMapped);


        };

        fetchData();
    }, []);

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinciaId = Number(e.target.value); // 👈 conviertes a número
        setFormData({ ...formData, provincia_id: provinciaId, canton_id: 0 });

        const cantonesFiltrados = cantonesTodos.filter(c => c.provincia_id === provinciaId);
        setCantones(cantonesFiltrados);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const sendEmpresa = async (e: React.FormEvent) => {
        e.preventDefault();



        const data = new FormData();
        data.append("emp_nombre", formData.emp_nombre);
        data.append("emp_correo", formData.emp_correo);
        data.append("emp_direccion", formData.emp_direccion);
        data.append("emp_telefono", formData.emp_telefono);
        data.append("emp_ruc", formData.emp_ruc);
        data.append("emp_tipo_empresa", formData.emp_tipo_empresa);
        data.append("provincia_id", String(formData.provincia_id));
        data.append("canton_id", String(formData.canton_id));
        data.append("fecha_inicio", formData.fecha_inicio);
        data.append("fecha_fin", formData.fecha_fin);
        data.append("activo", String(formData.activo));
        if (formData.fotoFile) {
            data.append("foto", formData.fotoFile);
        }


        try {
            console.log("Enviando empresa:", data);

            const resultado = await createEmpresa(data);
            if (resultado) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Empresa creada!',
                    text: 'La empresa fue registrada correctamente.',
                    confirmButtonColor: '#10B981' // verde
                }).then(() => {
                    navigate('/empresas'); // ⬅️ cambia esta ruta según tu app
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pudo crear la empresa.',
                confirmButtonColor: '#EF4444' // rojo
            });
        }
    }
    return (
        <form onSubmit={sendEmpresa} className="w-full max-w-6xl bg-gray-800 p-5 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">Agregar Empresa</h1>

            <div className="grid grid-cols-4 gap-6">

                {/* Logo de la empresa */}
                <div className="bg-gray-800 p-4 rounded-lg col-span-1 row-span-3 flex flex-col items-center justify-center">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Escoger Logo
                    </label>

                    {/* Vista previa de la imagen seleccionada */}
                    {formData.fotoFile && (
                        <img
                            src={URL.createObjectURL(formData.fotoFile)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg ring-2 ring-gray-600 mb-2"
                        />
                    )}

                    {/* Botón para escoger archivo */}
                    <label className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md cursor-pointer">
                        Seleccionar archivo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setFormData({ ...formData, fotoFile: file });
                            }}
                            className="hidden"
                        />
                    </label>

                    {/* Mostrar nombre del archivo */}

                </div>


                {/* Campos normales */}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <input
                            value={formData.emp_nombre}
                            onChange={(e) => setFormData({ ...formData, emp_nombre: e.target.value })}
                            type="text"
                            id="emp_nombre"
                            className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                             autoComplete="new-password"
                        />
                        <label
                            htmlFor="emp_nombre"
                            className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
                        >
                            Nombre
                        </label>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <input
                            value={formData.emp_correo}
                            onChange={(e) => setFormData({ ...formData, emp_correo: e.target.value })}
                            type="email"
                            id="emp_correo"
                            className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                             autoComplete="new-password"
                        />
                        <label
                            htmlFor="emp_correo"
                            className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
                        >
                            Correo
                        </label>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <input
                            value={formData.emp_direccion}
                            onChange={(e) => setFormData({ ...formData, emp_direccion: e.target.value })}
                            type="text"
                            id="emp_direccion"
                            className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                             autoComplete="new-password"
                        />
                        <label
                            htmlFor="emp_direccion"
                            className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
                        >
                            Dirección
                        </label>
                    </div>
                </div>

                {/* Teléfono */}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <input
                            value={formData.emp_telefono}
                            onChange={(e) => setFormData({ ...formData, emp_telefono: e.target.value })}
                            type="text"
                            id="emp_telefono"
                            className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                             autoComplete="new-password"
                        />
                        <label
                            htmlFor="emp_telefono"
                            className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
                        >
                            Teléfono
                        </label>
                    </div>
                </div>

                {/* Tipo de empresa (doble ancho) */}
                <div className="bg-gray-800 p-4 rounded-lg col-span-2 min-w-[280px]">
                    <div className="relative">
                        <input
                            value={formData.emp_tipo_empresa}
                            onChange={(e) => setFormData({ ...formData, emp_tipo_empresa: e.target.value })}
                            id="emp_tipo_empresa"
                            className="peer bg-transparent w-full rounded-lg text-gray-200 ring-2 px-2 py-2 ring-gray-500 focus:ring-sky-600 focus:outline-none resize-none"
                            placeholder=" "
                             autoComplete="new-password"
                        />
                        <label
                            htmlFor="emp_tipo_empresa"
                            className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
                        >
                            Tipo Empresa
                        </label>
                    </div>
                </div>

                {/* RUC */}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <input
                            value={formData.emp_ruc}
                            onChange={(e) => setFormData({ ...formData, emp_ruc: e.target.value })}
                            type="text"
                            id="emp_ruc"
                            className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            placeholder=" "
                             autoComplete="new-password"
                        />
                        <label
                            htmlFor="emp_ruc"
                            className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800"
                        >
                            RUC
                        </label>
                    </div>
                </div>



                {/* Provincia */}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <select
                            value={formData.provincia_id}
                            onChange={handleProvinciaChange}
                            className="peer bg-gray-800 h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                        >
                            <option value={0}>Seleccione Provincia</option>
                            {provincias.map((p: any) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
                            Provincia
                        </label>
                    </div>
                </div>

                {/* Cantón */}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <select
                            value={formData.canton_id}
                            onChange={(e) => setFormData({ ...formData, canton_id: Number(e.target.value) })}
                            className="peer bg-gray-800 h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                        >
                            <option value={0}>Seleccione Cantón</option>
                            {cantones.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
                            Cantón
                        </label>
                    </div>
                </div>

                {/* Estado */}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <select
                            value={formData.activo ? "true" : "false"}
                            onChange={(e) => setFormData({ ...formData, activo: e.target.value === "true" })}
                            className="peer bg-gray-800 h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
                            Estado
                        </label>
                    </div>
                </div>

                {/* Fecha inicio */}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <input
                            value={formData.fecha_inicio}
                            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                            type="date"
                            className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                        />
                        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
                            Fecha Inicio
                        </label>
                    </div>
                </div>

                {/* Fecha fin */}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[280px]">
                    <div className="relative">
                        <input
                            value={formData.fecha_fin}
                            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                            type="date"
                            className="peer bg-transparent h-10 w-full rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                        />
                        <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
                            Fecha Fin
                        </label>
                    </div>
                </div>

            </div>

            {/* Botón */}
            <div className="flex justify-center mt-8">
                <button
                    type="submit"
                    className="bg-green-600 px-8 py-3 rounded-lg text-white font-semibold shadow-md hover:bg-green-700 transition"
                >
                    Crear Empresa
                </button>
            </div>
        </form>

    )
}
export default CreateEmpresaForm;