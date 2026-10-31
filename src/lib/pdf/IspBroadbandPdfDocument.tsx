/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { IspInvoiceData } from "@/types/isp";

const ACCENT_COLOR = "#0284c7"; // Clean Telecom Sky / Blue
const ACCENT_DARK = "#0f172a"; // Deep Slate
const TEXT_MUTED = "#64748b"; // Muted Slate
const BORDER_COLOR = "#e2e8f0"; // Subtle border
const BG_LIGHT = "#f8fafc"; // Very soft background

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 32,
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
    lineHeight: 1.35,
  },
  // Top Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: ACCENT_COLOR,
    marginBottom: 12,
  },
  companyCol: {
    maxWidth: "60%",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: 5,
    backgroundColor: ACCENT_DARK,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoText: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
  },
  companyLogoImage: {
    height: 28,
    maxWidth: 90,
    objectFit: "contain",
    marginRight: 8,
  },
  brandName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    letterSpacing: -0.3,
  },
  legalName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    marginBottom: 2,
    marginTop: 10,
  },
  companyAddress: {
    fontSize: 7.5,
    color: TEXT_MUTED,
    marginBottom: 2,
    lineHeight: 1.25,
  },
  companyTaxInfo: {
    fontSize: 7.5,
    color: "#334155",
    marginTop: 2,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  titleCol: {
    alignItems: "flex-end",
    maxWidth: "38%",
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    letterSpacing: 0.5,
  },
  invoiceSubtitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_COLOR,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 10,
  },
  supportContacts: {
    marginTop: 5,
    alignItems: "flex-end",
  },
  supportText: {
    fontSize: 7.5,
    color: TEXT_MUTED,
  },

  // Metadata Grid & Customer Box (Two Columns)
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  billToCard: {
    flex: 1.15,
    backgroundColor: BG_LIGHT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 8,
  },
  invoiceMetaCard: {
    flex: 0.85,
    backgroundColor: BG_LIGHT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 8,
  },
  sectionHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_COLOR,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 2,
  },
  customerName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    marginBottom: 3,
  },
  customerIdsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  idTag: {
    fontSize: 7.5,
    color: "#334155",
  },
  addressBlock: {
    marginTop: 2,
  },
  addressLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: TEXT_MUTED,
    textTransform: "uppercase",
    marginTop: 2,
  },
  addressText: {
    fontSize: 7.5,
    color: "#334155",
    lineHeight: 1.25,
  },

  // Meta Rows
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 1.5,
  },
  metaLabel: {
    fontSize: 7.5,
    color: TEXT_MUTED,
  },
  metaValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    textAlign: "right",
  },
  cycleHighlight: {
    color: ACCENT_COLOR,
    fontFamily: "Helvetica-Bold",
  },

  // Table
  tableContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  thText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  colDesc: { flex: 4, paddingRight: 6 },
  colSac: { flex: 1.3, textAlign: "center" },
  colPeriod: { flex: 1.6, textAlign: "center" },
  colQty: { flex: 0.8, textAlign: "center" },
  colAmount: { flex: 1.8, textAlign: "right" },

  itemTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
  },
  itemSub: {
    fontSize: 7,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  cellText: {
    fontSize: 8,
    color: "#334155",
  },
  cellTextBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    textAlign: "right",
  },

  // Lower Section: Payment + Tax breakdown + QR Code
  lowerContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  leftPaymentCol: {
    flex: 1.1,
    backgroundColor: BG_LIGHT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 8,
  },
  statusBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  statusPaid: { backgroundColor: "#dcfce7", color: "#15803d" },
  statusUnpaid: { backgroundColor: "#fee2e2", color: "#b91c1c" },
  statusPartiallyPaid: { backgroundColor: "#fef3c7", color: "#b45309" },
  statusText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 1.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  payableHighlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginTop: 3,
    borderTopWidth: 1,
    borderTopColor: ACCENT_DARK,
  },
  payableHighlightLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
  },
  payableHighlightValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_COLOR,
  },

  bankDetailsBox: {
    marginTop: 6,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#cbd5e1",
  },
  bankText: {
    fontSize: 7,
    color: "#334155",
    marginBottom: 1,
  },

  // Right Tax + QR Code Column
  rightTaxCol: {
    flex: 1.1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  taxCard: {
    backgroundColor: BG_LIGHT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 8,
    marginBottom: 8,
  },
  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 1.5,
  },
  taxTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: ACCENT_DARK,
    marginTop: 3,
  },
  grandTotalLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
  },
  grandTotalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
  },

  // Dynamic QR Code Box
  qrContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qrImage: {
    width: 60,
    height: 60,
  },
  qrInfo: {
    flex: 1,
  },
  qrHeading: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    marginBottom: 2,
  },
  qrCaption: {
    fontSize: 6.5,
    color: TEXT_MUTED,
    lineHeight: 1.25,
  },
  qrUrlText: {
    fontSize: 6,
    color: ACCENT_COLOR,
    marginTop: 2,
  },

  // Words Banner
  wordsBanner: {
    backgroundColor: "#f8fafc",
    borderWidth: 0.5,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  wordsLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: TEXT_MUTED,
    textTransform: "uppercase",
  },
  wordsText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    marginTop: 1,
  },

  // Footer & Disclaimer
  footerContainer: {
    marginTop: "auto",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  footerNotesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  termsBlock: {
    flex: 1.4,
  },
  termItem: {
    fontSize: 6.5,
    color: TEXT_MUTED,
    marginBottom: 1.5,
  },
  thankYouText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    marginTop: 3,
  },

  signatoryBlock: {
    flex: 0.8,
    alignItems: "flex-end",
  },
  signatoryTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT_DARK,
    marginBottom: 16,
  },
  signatoryLine: {
    width: 100,
    borderTopWidth: 0.5,
    borderTopColor: "#94a3b8",
    textAlign: "center",
    paddingTop: 2,
    fontSize: 6.5,
    color: TEXT_MUTED,
  },

  bottomDisclaimer: {
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disclaimerText: {
    fontSize: 6.5,
    color: "#94a3b8",
  },
  pageNumber: {
    fontSize: 6.5,
    color: "#94a3b8",
  },
});

