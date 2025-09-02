import { apiFetch } from "./api";
export const login = async (email, password) => {
    try {
        const data = await apiFetch("auth/login", {
            method: "POST",
            body: JSON.stringify({ usua_email: email, usua_contrasenia: password }),
            credentials: "include",
        });
        console.log("Respuesta del login:", data);
        const usuario = {
            id: data.user.usua_id,
            nombre: `${data.user.usua_nombre} ${data.user.usua_apellido}`,
            rol: data.user.usua_rol,
            email: data.user.usua_email
        };
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, usuario };
    }
    catch (error) {
        console.error("Error en login:", error);
        return { success: false };
    }
};
export const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
};
export const isAuthenticated = () => !!localStorage.getItem("accessToken");
