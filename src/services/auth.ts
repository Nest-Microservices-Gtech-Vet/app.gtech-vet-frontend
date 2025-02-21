import api from './api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

// 🔹 Función para hacer login
export const loginSuperAdmin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login-superadmin', credentials);
  localStorage.setItem('accessToken', data.token);
  return data;
};

// 🔹 Función para cerrar sesión
export const logout = (): void => {
  localStorage.removeItem('accessToken');
};


export const getUsers = async () => {
  const token = localStorage.getItem("accessToken");
  const { data } = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`, // Se envía el token para autenticación
    },
  });
  console.log({data})
  return data;
};
