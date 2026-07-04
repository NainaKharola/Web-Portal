import { branches } from "../../data/branches";
import { courses } from "../../data/courses";
import { indianStatesAndUnionTerritories } from "../../data/states";
import { years } from "../../data/years";
import SearchableDropdown from "../Inputs/SearchableDropdown";
import SelectInput from "../Inputs/SelectInput";
import TextInput from "../Inputs/TextInput";

function AcademicSection({ form, errors, onChange }) {
  return (
    <section className="form-section">
      <h2>Academic Details</h2>
      <div className="form-grid">
        <SelectInput
          label="Course"
          name="course"
          value={form.course}
          onChange={onChange}
          options={courses}
          error={errors.course}
          required
        />
        <SelectInput
          label="Branch / Specialisation"
          name="branch"
          value={form.branch}
          onChange={onChange}
          options={branches}
          error={errors.branch}
          required
        />
        <SelectInput
          label="Current Year"
          name="currentYear"
          value={form.currentYear}
          onChange={onChange}
          options={years}
          error={errors.currentYear}
          required
        />
        <TextInput
          label="CGPA"
          name="cgpa"
          type="number"
          value={form.cgpa}
          onChange={onChange}
          error={errors.cgpa}
          required
        />
        <TextInput
          label="College Name"
          name="collegeName"
          value={form.collegeName}
          onChange={onChange}
          error={errors.collegeName}
          required
        />
        <SearchableDropdown
          label="College State"
          name="collegeState"
          value={form.collegeState}
          onChange={onChange}
          options={indianStatesAndUnionTerritories}
          error={errors.collegeState}
          required
        />
        <TextInput
          label="College Location"
          name="collegeLocation"
          value={form.collegeLocation}
          onChange={onChange}
          error={errors.collegeLocation}
          required
        />
      </div>
    </section>
  );
}

export default AcademicSection;
