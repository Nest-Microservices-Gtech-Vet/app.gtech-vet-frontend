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
       <form onSubmit={updatedMascotaq} className="w-full max-w-5xl bg-gray-50 p-5 rounded-lg shadow-md">

            <div className="w-full max-w-5xl bg-gray-50 p-5 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Ingrese los datos del cliente</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 p-4 rounded-lg">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.mas_nombre}
                                onChange={(e) => setFormData({ ...formData, mas_nombre: e.target.value })}
                                type="text"
                                id="mas_nombre"
                                name="mas_nombre"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="mas_nombre"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ">Ingresar Nombre</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.mas_fechaNac?.split('T')[0] || ""}
                                onChange={(e) => setFormData({ ...formData, mas_fechaNac: e.target.value })}
                                type="text"
                                id="mas_fechaNac"
                                name="mas_fechaNac"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="mas_fechaNac"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ">Ingresar Fecha de nacimiento</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.mas_color}
                                onChange={(e) => setFormData({ ...formData, mas_color: e.target.value })}
                                type="text"
                                id="mas_color"
                                name="mas_color"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="mas_color"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ">Ingresar Color</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.mas_microchip}
                                onChange={(e) => setFormData({ ...formData, mas_microchip: e.target.value })}
                                type="text"
                                id="mas_microchip"
                                name="mas_microchip"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="mas_microchip"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ">Ingresar microchip</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.mas_foto}
                                onChange={(e) => setFormData({ ...formData, mas_foto: e.target.value })}
                                type="text"
                                id="mas_foto"
                                name="mas_foto"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="mas_foto"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ">Ingresar foto</label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                value={formData.mas_notas}
                                onChange={(e) => setFormData({ ...formData, mas_notas: e.target.value })}
                                type="text"
                                id="mas_notas"
                                name="mas_notas"
                                className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                                placeholder=" "
                                autoComplete="new-password" />
                            <label
                                htmlFor="mas_notas"
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 ">Ingresar Notas</label>
                        </div>
                    </div>



                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.mas_esterilizado ? "true" : "false"}
                                onChange={(e) => setFormData({ ...formData, mas_esterilizado: e.target.value === "true" })}
                                className="peer bg-gray-50 h-10 w-72 rounded-lg text-black-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                            >
                                <option value="true">Si</option>
                                <option value="false">No</option>
                            </select>
                            <label
                                className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50 "
                            >
                                Esterilizado
                            </label>
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


                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.cliente_id}
                                onChange={(e) => setFormData({ ...formData, cliente_id: Number(e.target.value) })}
                                className="peer bg-gray-50 h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            >
                                <option value="0">-- Selecciona Cliente --</option>
                                {clientes.map((cli) => (
                                    <option key={cli.cli_id} value={cli.cli_id}>
                                        {cli.cli_nombre} {cli.cli_apellido}
                                    </option>
                                ))}
                            </select>
                            <label className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600">
                                Cliente
                            </label>
                        </div>
                    </div>

                    {/* Especie */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.especie_id}
                                onChange={handleEspecieCHange }
                                className="peer bg-gray-50 h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            >
                                <option value={0}>-- Selecciona Especie --</option>
                                {especies.map((esp:any) => (
                                    <option key={esp.id} value={esp.id}>
                                        {esp.nombre}
                                    </option>
                                ))}
                            </select>
                            <label className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600">
                                Especie
                            </label>
                        </div>
                    </div>

                    {/* Raza */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <select
                                value={formData.raza_id}
                                onChange={(e) => setFormData({ ...formData, raza_id: Number(e.target.value) })}
                                className="peer bg-gray-50 h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
                            >
                                <option value="">-- Selecciona Raza --</option>
                                {razas.map((raza: any) => (
                                    <option key={raza.id} value={raza.id}>
                                        {raza.nombre}
                                    </option>
                                ))}
                            </select>
                            <label className="absolute left-2 -top-3 text-gray-500 bg-gray-50 px- peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600">
                                Raza
                            </label>
                        </div>
                    </div>

                </div>
                <div className="flex justify-center mt-4">
                    <button className="mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center" type="submit">Guardar Cambios</button>
                </div>
            </div>
        </form>
    );
}

export default EditMascotaForm;