function OfferLetterForm({ form, saving, onChange, onSubmit }) {
  const updateField = (key, value) => {
    onChange({ ...form, [key]: value });
  };

  return (
    <form className="admin-review-form" onSubmit={onSubmit}>
      <h2>Edit Offer Letter</h2>

      <div className="admin-control-grid">
        <label className="admin-field">
          <span>Student Name</span>
          <input
            value={form.studentName || ""}
            onChange={(event) => updateField("studentName", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>College Name</span>
          <input
            value={form.collegeName || ""}
            onChange={(event) => updateField("collegeName", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Course</span>
          <input
            value={form.course || ""}
            onChange={(event) => updateField("course", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Year</span>
          <input
            value={form.year || ""}
            onChange={(event) => updateField("year", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Branch</span>
          <input
            value={form.branch || ""}
            onChange={(event) => updateField("branch", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Internship Duration</span>
          <input
            value={form.internshipDuration || ""}
            onChange={(event) => updateField("internshipDuration", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Issue Date</span>
          <input
            type="date"
            value={form.issueDate || ""}
            onChange={(event) => updateField("issueDate", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Subject</span>
          <input
            value={form.subject || ""}
            onChange={(event) => updateField("subject", event.target.value)}
          />
        </label>
      </div>

      <label className="admin-field admin-field--wide">
        <span>Letter Body</span>
        <textarea
          rows="8"
          value={form.letterBody || ""}
          onChange={(event) => updateField("letterBody", event.target.value)}
        />
      </label>

      <label className="admin-field admin-field--wide">
        <span>Additional Remarks</span>
        <textarea
          rows="4"
          value={form.additionalRemarks || ""}
          onChange={(event) => updateField("additionalRemarks", event.target.value)}
        />
      </label>

      <button className="primary-button" disabled={saving} type="submit">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default OfferLetterForm;
