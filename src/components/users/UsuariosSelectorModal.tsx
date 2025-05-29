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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuariosAdmin();
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else if (Array.isArray(data.usuarios)) {
          setUsuarios(data.usuarios);
        } else {
          console.error("Respuesta inesperada:", data);
        }
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };
    if (isOpen) {
      fetchUsuarios();
    }
  }, [isOpen]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selectedIds);
    setSelectedIds([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray p-6 rounded-xl max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Selecciona Usuarios ADMIN</h3>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {Array.isArray(usuarios) && usuarios.map(usuario => (
            <div key={usuario.usua_id}>
              <label>
                <input
                  type="checkbox"
                  value={usuario.usua_id}
                  onChange={(e) => toggleSelect(usuario.usua_id)}
                />
                {usuario.usua_nombre} 
              </label>
            </div>
          ))}

        </div>
        <div className="flex justify-end mt-4 gap-3">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded-lg">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Asignar</button>
        </div>
      </div>
    </div>
  );
};

export default UsuariosSelectorModal;
