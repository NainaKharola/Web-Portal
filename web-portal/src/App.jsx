import Home from "./pages/Home";
import { useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import Certificates from "./pages/Certificates";
import GyapanPage from "./pages/GyapanPage";
import GyapanPreview from "./pages/GyapanPreview";
import GyapanEditor from "./pages/GyapanEditor";
import AdminLogin from "./pages/AdminLogin";
import Landing from "./pages/Landing";
import OfferLetterEditor from "./pages/OfferLetterEditor";
import OfferLetterPreview from "./pages/OfferLetterPreview";
import StudentDetails from "./pages/StudentDetails";
import StudentDashboard from "./pages/StudentDashboard";
import StudentLogin from "./pages/StudentLogin";
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

    if (path === "/admin/certificates") {
      return <Certificates />;
    }

    if (path === "/admin/gyapan") return <GyapanPage />;
    const gyapanEditMatch = path.match(/^\/admin\/gyapan\/([^/]+)\/edit$/);
    if (gyapanEditMatch) return <GyapanEditor gyapanId={gyapanEditMatch[1]} />;
    const gyapanMatch = path.match(/^\/admin\/gyapan\/([^/]+)$/);
    if (gyapanMatch) return <GyapanPreview gyapanId={gyapanMatch[1]} />;

    const offerLetterEditMatch = path.match(/^\/admin\/students\/([^/]+)\/offer-letter\/edit$/);
    if (offerLetterEditMatch) {
      return <OfferLetterEditor studentId={offerLetterEditMatch[1]} />;
    }

    const offerLetterMatch = path.match(/^\/admin\/students\/([^/]+)\/offer-letter$/);
    if (offerLetterMatch) {
      return <OfferLetterPreview studentId={offerLetterMatch[1]} />;
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

  if (path === "/student/login") {
    return <StudentLogin />;
  }

  if (path === "/student/dashboard") {
    return <StudentDashboard />;
  }

  if (path !== "/") {
    window.history.replaceState({}, "", "/");
  }

  return <Landing />;
}

export default App;
