// DOM Elements
const previousReading = document.getElementById('previousReading');
const currentReading = document.getElementById('currentReading');
const unitsConsumed = document.getElementById('unitsConsumed');
const ratePerUnit = document.getElementById('ratePerUnit');
const electricityBill = document.getElementById('electricityBill');
const houseRent = document.getElementById('houseRent');
const waterCharges = document.getElementById('waterCharges');
const maintenance = document.getElementById('maintenance');
const otherServices = document.getElementById('otherServices');
const calculateBtn = document.getElementById('calculateBtn');
const generatePdfBtn = document.getElementById('generatePdfBtn');

// Summary elements
const summaryRent = document.getElementById('summaryRent');
const summaryElectricity = document.getElementById('summaryElectricity');
const summaryWater = document.getElementById('summaryWater');
const summaryMaintenance = document.getElementById('summaryMaintenance');
const summaryOther = document.getElementById('summaryOther');
const totalAmount = document.getElementById('totalAmount');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    document.getElementById('billDate').value = new Date().toISOString().split('T')[0];
    
    // Add event listeners
    previousReading.addEventListener('input', calculateUnits);
    currentReading.addEventListener('input', calculateUnits);
    ratePerUnit.addEventListener('input', calculateElectricityBill);
    
    calculateBtn.addEventListener('click', calculateBill);
    generatePdfBtn.addEventListener('click', generatePDF);
    
    // Auto-calculate on input changes
    [houseRent, waterCharges, maintenance, otherServices].forEach(input => {
        input.addEventListener('input', updateSummary);
    });
});

function calculateUnits() {
    const prev = parseFloat(previousReading.value) || 0;
    const current = parseFloat(currentReading.value) || 0;
    const units = Math.max(0, current - prev);
    
    unitsConsumed.value = units;
    calculateElectricityBill();
}

function calculateElectricityBill() {
    const units = parseFloat(unitsConsumed.value) || 0;
    const rate = parseFloat(ratePerUnit.value) || 8;
    const bill = units * rate;
    
    electricityBill.value = bill.toFixed(2);
    updateSummary();
}

function updateSummary() {
    const rent = parseFloat(houseRent.value) || 0;
    const electricity = parseFloat(electricityBill.value) || 0;
    const water = parseFloat(waterCharges.value) || 0;
    const maintenanceAmt = parseFloat(maintenance.value) || 0;
    const other = parseFloat(otherServices.value) || 0;
    
    summaryRent.textContent = `₹${rent.toFixed(2)}`;
    summaryElectricity.textContent = `₹${electricity.toFixed(2)}`;
    summaryWater.textContent = `₹${water.toFixed(2)}`;
    summaryMaintenance.textContent = `₹${maintenanceAmt.toFixed(2)}`;
    summaryOther.textContent = `₹${other.toFixed(2)}`;
    
    const total = rent + electricity + water + maintenanceAmt + other;
    totalAmount.textContent = `₹${total.toFixed(2)}`;
}

