import jsPDF from 'jspdf';

export const generateSlipPDF = (slipData) => {
  if (!slipData) return null;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 120] // 80mm width thermal paper
  });

  doc.setFont('courier', 'normal');

  // Hospital Header
  doc.setFontSize(16);
  doc.setFont('courier', 'bold');
  doc.text(slipData.hospitalName || 'MedSlip Hospital', 40, 10, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('courier', 'normal');
  doc.text('Automated Prescription Slip', 40, 16, { align: 'center' });
  
  // Divider
  doc.setLineWidth(0.5);
  doc.line(5, 20, 75, 20);
  doc.line(5, 21, 75, 21);

  // Token Number - Big and Bold
  doc.setFontSize(14);
  doc.setFont('courier', 'bold');
  doc.text(`Token: ${slipData.tokenId}`, 40, 30, { align: 'center' });

  // Divider
  doc.setLineWidth(0.3);
  doc.line(5, 35, 75, 35);

  // Patient Details
  let y = 42;
  doc.setFontSize(10);
  doc.setFont('courier', 'normal');

  const details = [
    { label: 'Patient', value: slipData.patientName },
    { label: 'Age/Gender', value: `${slipData.age}/${slipData.gender}` },
    { label: 'Department', value: slipData.department },
    { label: 'Doctor', value: slipData.doctor || 'Assigned Doctor' },
    { label: 'Phone', value: slipData.phone || 'N/A' },
  ];

  details.forEach(item => {
    doc.setFont('courier', 'bold');
    doc.text(`${item.label}:`, 8, y);
    doc.setFont('courier', 'normal');
    doc.text(`${item.value}`, 45, y);
    y += 7;
  });

  // Divider
  y += 3;
  doc.setLineWidth(0.3);
  doc.line(5, y, 75, y);
  y += 6;

  // Date & Time
  doc.setFontSize(8);
  doc.setFont('courier', 'normal');
  const dateStr = slipData.printedAt 
    ? new Date(slipData.printedAt).toLocaleString() 
    : new Date().toLocaleString();
  doc.text(`Printed: ${dateStr}`, 40, y, { align: 'center' });

  // Footer
  y += 6;
  doc.setFontSize(7);
  doc.text('This is a computer-generated prescription slip', 40, y, { align: 'center' });
  doc.text('Valid only with hospital stamp', 40, y + 4, { align: 'center' });

  // Return as blob for printing
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

export const printSlip = (slipData) => {
  const pdfBlob = generateSlipPDF(slipData);
  if (!pdfBlob) return;

  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  // Open in new window for printing
  const printWindow = window.open(pdfUrl, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      // Auto-trigger print after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
  
  // Clean up URL after some time
  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 60000);
};