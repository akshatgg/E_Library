// components/pdf/CaseTablePDF.tsx
"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CaseData } from "../dashboards/case-laws-dashboard";
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  heading: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  rowContainer: {
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  rowLine1: {
    flexDirection: "row",
    marginBottom: 4,
  },
  rowLine2: {
    flexDirection: "row",
    gap: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 4,
  },
  text: {
    flexShrink: 1,
  },
});

interface Props {
  cases: CaseData[];
}

const CaseTablePDF: React.FC<Props> = ({ cases }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>Case List</Text>

      {cases.map((c) => (
        <View key={c.id} style={styles.rowContainer}>
          {/* First Line */}
          <View style={styles.rowLine1}>
            <Text style={styles.label}>Case No:</Text>
            <Text style={styles.text}>{c.caseNumber}</Text>
          </View>
          <View style={styles.rowLine1}>
            <Text style={styles.label}>Title:</Text>
            <Text style={styles.text}>{c.title}</Text>
          </View>

          {/* Second Line with more spacing */}
          <View style={styles.rowLine2}>
            <Text>
              <Text style={styles.label}>Court:</Text>
              <Text>{c.court}</Text>
            </Text>
            <Text>
              <Text style={styles.label}>Bench:</Text>
              <Text>{c.bench}</Text>
            </Text>
            <Text>
              <Text style={styles.label}>Date:</Text>
              <Text>{new Date(c.date).toLocaleDateString("en-IN")}</Text>
            </Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default CaseTablePDF;
