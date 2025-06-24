import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { JSX, useState } from "react";
import Login from "./pages/Login";
import UserList from "./components/users/UserList";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Usuarios from "./components/users/Usuarios";
import DashboardLayout from "./components/layout/DashboardLayout";
import CreateUserForm from "./components/users/CreateUserForm";
import EditUserForm from "./components/users/EditUserForm";
import EmpresasList from "./components/empresas/EmpresasList";
import { motion } from "framer-motion";
import CreateEmpresaForm from "./components/empresas/CreateEmpresaForm";
import MisEmpresas from "./components/empresas/MisEmpresas";
import UserListInactives from "./components/users/UserListInactives";
import EmpresaDetailPage from "./components/empresas/EmpresaDetailPage";
import EditEmpresaForm from "./components/empresas/EditEmpresaForm";
import EmpresasListInactive from "./components/empresas/EmpresasListInactive";
import EmpresaDetallePage from "./components/empresas/EmpresaDetallePage";
import DashboardEmpresa from "./components/empresas/admin/DashboardEmpresas";
import ClientesList from "./components/empresas/gestion-empresas/clientes/ClientesList";
import DashboardEmpresaLayout from "./components/empresas/admin/DashboardEmpresaLayout";
import CreateClienteForm from "./components/empresas/gestion-empresas/clientes/CreateClienteForm";
import EditClienteForm from "./components/empresas/gestion-empresas/clientes/EditClienteForm";
import MascotasList from "./components/empresas/gestion-empresas/mascotas/MascotasList";
import CreateMascotaForm from "./components/empresas/gestion-empresas/mascotas/CreateMascotaForm";
import EditMascotaForm from "./components/empresas/gestion-empresas/mascotas/EditMascotaForm";
import CreateConsultaForm from "./components/empresas/gestion-empresas/consultas/CreateConsultaForm";


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};


// Layout sin sidebar ni header para ADMIN
const AdminOnlyLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="h-screen p-4 bg-white-900 text-white overflow-auto">
      {children}
    </div>
  );
};

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  if (user.usua_rol === "ADMIN") {
    return <Navigate to="/mis-empresas" />;
  }

  return <DashboardLayout />;
};

const MainLayout = ({ children }: { children: JSX.Element }) => {
  const [isOpen, setIsOpen] = useState(false);



  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 flex-initial overflow-auto relative z-10 ">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-grow">
        <Header title="Mi Aplicación" />
        <main className="flex-grow min-w-0 p-4 overflow-auto  mx-auto ">
          <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 15, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* aqui irian los componentes que van en el dashboard */}

            {children}

          </motion.div>

        </main>
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
          {/* rutas de usuario "rol=SUPERADMIN" */}
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
            path="/users/inactives"
            element={
              <PrivateRoute>
                <MainLayout>
                  <UserListInactives />
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
            path="/user-edit/:userId"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EditUserForm />
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
          {/* rutas de usuario "rol=SUPERADMIN" */}
          {/* rutas de usuario "rol=SUPERADMIN */}
          <Route
            path="/empresas"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EmpresasList />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/empresas/inactivas"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EmpresasListInactive />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/empresa-create"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CreateEmpresaForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/empresa/detalle/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EmpresaDetallePage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/empresa-edit/:empresaId"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EditEmpresaForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/empresas/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EmpresaDetailPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          {/* rutas de usuario "rol=SUPERADMIN */}

          {/* RUTAS ADMIN layout sin sidebar */}
          <Route
            path="/mis-empresas"
            element={
              <PrivateRoute>
                <AdminOnlyLayout>
                  <MisEmpresas />
                </AdminOnlyLayout>
              </PrivateRoute>
            }
          />
          {/* ADMIN layout sin sidebar */}
          {/* ADMIN layout con sidebar */}
          {/* <Route
            path="/mis-empresas/:id/dashboard"
            element={
              <PrivateRoute>
                <AdminOnlyLayout>
                  <DashboardEmpresa />
                </AdminOnlyLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/mis-empresas/clientes"
            element={
              <PrivateRoute>
                <AdminOnlyLayout>
                  <ClientesList />
                </AdminOnlyLayout>
              </PrivateRoute>
            }
          /> */}

          <Route
            path="/mis-empresas/:id"
            element={
              <PrivateRoute>
                <DashboardEmpresaLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardEmpresa />} />
            <Route path="dashboard" element={<DashboardEmpresa />} />
            <Route path="clientes" element={<ClientesList />} />
            <Route path="clientes/crear-cliente" element={<CreateClienteForm />} />
            <Route path="clientes/editar-cliente/:clienteId" element={<EditClienteForm />} />

            <Route path="mascotas" element={<MascotasList />} />
            <Route path="mascotas/crear-mascota" element={<CreateMascotaForm />} />
            <Route path="mascotas/editar-mascota/:mascotaId" element={<EditMascotaForm />} />

            <Route path="mascotas/editar-mascota/:mascotaId/crear-consulta" element={<CreateConsultaForm />} />


            <Route path="consulta" element={<CreateConsultaForm />} />

          </Route>
          {/* ADMIN layout con sidebar */}





          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
