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
        mas_foto: null as File | null | string,
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

    const [searchCliente, setSearchCliente] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredClientes = clientes.filter(cli =>
        `${cli.cli_nombre} ${cli.cli_apellido}`.toLowerCase().includes(searchCliente.toLowerCase())
    );



    useEffect(() => {
        const fetchMascota = async () => {
            try {
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

                const mascota = await getMascotaById(mascotaId!);
                if (mascota) {
                    const { mas_id, createdBy, updatedBy, created_at, updated_at, ...mascotaData } = mascota;
                    setFormData(mascotaData);

                    const razasFiltradas = razasMapped.filter(
                        (r: { especie_id: number; }) => r.especie_id === mascotaData.especie_id
                    );
                    setRazas(razasFiltradas);

                    const clienteActual = clientesRes.data.find((cli: Cliente) => cli.cli_id === mascotaData.cliente_id);
                    if (clienteActual) {
                        setSearchCliente(`${clienteActual.cli_nombre} ${clienteActual.cli_apellido}`);
                    }

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

        const form = new FormData();
        form.append("mas_nombre", formData.mas_nombre);
        form.append("mas_fechaNac", formData.mas_fechaNac);
        form.append("mas_peso", String(formData.mas_peso));
        form.append("mas_color", formData.mas_color);
        form.append("mas_esterilizado", String(formData.mas_esterilizado));
        form.append("mas_microchip", formData.mas_microchip);
        form.append("mas_notas", formData.mas_notas);
        form.append("especie_id", String(formData.especie_id));
        form.append("raza_id", String(formData.raza_id));
        form.append("cliente_id", String(formData.cliente_id));
        form.append("empresa_id", String(formData.empresa_id));
        form.append("activo", String(formData.activo));

        // Solo si se seleccionó una nueva foto, la agregamos
        if (formData.mas_foto && formData.mas_foto instanceof File) {
            form.append("mas_foto", formData.mas_foto);
        }

        try {
            const result = await updateMascota(Number(mascotaId ?? 0), form); // ← nuevo
            if (result) {
                Swal.fire({
                    icon: "success",
                    title: "¡Registro modificado!",
                    text: "Los cambios fueron guardados correctamente.",
                    timer: 2300,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        navigate(`/mis-empresas/${id}/mascotas`);
                    },
                });
            } else {
                alert("Error al actualizar el registro");
            }
        } catch (error) {
            console.error("Error al actualizar el registro:", error);
        }
    };




    return (

        <div className="w-full max-w-screen-xl mx-auto mb-4">
            <div className="flex flex-wrap justify-items-start items-center px-6 py-4">

                <div className="flex gap-3 mt-2 lg:mt-0 flex-wrap">
                    <button
                        onClick={() => navigate(`/mis-empresas/${id}/mascotas`)}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition"
                    >
                        🔙 Volver a Listado Mascotas
                    </button>

                    <button
                        onClick={() => navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
                    >
                        🩺 Historial Clínico
                    </button>

                    <button
                        onClick={() => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/nueva`)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md transition"
                    >
                        ➕ Nueva Consulta
                    </button>

                    <button
                        onClick={() => navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/vacunas`)}
                        className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition"
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


                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6 justify-center">

                            <div className="col-span-full just">
                                {/* Mostrar imagen actual si es string */}
                                {typeof formData.mas_foto === "string" && (
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Foto actual</label>
                                        <img
                                            src={`http://localhost:3010/uploads/perfil/${formData.mas_foto}`}
                                            alt="Foto mascota"
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                    </div>
                                )}

                                {/* Mostrar previsualización si se selecciona una nueva */}
                                {formData.mas_foto instanceof File && (
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Nueva foto seleccionada</label>
                                        <img
                                            src={URL.createObjectURL(formData.mas_foto)}
                                            alt="Nueva foto"
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                    </div>
                                )}

                                {/* Input para cambiar la foto */}

                                <label className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md cursor-pointer">
                                    Cambiar foto
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setFormData({ ...formData, mas_foto: file });
                                            }
                                        }}
                                    />
                                </label>
                            </div>

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

 <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">Propietario</label>
    <input
        type="text"
        value={searchCliente}
        onChange={(e) => {
            setSearchCliente(e.target.value);
            setFormData({ ...formData, cliente_id: 0 }); // Reinicia cliente_id si escribe algo
            setShowDropdown(true); // Siempre mostrar dropdown al escribir
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // Pequeño delay para click
        placeholder="Busca un cliente"
        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-sky-600 focus:outline-none"
    />

    {showDropdown && searchCliente && (
        <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto mt-1">
            {clientes
                .filter(cli =>
                    `${cli.cli_nombre} ${cli.cli_apellido}`.toLowerCase().includes(searchCliente.toLowerCase())
                )
                .map(cli => (
                    <li
                        key={cli.cli_id}
                        onClick={() => {
                            setFormData({ ...formData, cliente_id: cli.cli_id });
                            setSearchCliente(`${cli.cli_nombre} ${cli.cli_apellido}`);
                            setShowDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-sky-200 cursor-pointer"
                    >
                        {cli.cli_nombre} {cli.cli_apellido}
                    </li>
                ))}
        </ul>
    )}
     {/* Botón para crear nuevo cliente */}
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
                {/* Botón de acción */} <div className="mt-10 flex justify-center"> <div className="flex justify-center mt-4"> <button className="mt-4 min-w-2xl bg-green-500 py-2 rounded-md hover:bg-green-600 items-center" type="submit">Guardar Cambios</button> </div> </div>
            </form>
        </div>
    );



}

export default EditMascotaForm;