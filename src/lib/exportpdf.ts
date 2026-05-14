import jsPDF from "jspdf";

export function exportTextAsPdf(title: string, body: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxW = pageW - margin * 2;

  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text(title || "Untitled", margin, margin + 6);

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(body, maxW);
  let y = margin + 40;
  for (const line of lines) {
    if (y > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 18;
  }

  const safe = (title || "replyforge").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
  doc.save(`${safe || "replyforge"}.pdf`);
}