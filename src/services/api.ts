const API_URL = "http://localhost:3000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("accessToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // Solo agrega el header si hay token
  };

  const response = await fetch(`${API_URL}/${endpoint}`, { ...options, headers });
  const rawText = await response.text(); // 👀 Ver qué devuelve realmente el servidor

  if (!response.ok) {
    console.error("Error en API Fetch:", rawText);
    if (response.status === 401) {
      console.warn("Token expirado o inválido. Redirigiendo a login...");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    throw new Error(`Error ${response.status}: ${rawText}`);
  }


  try {
    return JSON.parse(rawText);
  } catch (error) {
    throw new Error("El servidor devolvió un formato inesperado.");
  }
};