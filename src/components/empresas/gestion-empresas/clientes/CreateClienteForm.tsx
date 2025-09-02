import { h2 } from "framer-motion/client";
import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createCliente } from "../../../../services/gestion-empresa/clientes/clientes";
import Swal from "sweetalert2";

const CreateClienteForm = () => {
    const { id: empresaId, mascotaId } = useParams();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get("returnTo");
    const navigate = useNavigate();

    const extractEmpresaId = () => {
        if (empresaId) return Number(empresaId); // Si viene desde la URL
        const returnTo = searchParams.get("returnTo");
        const match = returnTo?.match(/mis-empresas\/(\d+)/); // extrae el ID del string
        if (match) return Number(match[1]); // si encuentra un número
        return null;
    };

    const [formData, setFormData] = useState({
        cli_identificacion: "",
        cli_nombre: "",
        cli_apellido: "",
        cli_email: "",
        cli_celular: "",
        cli_direccion: "",
        cli_observaciones: "",
        activo: true,
        empresa_id: extractEmpresaId() || 0,
    });



    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const sendCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        const empresa_id_final = extractEmpresaId();

        if (!empresa_id_final) {
            alert("No se pudo determinar el ID de la empresa.");
            return;
        }

        // ✅ Validaciones básicas antes de enviar
        let newErrors: { [key: string]: string } = {};
        if (formData.cli_identificacion.length < 10 || formData.cli_identificacion.length > 13) {
            newErrors.cli_identificacion = "El RUC/Cédula debe tener entre 10 y 13 dígitos.";
        }
        if (formData.cli_celular.length !== 10) {
            newErrors.cli_celular = "El celular debe tener exactamente 10 dígitos.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const clienteFinal = {
            ...formData,
            empresa_id: empresa_id_final,
        };

        console.log("Formulario a enviar:", clienteFinal);
        const resultado = await createCliente(clienteFinal);
        if (resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cliente creado!',
                text: 'El Cliente fue registrado correctamente.',
                timer: 5000,
                timerProgressBar: true,
                didClose: () => {
                    if (returnTo) {
                        const redirectWithCliente = `${returnTo}${returnTo.includes("?") ? "&" : "?"}newClienteId=${resultado.cli_id}`;
                        navigate(redirectWithCliente);
                    } else {
                        navigate(`/mis-empresas/${id}/clientes`);
                    }
                }
            });
            setFormData({
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
        } else {
            alert("error al crear cliente")
        }

    };



    return (

        <form onSubmit={sendCliente} className="w-full max-w-5xl bg-gray-50 p-5 rounded-lg shadow-md">

            <div className="w-full max-w-5xl bg-gray-50 p-5 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Ingrese los datos del cliente</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 p-4 rounded-lg">




                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.cli_identificacion}
                                onChange={(e) => setFormData({
                                    ...formData, cli_identificacion: e.target.value.replace(/\D/g, "")
                                })}
                                type="text"
                                id="cli_identificacion"
                                name="cli_identificacion"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder="Ejemplo:1753696804001"
                                autoComplete="new-password" />
                            <label
                                htmlFor="cli_identificacion"
                                className={`
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto 
      `}>Ingresar RUC o Cedula</label>
                            {errors.cli_identificacion && (
                                <p className="text-red-500 text-sm mt-1">{errors.cli_identificacion}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.cli_nombre}
                                onChange={(e) => setFormData({ ...formData, cli_nombre: e.target.value })}
                                type="text"
                                id="cli_nombre"
                                name="cli_nombre"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder="Ejemplo: Santiago "
                                autoComplete="new-password" />
                            <label
                                htmlFor="cli_nombre"
                                className={`
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto
      `}>Ingresar Nombre</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.cli_apellido}
                                onChange={(e) =>
                                    setFormData({ ...formData, cli_apellido: e.target.value })
                                }
                                type="text"
                                id="cli_apellido"
                                name="cli_apellido"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600 placeholder-opacity-0 focus:placeholder-opacity-100 transition-all"
                                placeholder="Ejemplo: Mendoza"
                                autoComplete="off"
                            />
                            <label
                                htmlFor="cli_apellido"
                                className={`
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto
      `}
                            >
                                Ingresar Apellido
                            </label>
                        </div>
                    </div>


                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.cli_email}
                                onChange={(e) => setFormData({ ...formData, cli_email: e.target.value })}
                                type="email"
                                id="cli_email"
                                name="cli_email"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200  ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder="Ejemplo: ejemplo@gmail.com "
                                autoComplete="new-password" />
                            <label
                                htmlFor="cli_email"
                                className={`
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto
      `}>Ingresar Email</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.cli_celular}
                                onChange={(e) => setFormData({ ...formData, cli_celular: e.target.value.replace(/\D/g, ""), })}
                                type="text"
                                id="cli_celular"
                                name="cli_celular"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200  ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder="Ejemplo: 0987654321 "
                                autoComplete="new-password" />
                            <label
                                htmlFor="cli_celular"
                                className={`
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto
      `}>Ingresar Celular</label>
                            {errors.cli_celular && (
                                <p className="text-red-500 text-sm mt-1">{errors.cli_celular}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.cli_direccion}
                                onChange={(e) => setFormData({ ...formData, cli_direccion: e.target.value })}
                                type="text"
                                id="cli_direccion"
                                name="cli_direccion"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200  ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder="Ejemplo: Quito-ecuador "
                                autoComplete="new-password" />
                            <label
                                htmlFor="cli_direccion"
                                className={`
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto
      `}>Ingresar Direccion</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.cli_observaciones}
                                onChange={(e) => setFormData({ ...formData, cli_observaciones: e.target.value })}
                                type="text"
                                id="cli_observaciones"
                                name="cli_observaciones"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200  ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder="Ejemplo: Dueño dos mascotas "
                                autoComplete="new-password" />
                            <label
                                htmlFor="cli_observaciones"
                                className={`
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto
      `}>Ingresar Observaciones</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.activo ? "true" : "false"}
                                onChange={(e) => setFormData({ ...formData, activo: e.target.value === "true" })}
                                className="peer bg-gray-50 h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                            <label
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 "
                            >
                                Estado
                            </label>
                        </div>
                    </div>

                </div>
                <div className="flex justify-center mt-4">
                    <button className="mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center" type="submit">Crear Cliente</button>
                </div>
            </div>
        </form>
    )
}
export default CreateClienteForm;