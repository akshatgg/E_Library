// components/pdf/CaseTablePDF.tsx
"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { CaseData } from "../dashboards/case-laws-dashboard";

// Register Helvetica font family
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNwPYtWqZPAA.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNwJYtWqZPAA.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    marginBottom: 15,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#666",
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 6,
    minHeight: 32,
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    color: "#111827",
    fontSize: 9,
  },
  tableCell: {
    fontSize: 8.5,
    color: "#374151",
  },
  caseNumber: {
    width: "12%",
    paddingHorizontal: 5,
  },
  title: {
    width: "30%",
    paddingHorizontal: 5,
  },
  court: {
    width: "18%",
    paddingHorizontal: 5,
  },
  bench: {
    width: "15%",
    paddingHorizontal: 5,
  },
  date: {
    width: "10%",
    paddingHorizontal: 5,
  },
  category: {
    width: "15%",
    paddingHorizontal: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#6B7280",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: "#6B7280",
  },
});

interface Props {
  cases: CaseData[];
}

const CaseTablePDF: React.FC<Props> = ({ cases }) => {
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Case Law Database Report</Text>
          <Text style={styles.subtitle}>Comprehensive Legal Case Summary</Text>
          <View style={styles.meta}>
            <Text>Generated: {currentDate}</Text>
            <Text>Total Cases: {cases.length}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.caseNumber]}>Case No.</Text>
            <Text style={[styles.tableHeaderCell, styles.title]}>Case Title</Text>
            <Text style={[styles.tableHeaderCell, styles.court]}>Court</Text>
            <Text style={[styles.tableHeaderCell, styles.bench]}>Bench</Text>
            <Text style={[styles.tableHeaderCell, styles.date]}>Date</Text>
            <Text style={[styles.tableHeaderCell, styles.category]}>Category</Text>
          </View>

          {/* Table Rows */}
          {cases.map((c, index) => (
            <View key={c.id} style={[
              styles.tableRow, 
              index % 2 === 1 ? styles.tableRowEven : {}
            ]}>
              <Text style={[styles.tableCell, styles.caseNumber]}>{c.caseNumber}</Text>
              <Text style={[styles.tableCell, styles.title]}>{c.title}</Text>
              <Text style={[styles.tableCell, styles.court]}>{c.court}</Text>
              <Text style={[styles.tableCell, styles.bench]}>{c.bench}</Text>
              <Text style={[styles.tableCell, styles.date]}>
                {new Date(c.date).toLocaleDateString('en-IN')}
              </Text>
              <Text style={[styles.tableCell, styles.category]}>{c.category}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} Legal Case Law Database - Confidential and Proprietary
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

export default CaseTablePDF;
