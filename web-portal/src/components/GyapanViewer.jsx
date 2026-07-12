function GyapanViewer({ html, pdfUrl }) {
  if (pdfUrl) return <iframe className="offer-letter-viewer" title="Gyapan PDF" src={pdfUrl} />;
  return <iframe className="offer-letter-viewer" title="Gyapan preview" srcDoc={html || "<p>Preview unavailable.</p>"} />;
}
export default GyapanViewer;
