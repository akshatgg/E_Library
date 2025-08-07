import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register fonts for more professional typography
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf' }, // fallback to a widely available font
  ]
});

// Define styles
const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 50,
    paddingVertical: 40,
    fontSize: 10.5,
    fontFamily: "Times-Roman",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 8,
    borderBottom: "1px solid #333",
  },
  headerText: {
    fontSize: 9,
    color: "#444",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
  },
  metaSection: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottom: "1px solid #ddd",
    paddingBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
    textTransform: "uppercase",
  },
  caseNumber: {
    fontSize: 11,
    marginBottom: 6,
    fontFamily: "Times-Bold",
  },
  metaContent: {
    fontSize: 10,
  },
  content: {
    fontSize: 10.5,
    lineHeight: 2,
    textAlign: "justify",
    marginBottom: 12,
    fontFamily: "Times-Roman",
  },
  paragraph: {
    marginBottom: 12,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#555",
    borderTop: "0.5px solid #ddd",
    paddingTop: 5,
  },
  pageNumber: {
    position: "absolute",
    bottom: 25,
    right: 50,
    fontSize: 8,
    color: "#555",
  },
  subheader: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    marginTop: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  documentInfoBox: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    marginVertical: 15,
  },
  indent: {
    marginLeft: 20,
  },
});

interface Props {
  title: string;
  caseNumber: string;
  date: string;
  content: string;
}

// Format content for better PDF display with professional layout
const formatContentForPDF = (text: string): string[] => {
  // Remove excess whitespace
  let formattedText = text.replace(/\s+/g, ' ').trim();
  
  // Add paragraph breaks for sentences
  formattedText = formattedText.replace(/\.\s+([A-Z])/g, '.\n\n$1');
  
  // Fix common spacing issues
  formattedText = formattedText.replace(/(\d+)\s*\.\s*(\d+)/g, '$1.$2'); // Fix decimal numbers
  formattedText = formattedText.replace(/\s+,/g, ','); // Fix comma spacing
  formattedText = formattedText.replace(/\s+\./g, '.'); // Fix period spacing
  formattedText = formattedText.replace(/\s*:\s*/g, ': '); // Fix colon spacing
  
  // Special handling for section breaks and numbered points
  formattedText = formattedText.replace(/(\d+)\.(\s+)([A-Z])/g, '\n\n$1.$2$3');
  
  // Split into paragraphs
  let paragraphs = formattedText.split(/\n{2,}/);
  
  // Filter out empty paragraphs
  return paragraphs.filter(p => p.trim().length > 0);
};

const JudgmentPDF: React.FC<Props> = ({ title, caseNumber, date, content }) => {
  const generationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const paragraphs = formatContentForPDF(content);
  
  // Extract possible sections from the title
  const courtMatch = title.match(/Supreme Court|High Court|ITAT|Tribunal/i);
  const courtType = courtMatch ? courtMatch[0] : "Court";
  
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View fixed style={styles.header}>
          <Text style={styles.headerText}>E-Library Professional Legal Solutions</Text>
          <Text style={styles.headerText}>Generated: {generationDate}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.documentInfoBox}>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Case Number</Text>
              <Text style={styles.caseNumber}>{caseNumber || "N/A"}</Text>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Date of Judgment</Text>
              <Text style={styles.metaContent}>{date}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>Citation Information</Text>
          <Text style={styles.metaContent}>{title} [{date.split(',')[1]?.trim() || new Date().getFullYear()}]</Text>
        </View>
        
        <Text style={styles.subheader}>JUDGMENT</Text>
        
        <View style={styles.section}>
          {paragraphs.map((paragraph, i) => (
            <Text key={i} style={styles.content}>
              {/* Detect if this is a numbered paragraph and indent accordingly */}
              {/^\d+\./.test(paragraph) ? paragraph : `    ${paragraph}`}
            </Text>
          ))}
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.footer}>
          E-Library Professional Legal Solutions • All Rights Reserved • This document is for informational purposes only
        </Text>
        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
          fixed 
        />
      </Page>
    </Document>
  );
};

export default JudgmentPDF;