export function IspBroadbandPdfDocument({ data }: { data: IspInvoiceData }) {
  const {
    company,
    invoice,
    customer,
    items,
    gst,
    payment,
    qrCode,
    footer,
  } = data;

  const formatCurrency = (val: number) => `INR ${val.toFixed(2)}`;

  // Determine status style
  const statusStyle =
    payment.status === "PAID"
      ? styles.statusPaid
      : payment.status === "PARTIALLY PAID"
        ? styles.statusPartiallyPaid
        : styles.statusUnpaid;

  const hasDifferentInstallationAddress =
    Boolean(customer.installationAddress) &&
    customer.installationAddress.trim().toLowerCase() !==
    customer.billingAddress.trim().toLowerCase();

  return (
    <Document
      title={`Tax Invoice ${invoice.invoiceNumber}`}
      author={company.legalName}
      subject="Broadband Internet Subscription GST Tax Invoice"
      keywords="ISP, Broadband, GST, Invoice, Kerala, Telecom"
    >
      <Page size="A4" style={styles.page}>
        {/* SECTION A: Company Header */}
        <View style={styles.headerContainer}>
          <View style={styles.companyCol}>
            <View style={styles.brandRow}>
              {company.logoUrl ? (
                <Image src={company.logoUrl} style={styles.companyLogoImage} />
              ) : (
                <View style={styles.logoBadge}>
                  <Text style={styles.logoText}>KC</Text>
                </View>
              )}
              <View>
                <Text style={styles.brandName}>{company.brandName}</Text>
                <Text style={styles.legalName}>{company.legalName}</Text>
              </View>
            </View>
            <Text style={styles.companyAddress}>{company.address}</Text>
            {(company.gstin || company.pan) && (
              <Text style={styles.companyTaxInfo}>
                {company.gstin ? (
                  <>
                    <Text style={styles.bold}>GSTIN: </Text>
                    {company.gstin}
                  </>
                ) : null}
                {company.pan ? (
                  <>
                    {company.gstin ? "  |  " : ""}
                    <Text style={styles.bold}>PAN: </Text>
                    {company.pan}
                  </>
                ) : null}
                {company.state ? (
                  <>
                    {(company.gstin || company.pan) ? "  |  " : ""}
                    <Text style={styles.bold}>State: </Text>
                    {company.state}{company.stateCode ? ` (${company.stateCode})` : ""}
                  </>
                ) : null}
              </Text>
            )}
          </View>

          <View style={styles.titleCol}>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <Text style={styles.invoiceSubtitle}>
              Broadband Telecom Service
            </Text>
            <View style={styles.supportContacts}>
              <Text style={styles.supportText}>
                Support: {company.phone}
              </Text>
              <Text style={styles.supportText}>{company.email}</Text>
              {company.website ? (
                <Text style={styles.supportText}>{company.website}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* SECTION B & C: Customer Info & Invoice Meta Grid */}
        <View style={styles.infoGrid}>
          {/* Section C: Customer Info (BILL TO) */}
          <View style={styles.billToCard}>
            <Text style={styles.sectionHeading}>Bill To / Subscriber</Text>
            <Text style={styles.customerName}>{customer.name}</Text>
            <View style={styles.customerIdsRow}>
              <Text style={styles.idTag}>
                <Text style={styles.bold}>Cust ID: </Text>
                {customer.customerId}
              </Text>
              <Text style={styles.idTag}>
                <Text style={styles.bold}>Conn ID: </Text>
                {customer.connectionId}
              </Text>
              <Text style={styles.idTag}>
                <Text style={styles.bold}>Mob: </Text>
                {customer.phone}
              </Text>
            </View>

            <View style={styles.addressBlock}>
              <Text style={styles.addressLabel}>Billing Address:</Text>
              <Text style={styles.addressText}>{customer.billingAddress}</Text>

              {hasDifferentInstallationAddress && (
                <>
                  <Text style={styles.addressLabel}>
                    Service Installation Address:
                  </Text>
                  <Text style={styles.addressText}>
                    {customer.installationAddress}
                  </Text>
                </>
              )}

              <Text style={[styles.idTag, { marginTop: 2 }]}>
                <Text style={styles.bold}>State: </Text>
                {customer.state} ({customer.stateCode})
                {customer.gstin ? `  |  GSTIN: ${customer.gstin}` : ""}
              </Text>
            </View>
          </View>

          {/* Section B: Invoice Metadata */}
          <View style={styles.invoiceMetaCard}>
            <Text style={styles.sectionHeading}>Invoice Information</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice No:</Text>
              <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice Date:</Text>
              <Text style={styles.metaValue}>{invoice.invoiceDate}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Billing Period:</Text>
              <Text style={styles.metaValue}>
                {invoice.billingPeriodStart} - {invoice.billingPeriodEnd}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Billing Cycle:</Text>
              <Text style={[styles.metaValue, styles.cycleHighlight]}>
                {invoice.billingCycle || "15 Days"}
              </Text>
            </View>
            {/* <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Due Date:</Text>
              <Text style={[styles.metaValue, { color: "#b91c1c" }]}>
                {invoice.dueDate}
              </Text>
            </View> */}
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Place of Supply:</Text>
              <Text style={styles.metaValue}>{invoice.placeOfSupply}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Reverse Charge:</Text>
              <Text style={styles.metaValue}>{String(invoice.reverseCharge)}</Text>
            </View>
          </View>
        </View>

        {/* SECTION D: Internet Service Details (Line-item Table) */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, styles.colDesc]}>Description</Text>
            <Text style={[styles.thText, styles.colSac]}>SAC</Text>
            <Text style={[styles.thText, styles.colPeriod]}>
              Billing Period
            </Text>
            <Text style={[styles.thText, styles.colQty]}>Qty</Text>
            <Text style={[styles.thText, styles.colAmount]}>
              Taxable Amount
            </Text>
          </View>

          {items.map((item, idx) => (
            <View key={item.id || idx} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.itemTitle}>{item.description}</Text>
                <Text style={styles.itemSub}>
                  SAC Code: {item.sac || "998422"} | Rate:{" "}
                  {formatCurrency(item.unitPrice)}
                </Text>
              </View>
              <Text style={[styles.cellText, styles.colSac]}>
                {item.sac || "998422"}
              </Text>
              <Text style={[styles.cellText, styles.colPeriod]}>
                {item.billingPeriod || invoice.billingCycle || "15 Days"}
              </Text>
              <Text style={[styles.cellText, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.cellTextBold, styles.colAmount]}>
                {formatCurrency(item.taxableAmount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Amount in words banner */}
        <View style={styles.wordsBanner}>
          <Text style={styles.wordsLabel}>Amount in Words (INR):</Text>
          <Text style={styles.wordsText}>
            {gst.amountInWords || "INR Zero Only"}
          </Text>
        </View>

        {/* LOWER SECTION: Payment Summary & GST Summary & Dynamic QR Code */}
        <View style={styles.lowerContainer}>
          {/* Section F: Payment Summary */}
          <View style={styles.leftPaymentCol}>
            <View style={styles.statusBadgeContainer}>
              <Text style={styles.sectionHeading}>Payment Summary</Text>
              <View style={[styles.statusBadge, statusStyle]}>
                <Text style={[styles.statusText, statusStyle]}>
                  {payment.status}
                </Text>
              </View>
            </View>

            <View style={styles.paymentRow}>
              <Text style={styles.metaLabel}>Previous Balance:</Text>
              <Text style={styles.cellText}>
                {formatCurrency(payment.previousBalance)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.metaLabel}>Current Invoice Amount:</Text>
              <Text style={styles.cellText}>
                {formatCurrency(payment.currentInvoiceAmount)}
              </Text>
            </View>
            {payment.previousPayments > 0 && (
              <View style={styles.paymentRow}>
                <Text style={styles.metaLabel}>Previous Payments:</Text>
                <Text style={[styles.cellText, { color: "#15803d" }]}>
                  -{formatCurrency(payment.previousPayments)}
                </Text>
              </View>
            )}
            <View style={styles.paymentRow}>
              <Text style={styles.metaLabel}>Outstanding Balance:</Text>
              <Text style={styles.cellText}>
                {formatCurrency(payment.outstandingBalance)}
              </Text>
            </View>
            <View style={styles.payableHighlightRow}>
              <Text style={styles.payableHighlightLabel}>
                Total Amount Payable:
              </Text>
              <Text style={styles.payableHighlightValue}>
                {formatCurrency(payment.totalAmountPayable)}
              </Text>
            </View>

            {/* Bank / UPI Payment Info */}
            <View style={styles.bankDetailsBox}>
              <Text style={[styles.addressLabel, { marginBottom: 2 }]}>
                Payment Remittance Details:
              </Text>
              {payment.upiId ? (
                <Text style={styles.bankText}>
                  <Text style={styles.bold}>UPI VPA: </Text>
                  {payment.upiId}
                </Text>
              ) : null}
              {payment.bankName ? (
                <Text style={styles.bankText}>
                  <Text style={styles.bold}>Bank: </Text>
                  {payment.bankName}
                  {payment.branch ? ` (${payment.branch})` : ""}
                </Text>
              ) : null}
              {payment.accountNumber ? (
                <Text style={styles.bankText}>
                  <Text style={styles.bold}>A/c No: </Text>
                  {payment.accountNumber}
                </Text>
              ) : null}
              {payment.ifsc ? (
                <Text style={styles.bankText}>
                  <Text style={styles.bold}>IFSC Code: </Text>
                  {payment.ifsc}
                </Text>
              ) : null}
              {payment.paymentReference ? (
                <Text style={styles.bankText}>
                  <Text style={styles.bold}>Ref / Txn ID: </Text>
                  {payment.paymentReference}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Section E: GST Summary & Section G: QR Code */}
          <View style={styles.rightTaxCol}>
            {/* GST Summary */}
            <View style={styles.taxCard}>
              <Text style={styles.sectionHeading}>GST Tax Computation</Text>

              <View style={styles.taxRow}>
                <Text style={styles.metaLabel}>Subtotal:</Text>
                <Text style={styles.cellText}>
                  {formatCurrency(gst.subtotal)}
                </Text>
              </View>

              {gst.discount > 0 && (
                <View style={styles.taxRow}>
                  <Text style={styles.metaLabel}>Discount:</Text>
                  <Text style={[styles.cellText, { color: "#15803d" }]}>
                    -{formatCurrency(gst.discount)}
                  </Text>
                </View>
              )}

              <View style={styles.taxRow}>
                <Text style={[styles.metaLabel, styles.bold]}>
                  Taxable Value:
                </Text>
                <Text style={[styles.cellText, styles.bold]}>
                  {formatCurrency(gst.taxableValue)}
                </Text>
              </View>

              {/* Tax components: CGST + SGST or IGST */}
              {!gst.isInterState ? (
                <>
                  <View style={styles.taxRow}>
                    <Text style={styles.metaLabel}>
                      CGST ({gst.cgstRate}%):
                    </Text>
                    <Text style={styles.cellText}>
                      {formatCurrency(gst.cgstAmount)}
                    </Text>
                  </View>
                  <View style={styles.taxRow}>
                    <Text style={styles.metaLabel}>
                      SGST ({gst.sgstRate}%):
                    </Text>
                    <Text style={styles.cellText}>
                      {formatCurrency(gst.sgstAmount)}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.taxRow}>
                  <Text style={styles.metaLabel}>
                    IGST ({gst.igstRate}%):
                  </Text>
                  <Text style={styles.cellText}>
                    {formatCurrency(gst.igstAmount)}
                  </Text>
                </View>
              )}

              <View style={styles.taxRow}>
                <Text style={styles.metaLabel}>Total GST:</Text>
                <Text style={styles.cellText}>
                  {formatCurrency(gst.totalGst)}
                </Text>
              </View>

              <View style={styles.taxTotalRow}>
                <Text style={styles.grandTotalLabel}>Final Invoice Total:</Text>
                <Text style={styles.grandTotalValue}>
                  {formatCurrency(gst.finalInvoiceAmount)}
                </Text>
              </View>
            </View>

            {/* Section G: Dynamic QR Code */}
            {qrCode.enabled && qrCode.dataUri ? (
              <View style={styles.qrContainer}>
                <Image src={qrCode.dataUri} style={styles.qrImage} />
                <View style={styles.qrInfo}>
                  <Text style={styles.qrHeading}>
                    {qrCode.label || "Scan to View / Pay"}
                  </Text>
                  <Text style={styles.qrCaption}>
                    Use any camera app or UPI app to view digital bill and pay
                    instantly.
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        {/* SECTION H: Invoice Footer */}
        <View style={styles.footerContainer}>
          <View style={styles.footerNotesRow}>
            <View style={styles.termsBlock}>
              <Text style={styles.addressLabel}>Terms & Instructions:</Text>
              {footer.terms && footer.terms.length > 0 ? (
                footer.terms.map((term, tIdx) => (
                  <Text key={tIdx} style={styles.termItem}>
                    • {term}
                  </Text>
                ))
              ) : (
                <Text style={styles.termItem}>
                  • Broadband subscription is billed in advance for 15-day
                  cycles.
                </Text>
              )}
              <Text style={styles.thankYouText}>
                {footer.thankYouMessage ||
                  "Thank you for choosing us. We appreciate your trust in our services."}
              </Text>
            </View>

            <View style={styles.signatoryBlock}>
              <Text style={styles.signatoryTitle}>
                {footer.authorizedSignatoryTitle || `${company.legalName}`}
              </Text>
              {/* <Text style={styles.signatoryLine}>Authorized Signatory</Text> */}
            </View>
          </View>

          {/* Computer Generated Declaration & Page Number */}
          <View style={styles.bottomDisclaimer}>
            <Text style={styles.disclaimerText}>
              {footer.isComputerGeneratedDeclaration
                ? "This is a computer-generated tax invoice and does not require a physical signature."
                : ""}
            </Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
