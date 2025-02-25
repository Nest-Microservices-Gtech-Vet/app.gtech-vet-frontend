import React, { useEffect, useState } from 'react'
import { getUserById, getUsers, updateUser } from '../../services/users/users';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../types/users/user';

const EditUserForm = () => {
    const { userId } = useParams(); // Obtiene el userId de la URL
    console.log("UserId:", userId);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        usua_ruc: "",
        usua_nombre: "",
        usua_apellido: "",
        usua_email: "",
        usua_celular: "",
        usua_direccion: "",
        usua_contrasenia: "",
        usua_rol: "ADMIN",
        activo: true,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserById(userId!); // Obtén el usuario por ID
                console.log("Usuario obtenido:", user); // Verifica que el usuario no sea undefined

                if (user) {
                    // Elimina propiedades no permitidas antes de actualizar el estado
                    const { usua_id, createdBy, updatedBy, created_at, updated_at, ...userData } = user;
                    setFormData(userData); // Llena el formulario con los datos permitidos
                } else {
                    console.error("Usuario no encontrado");
                }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };

        fetchUser();
    }, [userId]);

    const updatedUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const userDataToUpdate = {
            usua_ruc: formData.usua_ruc,
            usua_nombre: formData.usua_nombre,
            usua_apellido: formData.usua_apellido,
            usua_email: formData.usua_email,
            usua_celular: formData.usua_celular,
            usua_direccion: formData.usua_direccion,
            usua_contrasenia: formData.usua_contrasenia,
            usua_rol: formData.usua_rol,
            activo: formData.activo,
        };
        try {
            const result = await updateUser(userId!, userDataToUpdate);
            if (result) {
                alert("Usuario Actualizado Correctamente");
                navigate("/users")
            } else { alert("Error al actualizar el usuario"); }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };
    return (
        
            
            <form onSubmit={updatedUser} className="w-full max-w-5xl bg-gray-800 p-5 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
                {/* Campos del formulario similares a CreateUserForm */}

                {/* Repite los campos del formulario de creación aquí */}
                <div className="w-full max-w-5xl bg-gray-800 p-5 rounded-lg shadow-md">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 p-4 rounded-lg">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="relative bg-inherit">
                                <input
                                    value={formData.usua_ruc}
                                    onChange={(e) => setFormData({ ...formData, usua_ruc: e.target.value })}
                                    type="text"
                                    id="usua_ruc"
                                    name="usua_ruc"
                                    className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                    placeholder=" "
                                    autoComplete="new-password" />
                                <label
                                    htmlFor="usua_ruc"
                                    className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar RUC</label>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="relative bg-inherit">
                                <input
                                    value={formData.usua_nombre}
                                    onChange={(e) => setFormData({ ...formData, usua_nombre: e.target.value })}
                                    type="text"
                                    id="usua_nombre"
                                    name="usua_nombre"
                                    className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                    placeholder=" "
                                    autoComplete="new-password" />
                                <label
                                    htmlFor="usua_nombre"
                                    className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Nombre</label>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="relative bg-inherit">
                                <input
                                    value={formData.usua_apellido}
                                    onChange={(e) => setFormData({ ...formData, usua_apellido: e.target.value })}
                                    type="text"
                                    id="usua_apellido"
                                    name="usua_apellido"
                                    className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                    placeholder=" "
                                    autoComplete="new-password" />
                                <label
                                    htmlFor="usua_apellido"
                                    className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Apellido</label>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="relative bg-inherit">
                                <input
                                    value={formData.usua_email}
                                    onChange={(e) => setFormData({ ...formData, usua_email: e.target.value })}
                                    type="email"
                                    id="usua_email"
                                    name="usua_email"
                                    className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                    placeholder=" "
                                    autoComplete="new-password" />
                                <label
                                    htmlFor="usua_email"
                                    className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Email</label>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="relative bg-inherit">
                                <input
                                    value={formData.usua_celular}
                                    onChange={(e) => setFormData({ ...formData, usua_celular: e.target.value })}
                                    type="text"
                                    id="usua_celular"
                                    name="usua_celular"
                                    className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                    placeholder=" "
                                    autoComplete="new-password" />
                                <label
                                    htmlFor="usua_celular"
                                    className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Celular</label>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="relative bg-inherit">
                                <input
                                    value={formData.usua_contrasenia}
                                    onChange={(e) => setFormData({ ...formData, usua_contrasenia: e.target.value })}
                                    type="password"
                                    id="usua_contrasenia"
                                    name="usua_contrasenia"
                                    className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                    placeholder=" "
                                    autoComplete="new-password" />
                                <label
                                    htmlFor="usua_contrasenia"
                                    className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Contraseña</label>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="relative bg-inherit">
                                <input
                                    value={formData.usua_rol}
                                    onChange={(e) => setFormData({ ...formData, usua_rol: e.target.value })}
                                    type="text"
                                    id="usua_rol"
                                    name="usua_rol"
                                    className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                    placeholder=" " />
                                <label
                                    className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Rol</label>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="relative bg-inherit">
                                <input
                                    value={formData.usua_direccion}
                                    onChange={(e) => setFormData({ ...formData, usua_direccion: e.target.value })}
                                    type="text"
                                    id="usua_direccion"
                                    name="usua_direccion"
                                    className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                    placeholder=" "
                                    autoComplete="new-password" />
                                <label
                                    htmlFor="usua_direccion"
                                    className="absolute left-2 -top-3 text-gray-500 bg-gray-800 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-800 ">Ingresar Direccion</label>
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
                        <button className="mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center" type="submit">Modificar usuario</button>
                    </div>
                </div>


            </form>


    )
}

export default EditUserForm