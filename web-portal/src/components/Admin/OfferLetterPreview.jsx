function OfferLetterPreview({ student }) {
  if (!student.offerLetterUrl) return null;

  return (
    <a
      className="admin-secondary-btn admin-link-button"
      href={student.offerLetterUrl}
      target="_blank"
      rel="noreferrer"
    >
      View Offer Letter
    </a>
  );
}

export default OfferLetterPreview;
