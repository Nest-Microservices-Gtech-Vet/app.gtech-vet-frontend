import React, { useEffect, useState } from "react"
import { createEmpresa } from "../../services/empresas/empresas";
import { getCantones, getProvincias, getTiposEmpresa } from "../../services/empresas/catalogosEmpresa";
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
        usua_admin_id: "",
        provincia_id: 0,
        canton_id: 0,
        tipo_empresa_id: 0,
        activo: true,
    });

    const [provincias, setProvincias] = useState([]);
    const [cantonesTodos, setCantonesTodos] = useState<Canton[]>([]);
    const [cantones, setCantones] = useState<Canton[]>([]);
    const [tiposEmpresa, setTiposEmpresa] = useState([]);

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

            const tipos = await getTiposEmpresa();
            setTiposEmpresa(tipos);
        };

        fetchData();
    }, []);

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinciaId = Number(e.target.value); // 👈 conviertes a número
        setFormData({ ...formData, provincia_id: provinciaId, canton_id: 0 });

        const cantonesFiltrados = cantonesTodos.filter(c => c.provincia_id === provinciaId);
        setCantones(cantonesFiltrados);
    };

    const sendEmpresa = async (e: React.FormEvent) => {
        e.preventDefault();

        const idNumber = Number(formData.usua_admin_id);
        if (isNaN(idNumber)) {
            alert("ID de administrador inválido");
            return;
        }

        const formDataFixed = {
            ...formData,
            usua_admin_id: Number(formData.usua_admin_id),
            provincia_id: Number(formData.provincia_id),
            canton_id: Number(formData.canton_id),
            tipo_empresa_id: Number(formData.tipo_empresa_id),
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
    });;
            setFormData({
                emp_nombre: "",
                emp_correo: "",
                emp_direccion: "",
                emp_telefono: "",
                emp_ruc: "",
                usua_admin_id: "",
                provincia_id: 0,
                canton_id: 0,
                tipo_empresa_id: 0,
                activo: true,
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pudo crear la empresa.',
                confirmButtonColor: '#EF4444' // rojo
            });
        }
    }
    return (
        <form onSubmit={sendEmpresa} className="w-full max-w-5xl bg-gray-800 p-5 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Agreger Empresa</h1>

            <div className="w-full max-w-5xl bg-gray-800 p-5 rounded-lg shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 p-4 rounded-lg">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.emp_nombre}
                                onChange={(e) => setFormData({ ...formData, emp_nombre: e.target.value })}
                                type="text"
                                id="emp_nombre"
                                name="emp_nombre"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="emp_nombre"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Nombre</label>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.emp_correo}
                                onChange={(e) => setFormData({ ...formData, emp_correo: e.target.value })}
                                type="email"
                                id="emp_correo"
                                name="emp_correo"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="emp_correo"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Correo</label>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.emp_direccion}
                                onChange={(e) => setFormData({ ...formData, emp_direccion: e.target.value })}
                                type="text"
                                id="emp_direccion"
                                name="emp_direccion"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="emp_direccion"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar direccion</label>
                        </div>
                    </div>
                    {/* campos tipo select aquí */}
                    {/* Select de provincia */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.provincia_id}
                                onChange={handleProvinciaChange}
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            >
                                <option value={0}>Seleccione una provincia</option>
                                {provincias.map((provincia: any) => (
                                    <option key={provincia.id} value={provincia.id}>
                                        {provincia.nombre}
                                    </option>
                                ))}
                            </select>
                            <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
                                Provincia
                            </label>
                        </div>
                    </div>

                    {/* Select de cantón */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.canton_id}
                                onChange={(e) => setFormData({ ...formData, canton_id: Number(e.target.value) })}
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            >
                                <option value="">Seleccione un cantón</option>
                                {cantones.map((canton: any) => (
                                    <option key={canton.id} value={canton.id}>
                                        {canton.nombre}
                                    </option>
                                ))}
                            </select>
                            <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
                                Cantón
                            </label>
                        </div>
                    </div>



                    {/* Select de tipo de empresa */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.tipo_empresa_id}
                                onChange={(e) => setFormData({ ...formData, tipo_empresa_id: Number(e.target.value) })}
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            >
                                <option value="">Seleccione un tipo de empresa</option>
                                {tiposEmpresa.map((tipo: any) => (
                                    <option key={tipo.te_id} value={tipo.te_id}>
                                        {tipo.te_nombre}
                                    </option>
                                ))}
                            </select>
                            <label className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px-1 transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800">
                                Tipo de Empresa
                            </label>
                        </div>
                    </div>
                    {/* fin campos tipo select aquí */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.emp_telefono}
                                onChange={(e) => setFormData({ ...formData, emp_telefono: e.target.value })}
                                type="text"
                                id="emp_telefono"
                                name="emp_telefono"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="emp_telefono"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Telefono</label>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.emp_ruc}
                                onChange={(e) => setFormData({ ...formData, emp_ruc: e.target.value })}
                                type="text"
                                id="emp_ruc"
                                name="emp_ruc"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="emp_ruc"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar RUC</label>
                        </div>
                    </div>

                    {/* USUA ADMIN ID */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.usua_admin_id}
                                onChange={(e) => setFormData({ ...formData, usua_admin_id: e.target.value })}
                                type="number"
                                id="usua_admin_id"
                                name="usua_admin_id"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                            />
                            <label
                                htmlFor="usua_admin_id"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 "
                            >
                                Ingresar ID Administrador
                            </label>
                        </div>
                    </div>





                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.activo ? "true" : "false"}
                                onChange={(e) => setFormData({ ...formData, activo: e.target.value === "true" })}
                                className="peer bg-gray-800 h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                            <label
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 "
                            >
                                Estado
                            </label>
                        </div>
                    </div>

                </div>
                <div className="flex justify-center mt-4">
                    <button className="mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center" type="submit">Crear Empresa</button>
                </div>
            </div>
        </form>
    )
}
export default CreateEmpresaForm;