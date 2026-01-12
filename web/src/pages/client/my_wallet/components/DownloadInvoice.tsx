import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { GoDownload } from "react-icons/go";
import { IoCloseSharp } from "react-icons/io5";
import type { DownloadInvoiceModalProps } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import companyLogo from "@/assets/company-logo.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * DownloadInvoice Component
 *
 * A modal dialog that allows users to download their account invoice
 * based on a selected date range.
 *
 * Features:
 * - Provides predefined date range options (Last Month, Last 3 Months, etc.)
 * - Supports a custom date range with start and end date selection
 * - Uses React Hook Form for form state management and validation
 * - Triggers a download action when the form is submitted
 *
 * @component
 *
 * @param {DownloadInvoiceModalProps} props - Component props
 * @param {boolean} props.isOpen - Controls whether the modal is visible
 * @param {() => void} props.onClose - Callback function to close the modal
 * @param {() => void} props.onDownload - Callback function triggered on successful form submission
 *
 * @returns {JSX.Element | null} Returns the modal UI when open, otherwise null
 */
const dateRanges = [
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last Year",
  "Custom Date Range",
];
const radioOptions = dateRanges.map((range) => ({
  label: range,
  value: range,
}));

interface IFormInputs {
  dateRange: string;
  startDate?: string;
  endDate?: string;
}

