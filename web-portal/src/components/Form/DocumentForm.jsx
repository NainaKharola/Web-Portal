import FileInput from "../Inputs/FileInput";
import TextInput from "../Inputs/TextInput";

function DocumentForm({ form, errors, onChange }) {
  return (
    <section className="form-section">
      <h2>Upload Documents</h2>
      <div className="form-grid">
        <FileInput
          label="Resume"
          name="resume"
          onChange={onChange}
          error={errors.resume}
          accept="application/pdf"
          required
        />
        <FileInput
          label="Result"
          name="result"
          onChange={onChange}
          error={errors.result}
          accept="application/pdf,image/jpeg,image/jpg"
          required
        />
        <FileInput
          label="Passport Size Photograph"
          name="photo"
          onChange={onChange}
          error={errors.photo}
          accept="image/png,image/jpeg,image/jpg"
          required
        />
        <TextInput
          label="College Identity Card Number"
          name="collegeId"
          value={form.collegeId}
          onChange={onChange}
          error={errors.collegeId}
          required
        />
      </div>
    </section>
  );
}

export default DocumentForm;
