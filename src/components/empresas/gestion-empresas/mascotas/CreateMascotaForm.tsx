import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { crearMascota, getMascotaById } from "../../../../services/gestion-empresa/mascotas/mascotas";
import Swal from "sweetalert2";
import { getClientes } from "../../../../services/gestion-empresa/clientes/clientes";
import { getEspecies, getRazas } from "../../../../services/gestion-empresa/mascotas/catalogosMascota";
import { Cliente } from "../../../../types/clientes/cliente";
import { Raza } from "../../../../types/mascotas/raza";
import { Especie } from "../../../../types/mascotas/especie";

const CreateMascotaForm = () => {
    const { empresaId } = useParams();
    const { mascotaId } = useParams();
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const empresaIdNum = id ? parseInt(id, 10) : 0;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        mas_nombre: "",
        mas_fechaNac: "",
        mas_peso: 0,
        mas_color: "",
        mas_esterilizado: false,
        mas_microchip: "",
        mas_notas: "",
        activo: true,
        especie_id: 0,
        raza_id: 0,
        cliente_id: 0,
        empresa_id: empresaIdNum,
        fotoFile: null as File | null,
    });



    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [especies, setEspecies] = useState<Especie[]>([]);
    const [razas, setRazas] = useState<Raza[]>([]);
    const [razastodas, setRazasTodas] = useState<Raza[]>([]);

    useEffect(() => {
        const newClienteId = searchParams.get("newClienteId");
        if (newClienteId) {
            setFormData((prev) => ({
                ...prev,
                cliente_id: Number(newClienteId),
            }));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {

            const empresaId = Number(id);
            const clientesRes = await getClientes(empresaId);
            setClientes(clientesRes.data || []); // ← clientes sí devuelve { data }

            const especiesGet = await getEspecies();
            const especiasMapped = especiesGet.map((es: any) => ({
                id: es.esp_id,
                nombre: es.esp_nombre,
            }));
            setEspecies(especiasMapped);

            const razasGet = await getRazas();
            const razasMapped = razasGet.map((r: any) => ({
                id: r.raz_id,
                nombre: r.raz_nombre,
                especie_id: r.especie_id,
            }));
            setRazas(razasMapped);
            setRazasTodas(razasMapped);


        };
        fetchData();
    }, []);

    const handleEspecieCHange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const especieId = Number(e.target.value);
        setFormData({ ...formData, especie_id: especieId, raza_id: 0 });

        const razasFiltradas = razastodas.filter(r => r.especie_id === especieId);
        setRazas(razasFiltradas);
    }



    const sendMascota = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("mas_nombre", formData.mas_nombre);
        data.append("mas_fechaNac", formData.mas_fechaNac);
        data.append("mas_peso", String(formData.mas_peso));
        data.append("mas_color", formData.mas_color);
        data.append("mas_esterilizado", String(formData.mas_esterilizado));
        data.append("mas_microchip", formData.mas_microchip);
        data.append("mas_notas", formData.mas_notas);
        data.append("especie_id", String(formData.especie_id));
        data.append("raza_id", String(formData.raza_id));
        data.append("cliente_id", String(formData.cliente_id));
        data.append("empresa_id", String(formData.empresa_id));
        data.append("activo", String(formData.activo));

        if (formData.fotoFile) {
            data.append("foto", formData.fotoFile);
        }

        try {
            const result = await crearMascota(data); // Asegúrate de que `crearMascota` envíe como multipart
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Mascota creada!',
                    text: 'La mascota fue registrada correctamente.',
                    timer: 5000,
                    timerProgressBar: true,
                    didClose: () => {
                        navigate(`/mis-empresas/${id}/mascotas`);
                    }
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo crear la mascota", "error");
        }
    };

    return (
        <form onSubmit={sendMascota} className="w-full max-w-screen-xl mx-auto p-8 rounded-xl shadow bg-white">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Sección izquierda: Datos de la Mascota */}
                <div className="lg:col-span-2 border-r border-gray-200 pr-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">🐾 Datos de la Mascota</h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6">
                        {/* Repite este bloque para cada campo */}
                        <div>
                            <label htmlFor="mas_nombre" className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                id="mas_nombre"
                                value={formData.mas_nombre}
                                onChange={(e) => setFormData({ ...formData, mas_nombre: e.target.value })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                                placeholder="Ingrese nombre"
                            />
                        </div>

                        <div>
                            <label htmlFor="mas_fechaNac" className="block mb-1 text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                            <input
                                type="date"
                                id="mas_fechaNac"
                                value={formData.mas_fechaNac?.split("T")[0] || ""}
                                onChange={(e) => setFormData({ ...formData, mas_fechaNac: e.target.value })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="mas_color" className="block mb-1 text-sm font-medium text-gray-700">Color</label>
                            <input
                                type="text"
                                id="mas_color"
                                value={formData.mas_color}
                                onChange={(e) => setFormData({ ...formData, mas_color: e.target.value })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                                placeholder="Color"
                            />
                        </div>

                        <div>
                            <label htmlFor="mas_microchip" className="block mb-1 text-sm font-medium text-gray-700">Microchip</label>
                            <input
                                type="text"
                                id="mas_microchip"
                                value={formData.mas_microchip}
                                onChange={(e) => setFormData({ ...formData, mas_microchip: e.target.value })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                                placeholder="Microchip"
                            />
                        </div>

                        {/* <div>
                            <label htmlFor="mas_foto" className="block mb-1 text-sm font-medium text-gray-700">Foto (URL)</label>
                            <input
                                type="text"
                                id="mas_foto"
                                value={formData.mas_foto}
                                onChange={(e) => setFormData({ ...formData, mas_foto: e.target.value })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                                placeholder="URL de foto"
                            />
                        </div> */}

                        <div>
                            <label htmlFor="fotoFile" className="block mb-1 text-sm font-medium text-gray-700">Foto de la mascota</label>
                            <input
                                type="file"
                                id="fotoFile"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setFormData({ ...formData, fotoFile: file });
                                }}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                            />
                        </div>



                        <div>
                            <label htmlFor="mas_notas" className="block mb-1 text-sm font-medium text-gray-700">Notas</label>
                            <input
                                type="text"
                                id="mas_notas"
                                value={formData.mas_notas}
                                onChange={(e) => setFormData({ ...formData, mas_notas: e.target.value })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                                placeholder="Notas"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Esterilizado</label>
                            <select
                                value={formData.mas_esterilizado ? "true" : "false"}
                                onChange={(e) => setFormData({ ...formData, mas_esterilizado: e.target.value === "true" })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                            >
                                <option value="true">Sí</option>
                                <option value="false">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Estado</label>
                            <select
                                value={formData.activo ? "true" : "false"}
                                onChange={(e) => setFormData({ ...formData, activo: e.target.value === "true" })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Especie</label>
                            <select
                                value={formData.especie_id}
                                onChange={handleEspecieCHange}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                            >
                                <option value={0}>-- Selecciona Especie --</option>
                                {especies.map((esp: any) => (
                                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Raza</label>
                            <select
                                value={formData.raza_id}
                                onChange={(e) => setFormData({ ...formData, raza_id: Number(e.target.value) })}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                            >
                                <option value="">-- Selecciona Raza --</option>
                                {razas.map((raza: any) => (
                                    <option key={raza.id} value={raza.id}>{raza.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sección derecha: Cliente */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">👤 Propietario</h2>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Seleccionar Propietario</label>
                        <select
                            value={formData.cliente_id}
                            onChange={(e) => setFormData({ ...formData, cliente_id: Number(e.target.value) })}
                            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                        >
                            <option value="0">-- Selecciona El Propietario --</option>
                            {clientes.map((cli) => (
                                <option key={cli.cli_id} value={cli.cli_id}>
                                    {cli.cli_nombre} {cli.cli_apellido}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            className="bg-blue-500 px-3 py-1 mt-2 rounded-md hover:bg-blue-600 text-white"

                            onClick={() => {
                                const returnTo = mascotaId
                                    ? `/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}`
                                    : `/mis-empresas/${id}/mascotas/crear-mascota`;

                                navigate(
                                    `/mis-empresas/${id}/clientes/crear-cliente?returnTo=${encodeURIComponent(returnTo)}`
                                );
                            }}
                        >
                            ➕ Crear nuevo cliente
                        </button>

                    </div>
                </div>
            </div>

            {/* Botón de acción */}
            <div className="mt-10 flex justify-center">
                <div className="flex justify-center mt-4">
                    <button className="mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center" type="submit">Guardar Cambios</button>
                </div>
            </div>
        </form>
    );
}

export default CreateMascotaForm;