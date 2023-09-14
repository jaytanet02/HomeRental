const fs = require('fs');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());
router.use(express.json());
const { GridFSBucket, MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin:0982846992@cluster0.qvuui0g.mongodb.net/?retryWrites=true&w=majority";

router.use(cors({
  origin: 'https://homerentalsystem.onrender.com'
}));

async function listFiles() {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    const db = client.db('home_rental');
    const bucket = new GridFSBucket(db);

    // ดึงรายการไฟล์ทั้งหมดใน GridFS
    const files = await bucket.find().toArray();

    // แสดงรายชื่อไฟล์
    console.log(files);
  } finally {
    client.close();
  }
}
router.get('/generate-pdf', async (req, res) => {
  const { searchmonth, searchyear, searchstatus, searchtext } = req.query;
  let filter = {}; // สร้างออบเจ็กต์ filter เป็นเปล่าไว้ก่อน
  if (searchmonth !== "00") {
    filter.pay_cus_round = searchmonth;
  }
  if (searchyear !== "00") {
    filter.pay_cus_round_year = searchyear;
  }
  if (searchstatus !== "00") {
    filter.pay_status = parseInt(searchstatus);
  }
  if (searchtext !== "") {
    filter.pay_cus_name = { $regex: searchtext, $options: 'i' };
  }
  try {
    const doc = new jsPDF();
    const client = new MongoClient(uri);
    await client.connect();
    var thai = fs.readFileSync("./font/THSarabun.ttf", {
      encoding: "latin1"
    });
    doc.addFileToVFS("THSarabun.ttf", thai);
    doc.addFont("THSarabun.ttf", "TH SarabunPSK", "normal");
    doc.setFont("TH SarabunPSK");
    // กำหนดคอลัมน์และข้อมูลสำหรับตาราง
    const columns = [
      { header: 'ขื่อ-นามสกุล', dataKey: 'name' },
      { header: 'เลขห้องประเภทห้อง', dataKey: 'number' },
      { header: 'สถานะ', dataKey: 'status' },
      { header: 'ค่าห้อง', dataKey: 'price_room' },
      { header: 'ค่าปรับ', dataKey: 'fine' },
      { header: 'ค่าน้ำ', dataKey: 'water' },
      { header: 'ค่าไฟ', dataKey: 'elec' },
      { header: 'ค่าขยะ', dataKey: 'bin' },
      { header: 'ยอดที่ชำระ', dataKey: 'total' },
    ];
    const res_payment = await client.db('home_rental').collection('payment').find(filter).toArray();
    const tableData = [];
    var total_price = 0;
    res_payment.map((value, index) => {
      const rowData = {};
      rowData['name'] = value.pay_cus_name;
      rowData['number'] = value.pay_cus_room_name_full;
      rowData['status'] = f_status(value.pay_status);
      rowData['price_room'] = value.pay_cus_room_price.toLocaleString();
      rowData['fine'] = value.pay_price_fine.toLocaleString();
      rowData['water'] = value.pay_price_water.toLocaleString();
      rowData['elec'] = value.pay_price_electricity.toLocaleString();
      rowData['bin'] = value.pay_room_bin_price.toLocaleString();
      rowData['total'] = value.pay_price_total.toLocaleString();
      total_price += value.pay_price_total;
      tableData.push(rowData);
    });
    doc.text("เดือน " + text_y_m(searchmonth, 'month') + " ปี " + text_y_m(searchyear, 'year'), 90, 15);
    doc.text("รวม", 165, (res_payment.length * 10) + 40);
    doc.text(total_price.toLocaleString(), 180, (res_payment.length * 10) + 40);
    const tableStyles = {
      theme: 'grid',
      styles: {
        font: 'TH SarabunPSK',
        fontSize: 16,
        halign: 'center',
        cellWidth: 'wrap',
        valign: 'middle',
        lineWidth: 0.1,
      },
      columnStyles: {
        1: { halign: 'center' }, // คอลัมน์ที่ 1 ชิดตรงกลาง
        2: { halign: 'center' }, // คอลัมน์ที่ 2 ชิดตรงกลาง
        3: { halign: 'left' },  // คอลัมน์ที่ 3 ชิดขวา
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

function f_status(data) {
  if (data === -1) {
    return `รอคิดค่าเช่าบ้าน`;
  } else if (data === 0) {
    return `รอชำระเงิน`;
  } else if (data === 1) {
    return `รอการตรวจสอบ`;
  } else if (data === 2) {
    return `ชำระเงินเรียบร้อย`;
  }
}

function text_y_m(data, type) {
  if (type === 'month') {
    if (data === '00') {
      return "ทั้งหมด";
    } else if (data === '01') {
      return "มกราคม";
    } else if (data === '02') {
      return "กุมภาพันธ์";
    } else if (data === '03') {
      return "มีนาคม";
    } else if (data === '04') {
      return "เมษายน";
    } else if (data === '05') {
      return "พฤษภาคม";
    } else if (data === '06') {
      return "มิถุนายน";
    } else if (data === '07') {
      return "กรกฎาคม";
    } else if (data === '08') {
      return "สิงหาคม";
    } else if (data === '09') {
      return "กันยายน";
    } else if (data === '10') {
      return "ตุลาคม";
    } else if (data === '11') {
      return "พฤศจิกายน";
    } else if (data === '12') {
      return "ธันวาคม";
    }
  } else if (type === 'year') {
    if (data === '00') {
      return "ทั้งหมด";
    } else {
      return data;
    }
  }
}
module.exports = router;
