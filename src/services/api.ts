import axios from "axios";

const token = localStorage.getItem("accessToken");

// 🔹 Crear una instancia de Axios con la base URL de tu API
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Agregar el token si existe
  },
});

// 🔹 Interceptor para agregar el Token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = {
        ...config.headers, // Mantener otros headers existentes
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// export const setAuthToken = (newToken: string | null) => {
//   if (newToken) {
//     localStorage.setItem("accessToken", newToken);
//     api.defaults.headers.Authorization = `Bearer ${newToken}`;
//   } else {
//     localStorage.removeItem("accessToken");
//     delete api.defaults.headers.Authorization;
//   }
// };

// Obtener usuarios (requiere autenticación)
export const getUsers = async () => {
  try {
    const response = await api.get("/users"); // 🔹 Aquí usamos api.get() en lugar de axios.get()
    
    // Asegurar que la respuesta sea un array
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("La API no devolvió un array:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return [];
  }
};

export default api;