function calculateBill() {
    calculateUnits();
    calculateElectricityBill();
    updateSummary();
    
    // Enable PDF generation
    generatePdfBtn.disabled = false;
    
    // Show success message
    alert('Bill calculated successfully! You can now generate PDF.');
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get form data
    const tenantName = document.getElementById('tenantName').value || 'N/A';
    const propertyAddress = document.getElementById('propertyAddress').value || 'N/A';
    const billDate = document.getElementById('billDate').value || 'N/A';
    const billMonth = document.getElementById('billMonth').value || 'N/A';
    
    const prevReading = parseFloat(previousReading.value) || 0;
    const currReading = parseFloat(currentReading.value) || 0;
    const units = parseFloat(unitsConsumed.value) || 0;
    const rate = parseFloat(ratePerUnit.value) || 8;
    
    const rent = parseFloat(houseRent.value) || 0;
    const electricity = parseFloat(electricityBill.value) || 0;
    const water = parseFloat(waterCharges.value) || 0;
    const maintenanceAmt = parseFloat(maintenance.value) || 0;
    const other = parseFloat(otherServices.value) || 0;
    const total = rent + electricity + water + maintenanceAmt + other;
    
    // Set better font
    doc.setFont('helvetica');
    
    // PDF Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('RENT BILL', 105, 25, { align: 'center' });
    
    // Tenant Information Box
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TENANT DETAILS', 20, 45);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${tenantName}`, 20, 58);
    doc.text(`Address: ${propertyAddress}`, 20, 68);
    doc.text(`Bill Date: ${billDate}`, 20, 78);
    doc.text(`Bill Month: ${billMonth}`, 20, 88);
    
    // Draw border around tenant details
    doc.rect(15, 40, 180, 55);
    
    // Meter Reading Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('METER READINGS', 20, 110);
    
    // Table headers
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.rect(20, 115, 155, 10); // Header row
    doc.text('Description', 25, 122);
    doc.text('Value', 150, 122);
    
    // Table rows
    doc.setFont('helvetica', 'normal');
    let tableY = 125;
    
    // Previous Reading
    doc.rect(20, tableY, 155, 8);
    doc.text('Previous Reading', 25, tableY + 6);
    doc.text(prevReading.toString(), 150, tableY + 6);
    tableY += 8;
    
    // Current Reading
    doc.rect(20, tableY, 155, 8);
    doc.text('Current Reading', 25, tableY + 6);
    doc.text(currReading.toString(), 150, tableY + 6);
    tableY += 8;
    
    // Units Consumed
    doc.rect(20, tableY, 155, 8);
    doc.text('Units Consumed', 25, tableY + 6);
    doc.text(units.toString(), 150, tableY + 6);
    tableY += 8;
    
    // Rate per Unit
    doc.rect(20, tableY, 155, 8);
    doc.text('Rate per Unit', 25, tableY + 6);
    doc.text(`Rs. ${rate}`, 150, tableY + 6);
    
    // Bill Details Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL DETAILS', 20, 185);
    
    // Bill table headers
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.rect(20, 190, 155, 10);
    doc.text('Particulars', 25, 197);
    doc.text('Amount (Rs.)', 140, 197);
    
    // Bill table rows
    doc.setFont('helvetica', 'normal');
    let billY = 200;
    
    // House Rent
    doc.rect(20, billY, 155, 8);
    doc.text('House Rent', 25, billY + 6);
    doc.text(rent.toFixed(2), 140, billY + 6);
    billY += 8;
    
    // Electricity Bill
    doc.rect(20, billY, 155, 8);
    doc.text('Electricity Bill', 25, billY + 6);
    doc.text(electricity.toFixed(2), 140, billY + 6);
    billY += 8;
    
    // Water Charges
    if (water > 0) {
        doc.rect(20, billY, 155, 8);
        doc.text('Water Charges', 25, billY + 6);
        doc.text(water.toFixed(2), 140, billY + 6);
        billY += 8;
    }
    
    // Maintenance
    if (maintenanceAmt > 0) {
        doc.rect(20, billY, 155, 8);
        doc.text('Maintenance', 25, billY + 6);
        doc.text(maintenanceAmt.toFixed(2), 140, billY + 6);
        billY += 8;
    }
    
    // Other Services
    if (other > 0) {
        doc.rect(20, billY, 155, 8);
        doc.text('Other Services', 25, billY + 6);
        doc.text(other.toFixed(2), 140, billY + 6);
        billY += 8;
    }
    
    // Total Amount
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(20, billY, 155, 12, 'F');
    doc.rect(20, billY, 155, 12);
    doc.setFontSize(12);
    doc.text('TOTAL AMOUNT', 25, billY + 8);
    doc.text(`Rs. ${total.toFixed(2)}`, 140, billY + 8);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your payment!', 105, 280, { align: 'center' });
    
    // Save PDF
    const fileName = `Rent_Bill_${tenantName.replace(/\s+/g, '_')}_${billMonth.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
}