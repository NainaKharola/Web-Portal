const cards = [
  ["Total Students", "totalStudents"],
  ["Pending Applications", "pendingApplications"],
  ["Approved Students", "approvedStudents"],
  ["Rejected Students", "rejectedStudents"],
  ["Offer Letters Sent", "offerLettersSent"],
];

function DashboardCards({ summary }) {
  return (
    <section className="admin-summary-grid">
      {cards.map(([label, key]) => (
        <div className="admin-summary-card" key={key}>
          <span>{label}</span>
          <strong>{summary?.[key] ?? 0}</strong>
        </div>
      ))}
    </section>
  );
}

export default DashboardCards;
