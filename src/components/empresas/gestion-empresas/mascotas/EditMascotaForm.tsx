import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Cliente } from "../../../../types/clientes/cliente";
import { Especie } from "../../../../types/mascotas/especie";
import { Raza } from "../../../../types/mascotas/raza";
import { getClientes } from "../../../../services/gestion-empresa/clientes/clientes";
import { getEspecies, getRazas } from "../../../../services/gestion-empresa/mascotas/catalogosMascota";
import { getMascotaById, updateMascota } from "../../../../services/gestion-empresa/mascotas/mascotas";
import Swal from "sweetalert2";

const EditMascotaForm = () => {
    const { empresaId } = useParams();
    const { mascotaId } = useParams();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        mas_nombre: "",
        mas_fechaNac: "",
        mas_peso: 0,
        mas_color: "",
        mas_esterilizado: false,
        mas_microchip: "",
        mas_foto: "",
        mas_notas: "",
        especie_id: 0,
        raza_id: 0,
        cliente_id: 0,
        empresa_id: Number(empresaId),
        activo: true,
    });
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [especies, setEspecies] = useState<Especie[]>([]);
    const [razas, setRazas] = useState<Raza[]>([]);
    const [razastodas, setRazasTodas] = useState<Raza[]>([]);

    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const clientesRes = await getClientes();
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

                const mascota = await getMascotaById(mascotaId!);
                if (mascota) {
                    const { mas_id, createdBy, updatedBy, created_at, updated_at, ...mascotaData } = mascota;
                    setFormData(mascotaData);

                    const razasFiltradas = razasMapped.filter(
                        (r: { especie_id: number; }) => r.especie_id === mascotaData.especie_id
                    );
                    setRazas(razasFiltradas);
                } else {
                    console.error("mascota no encontrada");
                }
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }

        };
        fetchMascota();
    }, [mascotaId]);

    const handleEspecieCHange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const especieId = Number(e.target.value);
        setFormData({ ...formData, especie_id: especieId, raza_id: 0 });

        const razasFiltradas = razastodas.filter(r => r.especie_id === especieId);
        setRazas(razasFiltradas);
    }

    const updatedMascotaq = async (e: React.FormEvent) => {
        e.preventDefault();
        const mascotaDataToUpdate = {
            mas_nombre: formData.mas_nombre,
            mas_fechaNac: formData.mas_fechaNac,
            mas_peso: formData.mas_peso,
            mas_color: formData.mas_color,
            mas_esterilizado: formData.mas_esterilizado,
            mas_microchip: formData.mas_microchip,
            mas_foto: formData.mas_foto,
            mas_notas: formData.mas_notas,
            especie_id: formData.especie_id,
            raza_id: formData.raza_id,
            cliente_id: formData.cliente_id,
            empresa_id: formData.empresa_id,
            activo: formData.activo,
        };
        try {
            const result = await updateMascota(mascotaId!, mascotaDataToUpdate);
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro modificado!',
                    text: 'Los cambios fueron guardados correctamente.',
                    timer: 2300,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        navigate(`/mis-empresas/${id}/mascotas`); // Ruta a la lista de empresas
                    }
                });
            } else { alert("Error al actualizar el registro"); }
        } catch (error) {
            console.error("Error al actualizar el registro:", error);
        }
    }



    return (

        <div className="w-full max-w-screen-xl mx-auto mb-4">
            <div className="flex flex-wrap justify-center items-center px-6 py-4">

                <div className="flex gap-3 mt-2 lg:mt-0 flex-wrap">
                    <button
                        onClick={() => navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                    >
                        🩺 Historial Clínico
                    </button>

                    <button
                        onClick={() => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/nueva`)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md transition"
                    >
                        ➕ Nueva Consulta
                    </button>

                    <button
                        onClick={() => navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/vacunas`)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition"
                    >
                        💉 Vacunas
                    </button>
                </div>

            </div>
            <form onSubmit={updatedMascotaq} className="w-full max-w-screen-xl mx-auto p-8 rounded-xl shadow bg-white">

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

                            <div>
                                <label htmlFor="mas_foto" className="block mb-1 text-sm font-medium text-gray-700">Foto (URL)</label>
                                <input
                                    type="text"
                                    id="mas_foto"
                                    value={formData.mas_foto}
                                    onChange={(e) => setFormData({ ...formData, mas_foto: e.target.value })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
                                    placeholder="URL de foto"
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
                                <option value="0">-- Selecciona Cliente --</option>
                                {clientes.map((cli) => (
                                    <option key={cli.cli_id} value={cli.cli_id}>
                                        {cli.cli_nombre} {cli.cli_apellido}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/mis-empresas/${id}/clientes/crear-cliente?returnTo=/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}`)
                                }
                                className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                            >
                                + Crear Propietario
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
        </div>
    );



}

export default EditMascotaForm;