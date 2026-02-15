const PDFDocument = require('pdfkit');

const generateCaseReport = (caseData, res) => {
    const doc = new PDFDocument({ margin: 50 });

    // Stream the PDF directly to the response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('NYAYACONNECT - OFFICIAL CASE REGISTRATION REPORT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown();

    // 1. Case Identification
    doc.fontSize(14).text('1. CASE IDENTIFICATION', { underline: true });
    doc.fontSize(12).text(`Case Number: ${caseData.caseNumber || 'N/A'}`);
    doc.text(`Registration Date: ${caseData.registrationDate ? new Date(caseData.registrationDate).toLocaleString() : 'N/A'}`);
    doc.text(`Jurisdiction: ${caseData.jurisdiction || 'N/A'}`);
    doc.text(`Case Type: ${caseData.category || 'N/A'}`);
    doc.text(`Priority Level: ${caseData.priorityLevel || 'Normal'}`);
    doc.moveDown();

    // 2. Parties Involved
    doc.fontSize(14).text('2. PARTIES INVOLVED', { underline: true });
    doc.fontSize(12).text('COMPLAINANT:');
    doc.fontSize(10).text(`Name: ${caseData.createdBy?.name || 'N/A'}`);
    doc.text(`Contact: ${caseData.createdBy?.phone || 'N/A'}`);
    doc.text(`Address: ${caseData.complainant?.address || 'N/A'}`);
    doc.text(`ID Proof: ${caseData.complainant?.idProofType || ''} - ${caseData.complainant?.idProofNumber || ''}`);
    doc.moveDown(0.5);
    doc.fontSize(12).text('ACCUSED:');
    doc.fontSize(10).text(`Name: ${caseData.accused?.isUnknown ? 'UNKNOWN' : (caseData.accused?.name || 'N/A')}`);
    doc.text(`Address: ${caseData.accused?.address || 'N/A'}`);
    doc.text(`Identifiers: ${caseData.accused?.identifiers || 'N/A'}`);
    doc.moveDown();

    // 3. Incident Information
    doc.fontSize(14).text('3. INCIDENT INFORMATION', { underline: true });
    doc.fontSize(10).text(`Date: ${caseData.incidentDate ? new Date(caseData.incidentDate).toLocaleDateString() : 'N/A'}`);
    doc.text(`Time: ${caseData.incidentTime || 'N/A'}`);
    doc.text(`Location: ${caseData.incidentLocation || 'N/A'}`);
    doc.text(`Description: ${caseData.description || 'N/A'}`);
    doc.text(`Injury/Damage: ${caseData.hasInjuryDamage ? 'YES' : 'NO'}`);
    doc.moveDown();

    // 4. Legal Classification
    doc.fontSize(14).text('4. LEGAL CLASSIFICATION', { underline: true });
    doc.fontSize(10).text(`Sections Applied: ${caseData.legalClassification?.approvedSections?.join(', ') || 'PENDING'}`);
    doc.text(`Severity: ${caseData.legalClassification?.severityLevel || 'N/A'}`);
    doc.text(`Bailable: ${caseData.legalClassification?.isBailable ? 'YES' : 'NO'}`);
    doc.moveDown();

    // 5. Assignment Details
    doc.fontSize(14).text('5. ASSIGNMENT DETAILS', { underline: true });
    doc.fontSize(10).text(`Assigned Police: ${caseData.assignedPolice?.name || 'PENDING'}`);
    doc.text(`Assigned Judge: ${caseData.assignedJudge?.name || 'PENDING'}`);
    doc.text(`Courtroom: ${caseData.courtroomName || 'N/A'}`);
    doc.moveDown();

    // 6. Evidence Summary
    doc.fontSize(14).text('6. EVIDENCE SUMMARY', { underline: true });
    doc.fontSize(10).text(`Total Files Uploaded: ${caseData.evidence?.length || 0}`);
    if (caseData.evidence && caseData.evidence.length > 0) {
        caseData.evidence.forEach((ev, i) => {
            doc.text(`${i+1}. ${ev.filePath} [Hash: ${ev.fileHash.substring(0, 10)}...] - ${ev.locked ? 'LOCKED' : 'UNLOCKED'}`);
        });
    } else {
        doc.text('No evidence uploaded at the time of registration.');
    }
    doc.moveDown();

    // 7. Status Tracking
    doc.fontSize(14).text('7. STATUS TRACKING', { underline: true });
    doc.fontSize(10).text(`Current Status: ${caseData.status}`);
    doc.text(`Next Stage: INVESTIGATION`);
    doc.text(`First Hearing: ${caseData.hearings?.length > 0 ? new Date(caseData.hearings[0].date).toLocaleString() : 'NOT SCHEDULED'}`);
    doc.moveDown();

    // 8. System Metadata
    doc.fontSize(8).text('This is a computer-generated document. System Hash: ' + Math.random().toString(36).substring(7), { align: 'center', bottom: 10 });

    doc.end();
};

module.exports = { generateCaseReport };
