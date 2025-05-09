import { apiFetch } from "./api";

// services/auth.ts
export const login = async (username: string, password: string) => {
    const response = await apiFetch('auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usua_email: username,
            usua_contrasenia: password,
        }),
    });

    if (!response.ok) {
        return false; // o lanza error si prefieres
    }

    const data = await response.json();

    // Guarda el token si viene
    if (data.token) {
        localStorage.setItem('token', data.token);
        return true;
    }

    return false;
};



export const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
};

export const isAuthenticated = () => !!localStorage.getItem("accessToken");
