import Home from "./pages/Home";
import { useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Landing from "./pages/Landing";
import StudentDetails from "./pages/StudentDetails";
import { getAdminToken } from "./services/adminService";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => setPath(window.location.pathname);

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  if (path.startsWith("/admin")) {
    const isLogin = path === "/admin/login";
    const token = getAdminToken();

    if (!token && !isLogin) {
      window.history.replaceState({}, "", "/admin/login");
      return <AdminLogin />;
    }

    if (token && isLogin) {
      window.history.replaceState({}, "", "/admin/dashboard");
      return <AdminDashboard />;
    }

    if (path === "/admin/dashboard") {
      return <AdminDashboard />;
    }

    const studentMatch = path.match(/^\/admin\/students\/([^/]+)$/);
    if (studentMatch) {
      return <StudentDetails id={studentMatch[1]} />;
    }

    window.history.replaceState({}, "", token ? "/admin/dashboard" : "/admin/login");
    return token ? <AdminDashboard /> : <AdminLogin />;
  }

  if (path === "/student") {
    return <Home />;
  }

  if (path !== "/") {
    window.history.replaceState({}, "", "/");
  }

  return <Landing />;
}

export default App;
