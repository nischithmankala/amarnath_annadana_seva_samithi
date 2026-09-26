import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface ReceiptData {
  receiptNumber: string;
  date: Date;
  donorName: string;
  email?: string;
  mobile?: string;
  address?: string;
  pan?: string;
  amount: number;
  amountInWords: string;
  purpose: string;
  paymentMethod?: string;
  transactionRef: string;
  isAnonymous?: boolean;
  is80G?: boolean;
  registrationNumber80G?: string;
  validUpto80G?: string;
}

function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 20) return ones[num]!;
  if (num < 100) return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();
  if (num < 1000) return `${ones[Math.floor(num / 100)]} Hundred ${numberToWords(num % 100)}`.trim();
  if (num < 100000) return `${numberToWords(Math.floor(num / 1000))} Thousand ${numberToWords(num % 1000)}`.trim();
  if (num < 10000000) return `${numberToWords(Math.floor(num / 100000))} Lakh ${numberToWords(num % 100000)}`.trim();
  return `${numberToWords(Math.floor(num / 10000000))} Crore ${numberToWords(num % 10000000)}`.trim();
}

export function amountToWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = `Rupees ${numberToWords(rupees)}`;
  if (paise > 0) words += ` and ${numberToWords(paise)} Paise`;
  words += ' Only';
  return words;
}

export async function generateReceiptPDF(data: ReceiptData, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Header / Letterhead
    doc.rect(0, 0, doc.page.width, 120).fill('#1a3c5e');
    doc.fillColor('white')
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('AMARNATH ANNADANA SEVA SAMITHI', 50, 30, { align: 'center' })
      .fontSize(11)
      .font('Helvetica')
      .text('Serving Pilgrims with Devotion | Annadana Seva', { align: 'center' })
      .text('Contact: info@amarnathseva.org | www.amarnathseva.org', { align: 'center' });

    // Receipt title band
    doc.rect(0, 120, doc.page.width, 40).fill('#e8a014');
    doc.fillColor('white')
      .font('Helvetica-Bold')
      .fontSize(16)
      .text('DONATION RECEIPT', 50, 133, { align: 'center' });

    doc.moveDown(5);

    // Receipt details
    const leftX = 50;
    const rightX = 320;
    let y = 185;

    doc.fillColor('#1a3c5e').font('Helvetica-Bold').fontSize(10)
      .text('Receipt Number:', leftX, y)
      .text('Date:', rightX, y);
    doc.fillColor('#333').font('Helvetica').fontSize(10)
      .text(data.receiptNumber, leftX + 100, y)
      .text(data.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), rightX + 50, y);

    y += 25;
    doc.fillColor('#1a3c5e').font('Helvetica-Bold')
      .text('Order/Ref Number:', leftX, y);
    doc.fillColor('#333').font('Helvetica')
      .text(data.transactionRef, leftX + 110, y);

    // Divider
    y += 30;
    doc.moveTo(leftX, y).lineTo(doc.page.width - leftX, y).strokeColor('#ddd').stroke();

    // Donor details
    y += 15;
    doc.fillColor('#1a3c5e').font('Helvetica-Bold').fontSize(12)
      .text('DONOR DETAILS', leftX, y);

    y += 20;
    const detailRows: [string, string][] = [
      ['Name', data.isAnonymous ? 'Anonymous' : data.donorName],
      ['Mobile', data.mobile || '—'],
      ['Email', data.email || '—'],
      ['Address', data.address || '—'],
      ['PAN', data.pan || '—'],
    ];

    for (const [label, value] of detailRows) {
      doc.fillColor('#555').font('Helvetica-Bold').fontSize(10).text(`${label}:`, leftX, y);
      doc.fillColor('#333').font('Helvetica').fontSize(10).text(value, leftX + 90, y, { width: 400 });
      y += 18;
    }

    // Payment details
    y += 10;
    doc.moveTo(leftX, y).lineTo(doc.page.width - leftX, y).strokeColor('#ddd').stroke();
    y += 15;
    doc.fillColor('#1a3c5e').font('Helvetica-Bold').fontSize(12).text('PAYMENT DETAILS', leftX, y);
    y += 20;

    const paymentRows: [string, string][] = [
      ['Purpose', data.purpose],
      ['Payment Method', data.paymentMethod || 'Online'],
      ['Amount', `₹ ${data.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Amount in Words', data.amountInWords],
    ];

    for (const [label, value] of paymentRows) {
      doc.fillColor('#555').font('Helvetica-Bold').fontSize(10).text(`${label}:`, leftX, y);
      doc.fillColor('#333').font('Helvetica').fontSize(10).text(value, leftX + 120, y, { width: 380 });
      y += 18;
    }

    // Amount box
    y += 15;
    doc.rect(leftX, y, doc.page.width - 100, 40).fill('#f0f7ff').stroke('#1a3c5e');
    doc.fillColor('#1a3c5e').font('Helvetica-Bold').fontSize(14)
      .text(`Total Amount: ₹ ${data.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, leftX + 10, y + 12, { align: 'center' });

    // 80G section
    if (data.is80G && data.registrationNumber80G) {
      y += 60;
      doc.rect(leftX, y, doc.page.width - 100, 50).fill('#fff8e1').stroke('#e8a014');
      doc.fillColor('#b35900').font('Helvetica-Bold').fontSize(10)
        .text('80G TAX EXEMPTION CERTIFICATE', leftX + 10, y + 8);
      doc.fillColor('#333').font('Helvetica').fontSize(9)
        .text(`Registration No: ${data.registrationNumber80G} | Valid Upto: ${data.validUpto80G || 'Ongoing'}`, leftX + 10, y + 25);
      doc.text('This donation qualifies for income tax deduction under Section 80G of the Income Tax Act, 1961.', leftX + 10, y + 37, { width: 450 });
    }

    // Footer
    const footerY = doc.page.height - 80;
    doc.moveTo(leftX, footerY).lineTo(doc.page.width - leftX, footerY).strokeColor('#1a3c5e').stroke();
    doc.fillColor('#1a3c5e').font('Helvetica-Bold').fontSize(9)
      .text('Authorised Signatory', doc.page.width - 180, footerY + 10);
    doc.fillColor('#555').font('Helvetica').fontSize(8)
      .text('This is a computer-generated receipt and does not require a physical signature.', leftX, footerY + 10, { align: 'center' });
    doc.text('Thank you for your generous contribution to Annadana Seva.', leftX, footerY + 22, { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}
