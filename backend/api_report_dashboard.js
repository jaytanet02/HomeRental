const fs = require('fs');
const { jsPDF } = require('jspdf');
const { font } = require('./AngsanaNew-normal');
require('jspdf-autotable');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors()); // เปิดใช้งาน CORS สำหรับทุกเส้นทางใน Router
router.use(express.json()); // เปิดใช้งาน middleware ในการแปลง JSON สำหรับทุกเส้นทางใน Router


// สร้างเอกสาร PDF
router.post('/generate-pdf', async (req, res) => {

  const { searchmonth, searchyear, searchstatus, searchtext } = req.body;
  const doc = new jsPDF();
  doc.addFileToVFS("AngsanaNew-normal.ttf", font);
  doc.addFont("AngsanaNew-normal.ttf", "MyFont", "normal");
  doc.setFont("MyFont");
  // เพิ่มเนื้อหาลงใน PDF
  doc.text(searchmonth + searchyear + searchstatus + searchtext, 10, 10);
  const data = [
    ['ชื่อ', 'นามสกุล', 'อีเมล'],
    ['ทดสอบชื่อ', 'ทำสอบนามสกุล', 'email@example.com'],

  ];
  // สร้างตาราง
  doc.autoTable({
    head: [['ชื่อ', 'นามสกุล', 'อีเมล']],
    body: data,
  });

  // บันทึกเอกสาร PDF เป็นไฟล์
  const pdfBuffer = doc.output();
  fs.writeFileSync('pdf_file/mypdf.pdf', pdfBuffer);

  console.log('PDF ถูกสร้างและบันทึกเรียบร้อยแล้ว');

  // ส่งไฟล์ PDF กลับไปยัง frontend
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=generated-pdf.pdf');
  res.send(pdfBuffer);
});

module.exports = router;