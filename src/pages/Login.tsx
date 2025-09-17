import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(email, password);

    if (!success) {
      alert("Credenciales incorrectas");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("No se pudo obtener la información del usuario.");
      return;
    }

    const user = JSON.parse(storedUser);
    console.log("ROL DEL USUARIO:", user.usua_rol);

    // Redireccionamiento por rol
    switch (user.usua_rol) {
      case "SUPERADMIN":
        navigate("/dashboard");
        break;

      case "ADMIN":
        navigate("/mis-empresas");
        break;

      default:
        navigate("/login");
        break;
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-r from-white via-white to-indigo-500">
      <div className="bg-white shadow-lg rounded-2xl flex flex-wrap max-w-4xl w-full">
        <div className="hidden md:flex md:w-1/2 bg-blue-500 text-white flex-col justify-center items-center p-10 rounded-l-2xl">
          <h2 className="text-3xl font-bold">Hola, Bienvenidos!</h2>
          <p className="mt-2">¿No tienes una cuenta?</p>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="flex flex-col items-center text-center md:text-left p-6 md:p-10 gap-5 bg-white rounded-2xl">
            <h2 className="text-2xl font-bold">Login</h2>

            <div className="w-full">
              <label className="block text-gray-600 font-semibold">Username</label>
              <input
                type="text"
                className="w-full p-2 mt-2 pr-4 pl-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600 font-semibold">Password</label>
              <input
                type="password"
                className="w-full p-2 mt-2 pr-4 pl-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                placeholder="Ingresa tu clave"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full md:w-auto px-6 py-2 rounded-md bg-gradient-to-tr from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white">
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
