import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import {
  CustomerSnapshot,
  InvoiceDiscount,
  InvoiceItemSnapshot,
  InvoiceTotals,
  PaymentSnapshot,
  SellerSnapshot,
  TaxSnapshot,
  TemplateJson,
} from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  logo: {
    height: 40,
    maxHeight: 50,
    objectFit: "contain",
  },
  section: {
    marginBottom: 14,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  sellerTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  textSm: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
  },
  card: {
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  grid3: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 14,
  },
  gridCol: {
    flex: 1,
  },
  table: {
    width: "100%",
    marginTop: 8,
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#334155",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8.5,
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colRate: { flex: 2, textAlign: "right" },
  colTax: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 2, textAlign: "right" },

  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 14,
  },
  summaryBox: {
    width: 220,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    fontSize: 8.5,
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1.5,
    borderTopColor: "#0f172a",
    marginTop: 4,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  paymentBox: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 8,
  },
});

export interface InvoicePdfDocumentProps {
  template: TemplateJson;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  seller: SellerSnapshot;
  customer: CustomerSnapshot;
  items: InvoiceItemSnapshot[];
  discount: InvoiceDiscount;
  tax: TaxSnapshot;
  totals: InvoiceTotals;
  notes?: string;
  terms?: string;
  payment?: PaymentSnapshot;
}

export function InvoicePdfDocument({
  invoiceNumber,
  invoiceDate,
  dueDate,
  seller,
  customer,
  items,
  discount,
  tax,
  totals,
  notes,
  terms,
  payment,
}: InvoicePdfDocumentProps) {
  const formatVal = (num: number) => `INR ${num.toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>TAX INVOICE</Text>
            <Text style={styles.invoiceNumber}>Invoice #: {invoiceNumber}</Text>
          </View>
          {seller.logoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={seller.logoUrl} style={styles.logo} />
          ) : null}
        </View>

        {/* Business Info */}
        <View style={styles.section}>
          <Text style={styles.sellerTitle}>{seller.name}</Text>
          {seller.address ? <Text style={styles.textSm}>{seller.address}</Text> : null}
          {seller.city || seller.state || seller.postalCode ? (
            <Text style={styles.textSm}>
              {[seller.city, seller.state, seller.postalCode].filter(Boolean).join(", ")}
              {seller.stateCode ? ` (State Code: ${seller.stateCode})` : ""}
            </Text>
          ) : null}
          {seller.gstin ? (
            <Text style={[styles.textSm, styles.bold]}>GSTIN: {seller.gstin}</Text>
          ) : null}
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BILLED TO</Text>
          <Text style={[styles.textSm, styles.bold, { color: "#0f172a" }]}>
            {customer.name || "N/A"}
          </Text>
          {customer.address ? <Text style={styles.textSm}>{customer.address}</Text> : null}
          {customer.city || customer.state || customer.postalCode ? (
            <Text style={styles.textSm}>
              {[customer.city, customer.state, customer.postalCode].filter(Boolean).join(", ")}
              {customer.stateCode ? ` (State Code: ${customer.stateCode})` : ""}
            </Text>
          ) : null}
          {customer.gstin ? (
            <Text style={[styles.textSm, styles.bold]}>GSTIN: {customer.gstin}</Text>
          ) : null}
        </View>

        {/* Invoice Metadata */}
        <View style={styles.grid3}>
          <View style={styles.gridCol}>
            <Text style={styles.cardTitle}>INVOICE DATE</Text>
            <Text style={styles.bold}>{invoiceDate}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.cardTitle}>DUE DATE</Text>
            <Text style={styles.bold}>{dueDate}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.cardTitle}>TAX TYPE</Text>
            <Text style={styles.bold}>
              {tax.isSameState ? "CGST + SGST" : "IGST"}
            </Text>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>DESCRIPTION</Text>
            <Text style={styles.colQty}>QTY</Text>
            <Text style={styles.colRate}>RATE</Text>
            <Text style={styles.colTax}>TAX</Text>
            <Text style={styles.colTotal}>AMOUNT</Text>
          </View>
          {items.map((item, idx) => (
            <View key={item.id || idx} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colRate}>{formatVal(item.unitPrice)}</Text>
              <Text style={styles.colTax}>{item.taxRate}%</Text>
              <Text style={styles.colTotal}>{formatVal(item.lineTotal)}</Text>
            </View>
          ))}
        </View>

        {/* Totals Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.textSm}>Subtotal:</Text>
              <Text style={styles.bold}>{formatVal(totals.subtotal)}</Text>
            </View>
            {totals.discountAmount > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.textSm}>
                  Discount {discount.type === "PERCENTAGE" ? `(${discount.value}%)` : ""}:
                </Text>
                <Text style={styles.bold}>-{formatVal(totals.discountAmount)}</Text>
              </View>
            ) : null}
            <View style={styles.summaryRow}>
              <Text style={styles.textSm}>Taxable Amount:</Text>
              <Text style={styles.bold}>{formatVal(totals.taxableAmount)}</Text>
            </View>
            {tax.isSameState ? (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.textSm}>CGST Total:</Text>
                  <Text style={styles.bold}>{formatVal(totals.cgstAmount)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.textSm}>SGST Total:</Text>
                  <Text style={styles.bold}>{formatVal(totals.sgstAmount)}</Text>
                </View>
              </>
            ) : (
              <View style={styles.summaryRow}>
                <Text style={styles.textSm}>IGST Total:</Text>
                <Text style={styles.bold}>{formatVal(totals.igstAmount)}</Text>
              </View>
            )}
            <View style={styles.summaryTotalRow}>
              <Text>Grand Total:</Text>
              <Text>{formatVal(totals.grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        {payment?.bankName || payment?.accountNumber || payment?.upiId ? (
          <View style={styles.paymentBox}>
            <Text style={styles.cardTitle}>BANK / PAYMENT DETAILS</Text>
            {payment.bankName ? (
              <Text style={styles.textSm}>Bank: {payment.bankName}</Text>
            ) : null}
            {payment.accountNumber ? (
              <Text style={styles.textSm}>A/c No: {payment.accountNumber}</Text>
            ) : null}
            {payment.ifsc ? (
              <Text style={styles.textSm}>IFSC: {payment.ifsc}</Text>
            ) : null}
            {payment.upiId ? (
              <Text style={[styles.textSm, styles.bold]}>UPI ID: {payment.upiId}</Text>
            ) : null}
          </View>
        ) : null}

        {/* Notes & Terms */}
        {notes || terms ? (
          <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
            {notes ? (
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>NOTES</Text>
                <Text style={styles.textSm}>{notes}</Text>
              </View>
            ) : null}
            {terms ? (
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>TERMS & CONDITIONS</Text>
                <Text style={styles.textSm}>{terms}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Footer */}
        <Text style={styles.footer}>
          This is a computer generated tax invoice.
        </Text>
      </Page>
    </Document>
  );
}
