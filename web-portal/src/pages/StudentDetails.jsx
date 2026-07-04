import { useEffect, useState } from "react";
import AdminReviewForm from "../components/Admin/AdminReviewForm";
import OfferLetterPreview from "../components/Admin/OfferLetterPreview";
import OfferLetterUpload from "../components/Admin/OfferLetterUpload";
import StatusBadge from "../components/Admin/StatusBadge";
import { fetchAdminStudent } from "../services/adminService";
import "../styles/admin.css";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN");
}

function DetailGrid({ title, rows }) {
  return (
    <section className="details-section">
      <h2>{title}</h2>
      <div className="details-grid">
        {rows.map(([label, value]) => (
          <div className="detail-item" key={label}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function DocumentButton({ label, file }) {
  if (!file?.url) return null;

  return (
    <a className="secondary-button admin-link-button" href={file.url} target="_blank" rel="noreferrer">
      View {label}
    </a>
  );
}

function StudentDetails({ id }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadStudent() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchAdminStudent(id);
        if (!ignore) setStudent(response.student);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadStudent();

    return () => {
      ignore = true;
    };
  }, [id]);

  const goBack = () => {
    window.history.pushState({}, "", "/admin/dashboard");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (loading) {
    return (
      <main className="admin-shell">
        <div className="admin-loading">Loading student details...</div>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="admin-shell">
        <button className="secondary-button" type="button" onClick={goBack}>
          Back
        </button>
        <p className="admin-error">{error || "Student not found."}</p>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="portal-eyebrow">Student Details</p>
          <h1>{student.name}</h1>
          <div className="student-status-line">
            <StatusBadge value={student.status} />
            <span>{student.email}</span>
          </div>
        </div>
        <button className="secondary-button" type="button" onClick={goBack}>
          Back to Dashboard
        </button>
      </header>

      <DetailGrid
        title="Personal Details"
        rows={[
          ["Name", student.name],
          ["Date of Birth", student.dob],
          ["Gender", student.gender],
          ["Phone Number", student.phone],
          ["Email", student.email],
        ]}
      />

      <DetailGrid
        title="Academic Details"
        rows={[
          ["College / University", student.collegeName],
          ["College State", student.collegeState],
          ["College City", student.location],
          ["Branch", student.branch],
          ["Year", student.year],
          ["CGPA", student.cgpa],
          ["Course", student.course],
          ["College ID", student.collegeId],
        ]}
      />

      <DetailGrid
        title="Address Details"
        rows={[
          ["Current Address", student.currentAddress],
          ["Permanent Address", student.permanentAddress],
        ]}
      />

      <DetailGrid
        title="Parent / Guardian Details"
        rows={[
          ["Father / Guardian Name", student.fatherName],
          ["Father / Guardian Phone", student.fatherPhone],
          ["Father / Guardian Occupation", student.fatherOccupation],
        ]}
      />

      <DetailGrid
        title="Internship Details"
        rows={[
          ["Internship Duration", student.internshipDuration],
          ["Joining Date", student.internshipJoiningDate],
          ["Permission Letter Number", student.permissionLetterNumber],
          ["Permission Letter Date", student.permissionLetterDate],
        ]}
      />

      <section className="details-section">
        <h2>Uploaded Documents</h2>
        <div className="document-actions">
          <DocumentButton label="Student Photo" file={student.photo} />
          <DocumentButton label="Resume" file={student.resume} />
          <DocumentButton label="Result" file={student.result} />
          <DocumentButton label="Permission Letter" file={student.permissionLetter} />
        </div>
      </section>

      {student.status === "Approved" && (
        <DetailGrid
          title="Approval and Offer Letter Details"
          rows={[
            ["Status", student.status],
            ["Approved Date", formatDate(student.approvedDate)],
            ["Reviewed By", student.reviewedBy],
            ["Reviewed At", formatDate(student.reviewedAt)],
            ["Offer Letter Uploaded Date", formatDate(student.offerLetterUploadedDate)],
            ["Offer Letter Sent Date", formatDate(student.offerLetterSentDate)],
            ["Offer Letter Status", student.offerLetterStatus],
            ["Student Email Address", student.email],
          ]}
        />
      )}

      <OfferLetterPreview student={student} />
      <AdminReviewForm student={student} onUpdated={setStudent} />
      <OfferLetterUpload student={student} onUploaded={setStudent} />
    </main>
  );
}

export default StudentDetails;
