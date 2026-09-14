import {
  CustomerSnapshot,
  InvoiceDiscount,
  InvoiceItemInput,
  InvoiceItemSnapshot,
  InvoiceTotals,
  SellerSnapshot,
  TaxBreakdownItem,
  TaxSnapshot,
} from "@/types";

function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export function calculateInvoiceTotals(
  items: InvoiceItemInput[],
  discount: InvoiceDiscount,
  seller?: Partial<SellerSnapshot>,
  customer?: Partial<CustomerSnapshot>
): {
  itemsSnapshot: InvoiceItemSnapshot[];
  taxSnapshot: TaxSnapshot;
  totals: InvoiceTotals;
} {
  // 1. Calculate raw subtotal
  let rawSubtotal = 0;
  const itemsWithSubtotal = items.map((item) => {
    const qty = Math.max(0, item.quantity || 0);
    const price = Math.max(0, item.unitPrice || 0);
    const lineSubtotal = round2(qty * price);
    rawSubtotal += lineSubtotal;
    return {
      ...item,
      quantity: qty,
      unitPrice: price,
      lineSubtotal,
    };
  });
  rawSubtotal = round2(rawSubtotal);

  // 2. Invoice Discount calculation
  let discountAmount = 0;
  if (discount && discount.value > 0) {
    if (discount.type === "PERCENTAGE") {
      discountAmount = round2(rawSubtotal * (Math.min(100, Math.max(0, discount.value)) / 100));
    } else {
      discountAmount = round2(Math.min(rawSubtotal, Math.max(0, discount.value)));
    }
  }

  const taxableAmount = round2(Math.max(0, rawSubtotal - discountAmount));
  const discountRatio = rawSubtotal > 0 ? taxableAmount / rawSubtotal : 0;

  // 3. Tax State logic (Intra-state vs Inter-state)
  const sellerState = (seller?.stateCode || seller?.state || "").trim().toUpperCase();
  const customerState = (customer?.stateCode || customer?.state || "").trim().toUpperCase();

  // If customer state is empty or matches seller state, apply CGST + SGST; otherwise IGST
  const isSameState = !customerState || !sellerState || sellerState === customerState;

  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const taxMap = new Map<number, TaxBreakdownItem>();

  const itemsSnapshot: InvoiceItemSnapshot[] = itemsWithSubtotal.map((item) => {
    const itemTaxable = round2(item.lineSubtotal * discountRatio);
    const rate = Math.max(0, item.taxRate || 0);

    let itemCgst = 0;
    let itemSgst = 0;
    let itemIgst = 0;
    let itemTotalTax = 0;

    if (rate > 0) {
      if (isSameState) {
        const halfRate = rate / 2;
        itemCgst = round2(itemTaxable * (halfRate / 100));
        itemSgst = round2(itemTaxable * (halfRate / 100));
        itemTotalTax = round2(itemCgst + itemSgst);
      } else {
        itemIgst = round2(itemTaxable * (rate / 100));
        itemTotalTax = itemIgst;
      }
    }

    totalCgst += itemCgst;
    totalSgst += itemSgst;
    totalIgst += itemIgst;

    // Aggregate breakdown by tax rate
    if (!taxMap.has(rate)) {
      taxMap.set(rate, {
        rate,
        taxableAmount: 0,
        cgstRate: isSameState ? rate / 2 : 0,
        cgstAmount: 0,
        sgstRate: isSameState ? rate / 2 : 0,
        sgstAmount: 0,
        igstRate: isSameState ? 0 : rate,
        igstAmount: 0,
        totalTax: 0,
      });
    }

    const entry = taxMap.get(rate)!;
    entry.taxableAmount = round2(entry.taxableAmount + itemTaxable);
    entry.cgstAmount = round2(entry.cgstAmount + itemCgst);
    entry.sgstAmount = round2(entry.sgstAmount + itemSgst);
    entry.igstAmount = round2(entry.igstAmount + itemIgst);
    entry.totalTax = round2(entry.totalTax + itemTotalTax);

    return {
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      taxProfileId: item.taxProfileId,
      taxRate: rate,
      taxableAmount: itemTaxable,
      cgstAmount: itemCgst,
      sgstAmount: itemSgst,
      igstAmount: itemIgst,
      totalTax: itemTotalTax,
      lineTotal: round2(itemTaxable + itemTotalTax),
    };
  });

  totalCgst = round2(totalCgst);
  totalSgst = round2(totalSgst);
  totalIgst = round2(totalIgst);

  const totalTax = isSameState ? round2(totalCgst + totalSgst) : totalIgst;
  const grandTotal = round2(taxableAmount + totalTax);

  const taxSnapshot: TaxSnapshot = {
    isSameState,
    sellerStateCode: sellerState,
    customerStateCode: customerState,
    breakdown: Array.from(taxMap.values()),
  };

  const totals: InvoiceTotals = {
    subtotal: rawSubtotal,
    discountAmount,
    taxableAmount,
    cgstAmount: isSameState ? totalCgst : 0,
    sgstAmount: isSameState ? totalSgst : 0,
    igstAmount: isSameState ? 0 : totalIgst,
    totalTax,
    grandTotal,
  };

  return {
    itemsSnapshot,
    taxSnapshot,
    totals,
  };
}
