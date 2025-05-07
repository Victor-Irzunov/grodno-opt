import jsPDF from "jspdf";
import { getPrintableHTML } from "./pdfTemplate";

export const sendPdfToTelegram = async (order, user) => {
  const html = getPrintableHTML(order, user);
  const pdf = new jsPDF();

  await pdf.html(html, {
    callback: async (doc) => {
      const blob = doc.output("blob");
      const formData = new FormData();
      formData.append("document", blob, `order_${order.id}.pdf`);

      await fetch("https://api.telegram.org/bot5562126487:AAGqX2TBd3toX15OgSCQ2yW55RNfgtBWQko/sendDocument?chat_id=-1001794221917", {
        method: "POST",
        body: formData,
      });
    },
    margin: [10, 10, 10, 10],
    autoPaging: true,
    html2canvas: { scale: 1 },
    x: 10,
    y: 10,
  });
};