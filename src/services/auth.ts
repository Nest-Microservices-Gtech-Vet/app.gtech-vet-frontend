import { apiFetch } from "./api";

export const login = async (email: string, password: string) => {
    try {
        const data = await apiFetch("auth/login", {
            method: "POST",
            body: JSON.stringify({ usua_email:email, usua_contrasenia:password }),
            credentials: "include",
        });

        console.log("Respuesta del login:", data);

        localStorage.setItem("accessToken", data.token);
        return true;
    } catch (error) {
        console.error("Error en login:", error);
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
};

export const isAuthenticated = () => !!localStorage.getItem("accessToken");