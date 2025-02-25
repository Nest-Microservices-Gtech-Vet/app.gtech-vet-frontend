import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { JSX, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserList from "./components/users/UserList";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Usuarios from "./components/users/Usuarios";
import Empresas from "./components/empresas/Empresas";
import DashboardLayout from "./components/layout/DashboardLayout";
import CreateUserForm from "./components/users/CreateUserForm";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Layout Principal con Sidebar y Header
const MainLayout = ({ children }: { children: JSX.Element }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 ">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-grow">
        <Header title="Mi Aplicación" />
        <main className="flex-grow min-w-0 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout>
                  <DashboardLayout />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <MainLayout>
                  <UserList />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/user-create"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CreateUserForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Usuarios />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/empresas"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Empresas />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
