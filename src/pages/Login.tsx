import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSuperAdmin } from "../services/auth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook para redirección

  const handleLogin = async () => {
    try {
      const userData = await loginSuperAdmin({ email, password });
      console.log("Usuario autenticado:", userData);
      navigate("/dashboard"); // 🔥 Redirige al Dashboard
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-r from-white via-white to-indigo-500">
      <div className="bg-white shadow-lg rounded-2xl flex flex-wrap max-w-4xl w-full">

        {/* Sección Izquierda (Oculta en pantallas pequeñas) */}
        <div className="hidden md:flex md:w-1/2 bg-blue-500 text-white flex-col justify-center items-center p-10 rounded-l-2xl">
          <h2 className="text-3xl font-bold">Hola, Bienvenidos!</h2>
          <p className="mt-2">¿No tienes una cuenta?</p>
        </div>

        {/* Sección Derecha */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="flex flex-col items-center text-center md:text-left p-6 md:p-10 gap-5 bg-white rounded-2xl">
            <h2 className="text-2xl font-bold">Login</h2>

            {/* Campo de Email */}
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

            {/* Campo de Password */}
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

            {/* Botón */}
            <button
              onClick={handleLogin}
              className="w-full md:w-auto px-6 py-2 rounded-md bg-gradient-to-tr from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white">
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </section>

    // <div>
    //   <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //   <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
    //   <button onClick={handleLogin}>Iniciar sesión</button>
    // </div>
  );
};

export default Login;
