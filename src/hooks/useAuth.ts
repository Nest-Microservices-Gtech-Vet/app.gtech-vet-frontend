// import { useState } from 'react';
// import { loginSuperAdmin, logout } from '../services/auth';

// interface AuthState {
//     token: string | null;
//     user: { id: number; name: string; email: string } | null;
// }

// export const useAuth = () => {
//     const [auth, setAuth] = useState<AuthState>({ token: null, user: null });

//     const login = async (email: string, password: string) => {
//         try {
//             const data = await loginSuperAdmin({ email, password });
//             setAuth({ token: data.token, user: data.user });
//         } catch (error) {
//             console.error('Error en el login:', error);
//         }
//     };

//     const handleLogout = () => {
//         logout();
//         setAuth({ token: null, user: null });
//     };

//     return { auth, login, handleLogout };
// };