const DownloadInvoice: React.FC<DownloadInvoiceModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const methods = useForm<IFormInputs>({
    defaultValues: {
      dateRange: dateRanges[0],
    },
  });
  const { watch, handleSubmit } = methods;
  const selectedRange = watch("dateRange");

  if (!isOpen) return null;

  // Function to generate A4 PDF and download directly
  const generateAndDownloadPDF = async () => {
    try {
      const today = new Date();
      // Use user's locale for formatting
      const locale = (navigator && navigator.language) || "en-US";
      const currency = "USD"; // sample currency - replace with real currency when available
      // Sample transaction data (use your real transaction object when available)
      const sampleTransaction = {
        transactionId: `TX-${String(100000 + Math.floor(Math.random() * 899999))}`,
        invoiceNumber: `INV-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
        date: today,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        // Use the requested transaction description as the invoice line
        items: [
          { description: "Installation Of CCTV", qty: 1, unitPrice: 150.0 },
        ],
        currency: currency,
        payer: "Client Name",
        payee: "Field Techy Services",
        paymentMethod: "Card (**** 4242)",
        balanceBefore: 1000.0,
        supportContact: "support@fieldtechy.com",
      };
      // compute totals dynamically so amounts always reflect items
      const itemsTotal = sampleTransaction.items.reduce(
        (s, it) => s + it.qty * it.unitPrice,
        0,
      );
      const taxRate = 0; // set if you need tax (e.g., 0.1 for 10%)
      const taxAmount = itemsTotal * taxRate;
      const totalAmount = itemsTotal + taxAmount;
      // compute balance after
      const balanceAfter = sampleTransaction.balanceBefore - totalAmount;

      // Sample client details
      const clientName = "Acme Corporation";
      const clientEmail = "billing@acmecorp.com";
      const clientPhone = "+1 (555) 987-6543";
      const payerName = "John Smith";
      const payeeName = "Field Techy Services";

      // Filename per AC-4
      const yyyyMMdd = today.toISOString().slice(0, 10).replace(/-/g, "");
      const filename = `fieldtechy_wallet_invoice_${sampleTransaction.transactionId}_${yyyyMMdd}.pdf`;

      // Build invoice HTML inside a container element (no new window)
      const container = document.createElement("div");
      container.style.background = "white";
      container.style.padding = "20mm";
      // Build invoice HTML using localized formatting
      const nf = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: sampleTransaction.currency,
      });
      const df = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });

      // Use actual company logo image
      const logoImgTag = `<img src="${companyLogo}" alt="Company logo" style="width:60px;height:60px;object-fit:contain;" />`;

      // Compose items rows
      const itemsHtml = sampleTransaction.items
        .map((item) => {
          const total = item.qty * item.unitPrice;
          return `<tr><td style="padding:12px; border:1px solid #ddd;">${item.description}</td><td style="padding:12px; text-align:center; border:1px solid #ddd;">${item.qty}</td><td style="padding:12px; text-align:right; border:1px solid #ddd;">${nf.format(item.unitPrice)}</td><td style="padding:12px; text-align:right; border:1px solid #ddd;">${nf.format(total)}</td></tr>`;
        })
        .join("");
      //  Here I used custom CSS, not Tailwind, because I’m using jsPDF and html2canvas. These tools work with raw HTML and CSS, so that’s why.
      container.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 210mm; background: white; color: #333;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div>${logoImgTag}</div>
              <div>
                <div style="font-size:18px; font-weight:700; color:#059669;">Field Techy Services</div>
                <div style="font-size:12px; color:#666;">www.fieldtechy.com</div>
              </div>
            </div>
            <div style="text-align:right; font-size:12px; color:#666;">
              <div>Transaction ID: <strong style="color:#333;">${sampleTransaction.transactionId}</strong></div>
              <div>Invoice #: <strong style="color:#333;">${sampleTransaction.invoiceNumber}</strong></div>
              <div>Date: <strong style="color:#333;">${df.format(sampleTransaction.date)}</strong></div>
            </div>
          </div>
 
          <hr style="border:none; border-top:3px solid #059669; margin:8px 0 20px 0;" />
 
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; font-size: 12px;">
            <div>
              <div style="font-weight:700; margin-bottom:6px;">Client</div>
              <div>${clientName}</div>
              <div style="color:#666; font-size:11px;">${clientEmail}</div>
              <div style="color:#666; font-size:11px;">${clientPhone}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700; margin-bottom:6px;">Billed To</div>
              <div>${clientName}</div>
            </div>
          </div>
 
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; font-size: 12px;">
            <div>
              <div style="font-weight:700; margin-bottom:6px;">Payer</div>
              <div>${payerName}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700; margin-bottom:6px;">Payee</div>
              <div>${payeeName}</div>
              <div style="color:#666; font-size:12px;">Contact: ${sampleTransaction.supportContact}</div>
            </div>
          </div>
 
          <table style="width:100%; border-collapse: collapse; margin-bottom: 20px; font-size:12px;">
            <thead>
              <tr style="background-color:#059669; color:white;">
                <th style="padding:12px; text-align:left; border:1px solid #ddd;">Description</th>
                <th style="padding:12px; text-align:center; border:1px solid #ddd;">Quantity</th>
                <th style="padding:12px; text-align:right; border:1px solid #ddd;">Unit Price</th>
                <th style="padding:12px; text-align:right; border:1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
 
          <div style="display:flex; justify-content:flex-end; margin-bottom:20px;">
            <div style="width:300px; font-size:12px;">
              <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #ddd;"><span style="color:#666;">Balance Before:</span><span style="color:#333;">${nf.format(sampleTransaction.balanceBefore)}</span></div>
              <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #ddd;"><span style="color:#666;">Payment Method:</span><span style="color:#333;">${sampleTransaction.paymentMethod}</span></div>
              <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #ddd;"><span style="color:#666;">Subtotal:</span><span style="color:#333;">${nf.format(itemsTotal)}</span></div>
              <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #ddd;"><span style="color:#666;">Tax:</span><span style="color:#333;">${nf.format(taxAmount)}</span></div>
              <div style="display:flex; justify-content:space-between; padding:12px; font-weight:700; background-color:#059669; color:white; border-radius:4px;"><span>Total Amount:</span><span>${nf.format(totalAmount)}</span></div>
              <div style="display:flex; justify-content:space-between; padding:8px 0; margin-top:6px;"><span style="color:#666;">Balance After:</span><span style="color:#333;">${nf.format(balanceAfter)}</span></div>
            </div>
          </div>
 
          <div style="border-top:2px solid #059669; padding-top:12px; text-align:center; color:#666; font-size:11px;">
            <div>Thank you for your business!</div>
            <div>Terms: Payment due within 30 days. Tax where applicable.</div>
            <div style="margin-top:6px; color:#999;">Generated on ${df.format(new Date())}</div>
          </div>
        </div>
      `;

      // Append hidden container to DOM to allow html2canvas to render styles
      container.style.position = "fixed";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      // Create canvas from the container
      // @ts-ignore
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      // Remove temporary container
      document.body.removeChild(container);
      // Create PDF using jsPDF
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgData = canvas.toDataURL("image/png");
      const imgProps = { width: canvas.width, height: canvas.height };

      // Calculate the rendered height in mm for the given pdfWidth
      const renderedImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (renderedImgHeight <= pdfHeight) {
        // Single page
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, renderedImgHeight);
      } else {
        // Multi-page: draw slices
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");
        const pxPerMm = imgProps.width / pdfWidth;

        const pageHeightPx = Math.floor(pdfHeight * pxPerMm);
        pageCanvas.width = imgProps.width;
        pageCanvas.height = pageHeightPx;

        let yOffset = 0;
        while (yOffset < imgProps.height) {
          // Clear and draw slice
          pageCtx!.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          pageCtx!.drawImage(
            canvas,
            0,
            yOffset,
            pageCanvas.width,
            pageCanvas.height,
            0,
            0,
            pageCanvas.width,
            pageCanvas.height,
          );

          const pageData = pageCanvas.toDataURL("image/png");
          if (yOffset === 0) {
            pdf.addImage(pageData, "PNG", 0, 0, pdfWidth, pdfHeight);
          } else {
            pdf.addPage();
            pdf.addImage(pageData, "PNG", 0, 0, pdfWidth, pdfHeight);
          }

          yOffset += pageHeightPx;
        }
      }
      // Save PDF directly using required filename format
      pdf.save(filename);
      // Close modal
      onClose();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const onSubmit = async () => {
    await generateAndDownloadPDF();
    onDownload();
  };

  return (
    <FormProvider {...methods}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl transform transition-all bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 relative">
            <Button
              onClick={onClose}
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <IoCloseSharp className="h-6 w-6 cursor-pointer" />
            </Button>

            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
              Download Account Statement
            </h2>

            <RadioField
              name="dateRange"
              options={radioOptions}
              direction="vertical"
              isShowLabel={false}
            />

            {selectedRange === "Custom Date Range" && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <InputField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  rules={{ required: "Start date is required" }}
                />
                <InputField
                  name="endDate"
                  label="End Date"
                  type="date"
                  rules={{ required: "End date is required" }}
                />
              </div>
            )}

            <p className="text-center text-gray-600 dark:text-gray-300 my-6">
              Do You Want to Download Invoice as a PDF Document?
            </p>

            <Button
              type="submit"
              leftIcon={<GoDownload className="h-6 w-6" />}
              className="cursor-pointer w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Download</span>
            </Button>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default DownloadInvoice;
