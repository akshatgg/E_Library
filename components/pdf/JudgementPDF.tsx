import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 40,
    paddingVertical: 50,
    fontSize: 12,
    fontFamily: "Times-Roman",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.6,
    textAlign: "justify",
  },
});

interface Props {
  title: string;
  caseNumber: string;
  date: string;
  content: string;
}

const JudgmentPDF: React.FC<Props> = ({ title, caseNumber, date, content }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Case Number:</Text>
        <Text style={styles.content}>{caseNumber || "N/A"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date of Judgment:</Text>
        <Text style={styles.content}>{date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Judgment:</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
    </Page>
  </Document>
);

export default JudgmentPDF;
