const API_URL = "http://localhost:3000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("accessToken");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Si hay token, se envía en los headers
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
