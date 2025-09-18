import { apiFetch } from "./api";
export const login = async (email, password) => {
    try {
        const data = await apiFetch("auth/login", {
            method: "POST",
            body: JSON.stringify({ usua_email: email, usua_contrasenia: password }),
            credentials: "include",
        });
        if (!data.user || !data.token)
            return { success: false };
        const usuario = {
            usua_id: data.user.usua_id,
            usua_nombre: data.user.usua_nombre,
            usua_apellido: data.user.usua_apellido,
            usua_rol: data.user.usua_rol,
            usua_email: data.user.usua_email,
        };
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("user", JSON.stringify(usuario));
        return { success: true, usuario, token: data.token };
    }
    catch (error) {
        console.error("Error en login:", error);
        return { success: false };
    }
};
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
};
export const isAuthenticated = () => !!localStorage.getItem("accessToken");
