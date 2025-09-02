const BASE_URL = "https://app.amigovet123.com:8443";
export { BASE_URL };
const API_URL = "/api";
export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");
    const isFormData = options.body instanceof FormData;
    const headers = {
        // "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Si hay token, se envía en los headers
        ...(isFormData ? {} : { "Content-Type": "application/json" })
    };
    // Verifica si es un GET y tiene parámetros
    const url = endpoint.includes("?") ? `${API_URL}/${endpoint}` : `${API_URL}/${endpoint}`;
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        console.warn("Token expirado o inválido. Redirigiendo a login...");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    }
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
};
