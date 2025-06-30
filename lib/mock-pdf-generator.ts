// Simple utility to create minimal valid PDFs for testing
export function createMinimalPdf(content: string): Blob {
  // This is a very basic PDF structure that should be valid
  // In a real app, you would use a proper PDF generation library
  const pdfContent = `%PDF-1.7
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 68 >>
stream
BT
/F1 12 Tf
50 750 Td
(${content.replace(/[()\\]/g, "\\$&")}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000059 00000 n
0000000118 00000 n
0000000231 00000 n
0000000349 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
417
%%EOF`

  return new Blob([pdfContent], { type: "application/pdf" })
}
