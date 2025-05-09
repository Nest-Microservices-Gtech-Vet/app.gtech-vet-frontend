import React, { useState } from "react"
import { createEmpresa } from "../../services/empresas/empresas";

const CreateEmpresaForm = () => {
    const [formData, setFormData] = useState({
        emp_nombre: "",
        emp_correo: "",
        emp_direccion: "",
        emp_telefono: "",
        emp_ruc: "",
        usua_admin_id: "",
        activo: true,
    });

    const sendEmpresa = async (e: React.FormEvent) => {
        e.preventDefault();

        const idNumber = Number(formData.usua_admin_id);
        if (isNaN(idNumber)) {
            alert("ID de administrador inválido");
            return;
        }

        const formDataFixed = {
            ...formData,
            usua_admin_id: idNumber,
        };

        console.log("Enviando empresa:", formDataFixed);

        const resultado = await createEmpresa(formDataFixed);
        if (resultado) {
            alert("empresa creado exitosamente");
            setFormData({
                emp_nombre: "",
                emp_correo: "",
                emp_direccion: "",
                emp_telefono: "",
                emp_ruc: "",
                usua_admin_id: "",
                activo: true,
            })
        } else {
            alert("error al crear usuario")
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
                    <button className="mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center" type="submit">Crear Usuario</button>
                </div>
            </div>
        </form>
    )
}
export default CreateEmpresaForm;