import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AdminAuthProvider } from "./auth/AdminAuth";
import ProtectedRoute, { PublicAdminRoute } from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Certificates from "./pages/Certificates";
import GyapanEditor from "./pages/GyapanEditor";
import GyapanPage from "./pages/GyapanPage";
import GyapanPreview from "./pages/GyapanPreview";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import OfferLetterEditor from "./pages/OfferLetterEditor";
import OfferLetterPreview from "./pages/OfferLetterPreview";
import StudentDashboard from "./pages/StudentDashboard";
import StudentDetails from "./pages/StudentDetails";
import StudentLogin from "./pages/StudentLogin";
import Success from "./pages/Success";

const protectedPage = (page) => <ProtectedRoute>{page}</ProtectedRoute>;

function StudentDetailsRoute() {
  const { id } = useParams();
  return <StudentDetails id={id} />;
}

function OfferLetterPreviewRoute() {
  const { id } = useParams();
  return <OfferLetterPreview studentId={id} />;
}

function OfferLetterEditorRoute() {
  const { id } = useParams();
  return <OfferLetterEditor studentId={id} />;
}

function GyapanPreviewRoute() {
  const { gyapanId } = useParams();
  return <GyapanPreview gyapanId={gyapanId} />;
}

function GyapanEditorRoute() {
  const { gyapanId } = useParams();
  return <GyapanEditor gyapanId={gyapanId} />;
}

function RegistrationSuccessRoute() {
  const { state } = useLocation();
  return <Success registration={state?.registration} />;
}

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/student" element={<Home />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/success" element={<RegistrationSuccessRoute />} />

          <Route path="/admin" element={<Navigate replace to="/admin/login" />} />
          <Route path="/admin/login" element={<PublicAdminRoute><AdminLogin /></PublicAdminRoute>} />
          <Route path="/admin/dashboard" element={protectedPage(<AdminDashboard />)} />
          <Route path="/admin/students" element={protectedPage(<AdminDashboard />)} />
          <Route path="/admin/students/:id" element={protectedPage(<StudentDetailsRoute />)} />
          <Route path="/admin/students/:id/offer-letter" element={protectedPage(<OfferLetterPreviewRoute />)} />
          <Route path="/admin/students/:id/offer-letter/edit" element={protectedPage(<OfferLetterEditorRoute />)} />
          <Route path="/admin/certificates" element={protectedPage(<Certificates />)} />
          <Route path="/admin/gyapan" element={protectedPage(<GyapanPage />)} />
          <Route path="/admin/gyapan/:gyapanId" element={protectedPage(<GyapanPreviewRoute />)} />
          <Route path="/admin/gyapan/:gyapanId/edit" element={protectedPage(<GyapanEditorRoute />)} />
          <Route path="/admin/*" element={protectedPage(<NotFound />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
