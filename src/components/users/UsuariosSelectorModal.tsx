import React, { useEffect, useState } from "react";
import { getUsuariosAdmin } from "../../services/users/users";

interface Usuario {
  usua_id: number;
  usua_nombre: string;
  usua_email: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedUserIds: number[]) => void;
}

const UsuariosSelectorModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await getUsuariosAdmin();
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else if (Array.isArray(data.usuarios)) {
          setUsuarios(data.usuarios);
        } else {
          setFetchError("Respuesta inesperada del servidor.");
        }
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setFetchError("Error al cargar usuarios. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUsuarios();
      setShowSuccessAlert(false);
    }
  }, [isOpen]);



  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selectedIds);
    setSelectedIds([]);
    setShowSuccessAlert(true);

  };

  const handleClose = () => {
    setSelectedIds([]);
    setShowSuccessAlert(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={handleClose}>
      <div
        className="bg-gray-800 text-white-100 p-6 rounded-2xl shadow-lg w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold mb-4 text-white">
          Selecciona Usuarios a esta empresa
        </h3>

        {isLoading ? (
          <div className="text-center text-white py-8">Cargando usuarios...</div>
        ) : fetchError ? (
          <div className="text-red-600 text-center py-4">{fetchError}</div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 ">
            {usuarios.map((usuario) => (
              <label
                key={usuario.usua_id}
                className=" text-white-100-100 flex items-center gap-2 p-2 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(usuario.usua_id)}
                  onChange={() => toggleSelect(usuario.usua_id)}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-white">{usuario.usua_nombre}</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={handleClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-lg transition text-white ${selectedIds.length === 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Asignar
          </button>
        </div>

        {showSuccessAlert && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[400px]">
              <div className="text-green-600 text-4xl mb-3">✅</div>
              <h4 className="text-2xl font-bold text-green-600 mb-2">¡Éxito!</h4>
              <p className="text-gray-800 text-lg mb-6">Usuarios asignados correctamente.</p>
              <button
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-300 text-white text-base px-6 py-2 rounded-lg transition"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosSelectorModal;
