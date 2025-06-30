// This function generates a simple PDF for offline use
export function generateOfflinePdf(): Blob {
  // This is a minimal valid PDF structure with some text content
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
<< /Length 178 >>
stream
BT
/F1 24 Tf
50 750 Td
(You are offline) Tj
/F1 12 Tf
0 -50 Td
(This document is not available offline.) Tj
0 -20 Td
(Please connect to the internet to view it.) Tj
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
0000000241 00000 n
0000000471 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
539
%%EOF`

  return new Blob([pdfContent], { type: "application/pdf" })
}
