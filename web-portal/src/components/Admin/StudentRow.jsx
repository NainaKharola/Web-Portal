import StatusBadge from "./StatusBadge";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN");
}

function StudentRow({ student, onView }) {
  return (
    <tr>
      <td>{student.name}</td>
      <td>{student.collegeName}</td>
      <td>{student.branch}</td>
      <td>{student.year}</td>
      <td>{student.cgpa}</td>
      <td>{formatDate(student.submittedAt)}</td>
      <td>
        <StatusBadge value={student.status} />
      </td>
      <td>
        <StatusBadge value={student.offerLetterStatus || "Not Sent"} />
      </td>
      <td>{formatDate(student.approvedDate)}</td>
      <td>
        <button className="text-button" type="button" onClick={onView}>
          View Details
        </button>
      </td>
    </tr>
  );
}

export default StudentRow;
