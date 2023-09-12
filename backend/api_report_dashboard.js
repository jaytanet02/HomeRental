const fs = require('fs');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());
router.use(express.json());
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/#/main_dashboard');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin:0982846992@cluster0.qvuui0g.mongodb.net/?retryWrites=true&w=majority";

router.get('/generate-pdf', async (req, res) => {
  const data = req.body;

  try {
    const doc = new jsPDF();
    const client = new MongoClient(uri);
    await client.connect();

    var thai = fs.readFileSync("./font/THSarabun.ttf", {
      encoding: "latin1"
    });

    doc.addFileToVFS("THSarabun.ttf", thai);
    doc.addFont("THSarabun.ttf", "TH SarabunPSK", "normal");

    // กำหนดคอลัมน์และข้อมูลสำหรับตาราง
    const columns = [
      { header: 'ขื่อ-นามสกุล', dataKey: 'name' },
      { header: 'เลขห้องประเภทห้อง', dataKey: 'number' },
      { header: 'ค่าห้อง', dataKey: 'price_room' },
      { header: 'ค่าปรับ', dataKey: 'fine' },
      { header: 'ค่าน้ำ', dataKey: 'water' },
      { header: 'ค่าไฟ', dataKey: 'elec' },
      { header: 'ค่าขยะ', dataKey: 'bin' },
      { header: 'ยอดที่ชำระ', dataKey: 'total' },
    ];
    const res_payment = await client.db('home_rental').collection('payment').find({}).toArray();
    const tableData = []; // สร้าง Array ว่างไว้ก่อนการใช้งาน
    
    res_payment.map((value, index) => {
      const rowData = {}; // สร้าง Object ว่างไว้เพื่อเก็บข้อมูลแต่ละแถว
    
      // กำหนดค่าให้กับแต่ละคอลัมน์ในแถว
      rowData['name'] = value.pay_cus_name;
      rowData['number'] = value.pay_cus_room_name_full;
      rowData['price_room'] = value.pay_cus_room_price.toLocaleString();
      rowData['fine'] = value.pay_price_fine.toLocaleString();
      rowData['water'] = value.pay_price_water.toLocaleString();
      rowData['elec'] = value.pay_price_electricity.toLocaleString();
      rowData['bin'] = value.pay_room_bin_price.toLocaleString();
      rowData['total'] = value.pay_price_total.toLocaleString();
  
      // เพิ่มข้อมูลแถวลงใน Array ของ tableData
      tableData.push(rowData);
    });
 

    const tableStyles = {
      theme: 'grid',
      styles: {
        font: 'TH SarabunPSK',
        fontSize: 16,
        halign: 'center',
        cellWidth: 'wrap', // ใช้ wrap เพื่อกำหนดความกว้างของเซลล์โดยอัตโนมัติ
        valign: 'middle', // กำหนดให้ข้อมูลอยู่ตรงกลางของเซลล์    
        lineWidth: 0.1, // กำหนดความหนาของเส้นคั่น
      },
      columnStyles: {
        1: { halign: 'center' }, // คอลัมน์ที่ 1 ชิดตรงกลาง
        2: { halign: 'center' }, // คอลัมน์ที่ 2 ชิดตรงกลาง
        3: { halign: 'right' },  // คอลัมน์ที่ 3 ชิดขวา
        4: { halign: 'right' },  // คอลัมน์ที่ 4 ชิดขวา
        5: { halign: 'right' },  // คอลัมน์ที่ 5 ชิดขวา
        6: { halign: 'right' },  // คอลัมน์ที่ 6 ชิดขวา
        7: { halign: 'right' },  // คอลัมน์ที่ 7 ชิดขวา
        8: { halign: 'right' },  // คอลัมน์ที่ 8 ชิดขวา
      },
    };
    
    // สร้างตารางและกำหนดคอลัมน์และข้อมูล
    doc.autoTable({
      columns: columns,
      body: tableData,
      styles: tableStyles.styles,
      headStyles: tableStyles.headStyles,
      bodyStyles: tableStyles.columnStyles,
      margin: { top: 20 },
    });
    

    // อ่านภาพและเพิ่มภาพลงในไฟล์ PDF
    // const image = fs.readFileSync('./images/mook.jpg', { encoding: 'base64' });
    // doc.addImage(image, 'JPEG', 50, 80, 120, 120);

    // บันทึกเอกสาร PDF ชั่วคราว
    const tempFileName = 'generated-pdf.pdf';
    doc.save(tempFileName);

    // ส่งไฟล์ PDF ไปยังเบราว์เซอร์
    res.download(tempFileName, 'generated-pdf.pdf', (error) => {
      if (error) {
        console.error('Error sending PDF:', error);
        res.status(500).send('Error sending PDF');
      } else {
        // หลังจากส่งไฟล์เสร็จแล้วลบไฟล์ PDF ชั่วคราว
        fs.unlinkSync(tempFileName);
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

module.exports = router;
