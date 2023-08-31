// apiuser.js - เส้นทาง API สำหรับผู้ใช้งาน

const express = require('express');
const router = express.Router();
const qr = require('qrcode');
const cors = require('cors');
const generatePayload = require('promptpay-qr');
const fileUpload = require('express-fileupload');
router.use(fileUpload());
const path = require('path');
router.use(cors()); // เปิดใช้งาน CORS สำหรับทุกเส้นทางใน Router
router.use(express.json()); // เปิดใช้งาน middleware ในการแปลง JSON สำหรับทุกเส้นทางใน Router
const axios = require('axios');
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin:0982846992@cluster0.qvuui0g.mongodb.net/?retryWrites=true&w=majority";


// POST /user/create
router.post('/create', async (req, res) => {
    const data = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().split('T')[0];
    var date = new Date(formattedDate);
    var now_year = date.getFullYear();
    var now_month = (date.getMonth() + 1).toString().padStart(2, '0');
    var now_day = date.getDate();


    const datas = await client.db('home_rental').collection('customer').aggregate([
        {
            $lookup: {
                from: 'room',
                localField: 'cus_room_id',
                foreignField: 'room_id',
                as: 'roomData'
            }
        },
        { $unwind: '$roomData' }
    ]).toArray();


    for (const value of datas) {

        const check_payment = await client.db('home_rental').collection('payment').findOne({ pay_cus_id: value.cus_id, pay_cus_round: { $eq: now_month } }, { sort: { pay_id: -1 } });

        if (check_payment === null) {

            const check_round_pay_date = await client.db('home_rental').collection('payment').findOne({ pay_cus_id: value.cus_id }, { sort: { pay_id: -1 } });
            console.log(check_round_pay_date);

            if (check_round_pay_date === null) {
                var date_cus = new Date(value.cus_datein);
                var cus_year = date_cus.getFullYear();
                var cus_month = (date_cus.getMonth() + 1).toString().padStart(2, '0');
                var cus_day = date_cus.getDate().toString().padStart(2, '0');
                var cus_month_pay = (date_cus.getMonth() + 2).toString().padStart(2, '0');
                var datefull_round = cus_year + '-' + cus_month_pay + '-' + cus_day;
            } else {
                var date_round = new Date(check_round_pay_date.pay_round);
                var date_round_year = date_round.getFullYear();
                var date_round_month = (date_round.getMonth() + 2).toString().padStart(2, '0');
                var date_round_day = date_round.getDate().toString().padStart(2, '0');
                var datefull_round = date_round_year + '-' + date_round_month + '-' + date_round_day;
            }
            if (parseInt(now_day) >= 1 && parseInt(cus_month) !== parseInt(now_month)) {
                const latestPayment = await client.db('home_rental').collection('payment').findOne({}, { sort: { pay_id: -1 } });

                if (!latestPayment) {
                    var lastpay_id = 1;
                } else {
                    var lastpay_id = latestPayment.pay_id + 1;
                }
                var datax = await client.db('home_rental').collection('payment').insertOne({
                    pay_id: lastpay_id,
                    pay_cus_id: value.cus_id,
                    pay_cus_name: value.cus_name,
                    pay_cus_room_id: value.cus_room_id,
                    pay_cus_room_name_full: value.roomData.room_name + " " + value.roomData.room_typename,
                    pay_cus_room_price: value.cus_room_price,
                    pay_room_bin_price: value.roomData.room_bin_price,
                    pay_cus_room_guarantee: value.cus_room_guarantee,
                    pay_cus_room_advance: value.cus_room_advance,
                    pay_room_water: value.roomData.room_water,
                    pay_room_electricity: value.roomData.room_electricity,
                    pay_cus_room_sum: value.cus_room_sum,
                    pay_cus_round: now_month,
                    pay_cus_datein: value.cus_datein,
                    pay_round: datefull_round,
                    pay_room_meter_water_before: value.roomData.room_meter_water,
                    pay_room_meter_electricity_before: value.roomData.room_meter_electricity,
                    pay_meter_water_after: 0,
                    pay_meter_electricity_after: 0,
                    pay_price_water: 0,
                    pay_price_electricity: 0,
                    pay_price_fine: 0,
                    pay_price_total: value.cus_room_price + value.roomData.room_bin_price,
                    update_date: "",
                    update_by: "",
                    pay_date: "",
                    pay_by: "",
                    pay_pic: "",
                    pay_status: -1,
                });




            }

        };
    };

    await client.close();
    res.status(200).send(datax);
});

router.get('/qr_code', async (req, res) => {
    const gen_amount = req.query.amount_pay;
    const arr_room_sum = gen_amount.split(',');
    if (arr_room_sum.length > 1) {
        var data_gen_amount = parseInt(gen_amount.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_gen_amount = parseInt(gen_amount); // เอาแต่ตัวเลข

    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const data = await client.db('home_rental').collection('prompay').findOne({ pp_status: 1 });
        if (data.length === 0) {
            return res.status(404).send('prompay not found');
        }

        const mobilenumber = data.pp_number;
        const amount = data_gen_amount;
        const ownerName = data.pp_username + ' ' + data.pp_lastname;


        const promptpayUrl = generatePayload(mobilenumber, { amount });

        const options = {
            color: {
                dark: '#000',
                light: '#fff'
            }
        };

        qr.toDataURL(promptpayUrl, options, (err, qrData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred');
            }

            res.send({ qrData, ownerName, amount });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    } finally {
        await client.close();
    }
});
router.get('/edit', async (req, res) => {
    const id = parseInt(req.query.pay_id); // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('home_rental').collection('payment').find({ pay_id: id }).toArray();
    await client.close();
    res.status(200).send(users);
});
router.delete('/delete', async (req, res) => {
    const id = parseInt(req.query.pay_id); // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('home_rental').collection('payment').deleteOne({ pay_id: id });
    await client.close();
    res.status(200).send(users);
});

router.put('/save', async (req, res) => {
    const id = parseInt(req.query.pay_id); // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('home_rental').collection('payment').find({ pay_id: id }).toArray();
    await client.close();
    res.status(200).send(users);
});
router.put('/update', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const data = req.body; // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'

    const filter = { pay_id: data.pay_id };
    const arr_room_price = data.pay_cus_room_price.split(',');
    const arr_pay_price_fine = data.pay_price_fine.split(',');
    const arr_room_meter_water_before = data.pay_room_meter_water_before.split(',');
    const arr_room_meter_water_after = data.pay_meter_water_after.split(',');
    const arr_price_water = data.pay_price_water.split(',');
    const arr_room_meter_electricity_before = data.pay_room_meter_electricity_before.split(',');
    const arr_room_meter_electricity_after = data.pay_meter_electricity_after.split(',');
    const arr_price_electricity = data.pay_price_electricity.split(',');
    const arr_room_bin = data.pay_room_bin_price.split(',');
    const arr_price_total = data.pay_price_total.split(',');


    //  ข้อมูลช่องค่าห้อง
    if (arr_room_price.length > 1) {
        var data_pay_cus_room_price = parseInt(data.pay_cus_room_price.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_pay_cus_room_price = parseInt(data.pay_cus_room_price); // เอาแต่ตัวเลข
    }
    //  ค่าปรับ
    if (arr_pay_price_fine.length > 1) {
        var data_pay_price_fine = parseInt(data.pay_price_fine.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_pay_price_fine = parseInt(data.pay_price_fine); // เอาแต่ตัวเลข
    }

    //มิตเตอร์น้ำก่อนหน้า
    if (arr_room_meter_water_before.length > 1) {
        var data_room_meter_water_before = parseInt(data.pay_room_meter_water_before.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_room_meter_water_before = parseInt(data.pay_room_meter_water_before); // เอาแต่ตัวเลข
    }
    //มิตเตอร์น้ำล่าสุด
    if (arr_room_meter_water_after.length > 1) {
        var data_room_meter_water_after = parseInt(data.pay_meter_water_after.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_room_meter_water_after = parseInt(data.pay_meter_water_after); // เอาแต่ตัวเลข
    }

    //  ค่าน้ำ
    if (arr_price_water.length > 1) {
        var data_room_water_price = parseInt(data.pay_price_water.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_room_water_price = parseInt(data.pay_price_water); // เอาแต่ตัวเลข
    }

    //  มิตเตอร์ไฟฟ้าก่อนหน้า
    if (arr_room_meter_electricity_before.length > 1) {
        var data_room_meter_electricity_before = parseInt(data.pay_room_meter_electricity_before.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_room_meter_electricity_before = parseInt(data.pay_room_meter_electricity_before); // เอาแต่ตัวเลข
    }
    //  มิตเตอร์ไฟฟ้าล่าสุด
    if (arr_room_meter_electricity_after.length > 1) {
        var data_room_meter_electricity_after = parseInt(data.pay_meter_electricity_after.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_room_meter_electricity_after = parseInt(data.pay_meter_electricity_after); // เอาแต่ตัวเลข
    }
    //  ค่าไฟ
    if (arr_price_electricity.length > 1) {
        var data_price_electricity = parseInt(data.pay_price_electricity.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_price_electricity = parseInt(data.pay_price_electricity); // เอาแต่ตัวเลข
    }
    //  ข้อมูลช่องค่าขยะ
    if (arr_room_bin.length > 1) {
        var data_pay_room_bin_price = parseInt(data.pay_room_bin_price.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_pay_room_bin_price = parseInt(data.pay_room_bin_price);
    }
    //  ยอดที่ต้องชำระ
    if (arr_price_total.length > 1) {
        var data_pay_price_total = parseInt(data.pay_price_total.replace(/,/g, '')); // เอาแต่ตัวเลข
    } else {
        var data_pay_price_total = parseInt(data.pay_price_total); // เอาแต่ตัวเลข
    }
    var datenow = new Date();

    // var usersession = JSON.parse(sessionStorage.getItem('user'));

    if (data.typebutton === "save") {
        var data_pay_status = 0;
        var updateDocument = {
            $set: {
                pay_cus_room_price: data_pay_cus_room_price,
                pay_price_fine: data_pay_price_fine,
                pay_room_meter_water_before: data_room_meter_water_before,
                pay_meter_water_after: data_room_meter_water_after,
                pay_price_water: data_room_water_price,
                pay_room_meter_electricity_before: data_room_meter_electricity_before,
                pay_meter_electricity_after: data_room_meter_electricity_after,
                pay_price_electricity: data_price_electricity,
                pay_room_bin_price: data_pay_room_bin_price,
                pay_price_total: data_pay_price_total,
                update_date: datenow,
                update_by: data.session_name,
                pay_by: data.session_name,
                pay_status: data_pay_status,
            }
        };

    } else if (data.typebutton === "examine") {
        var data_pay_status = 1;
        var updateDocument = {
            $set: {
                pay_cus_room_price: data_pay_cus_room_price,
                pay_price_fine: data_pay_price_fine,
                pay_room_meter_water_before: data_room_meter_water_before,
                pay_meter_water_after: data_room_meter_water_after,
                pay_price_water: data_room_water_price,
                pay_room_meter_electricity_before: data_room_meter_electricity_before,
                pay_meter_electricity_after: data_room_meter_electricity_after,
                pay_price_electricity: data_price_electricity,
                pay_room_bin_price: data_pay_room_bin_price,
                pay_price_total: data_pay_price_total,
                update_date: datenow,
                update_by: data.session_name,
                pay_date: datenow,
                pay_by: data.session_name,
                pay_status: data_pay_status,
            }
        };
    } else if (data.typebutton === "paymoney") {
        var data_pay_status = 2;
        var updateDocument = {
            $set: {
                pay_cus_room_price: data_pay_cus_room_price,
                pay_price_fine: data_pay_price_fine,
                pay_room_meter_water_before: data_room_meter_water_before,
                pay_meter_water_after: data_room_meter_water_after,
                pay_price_water: data_room_water_price,
                pay_room_meter_electricity_before: data_room_meter_electricity_before,
                pay_meter_electricity_after: data_room_meter_electricity_after,
                pay_price_electricity: data_price_electricity,
                pay_room_bin_price: data_pay_room_bin_price,
                pay_price_total: data_pay_price_total,
                update_date: datenow,
                update_by: data.session_name,
                pay_date: datenow,
                pay_by: data.session_name,
                pay_status: data_pay_status,
            }
        };
        const res_room = await client.db('home_rental').collection('payment').findOne({ pay_id: data.pay_id }, { sort: { pay_id: -1 } });
        const filter_room = { room_id: res_room.pay_cus_room_id };
        var updatemeter_room = {
            $set: {
                room_meter_water: data_room_meter_water_after,
                room_meter_electricity: data_room_meter_electricity_after,
            }
        };
        await client.db('home_rental').collection('room').updateOne(filter_room, updatemeter_room);
    }

    await client.db('home_rental').collection('payment').updateOne(filter, updateDocument);
    await client.close();
    res.status(200).json({
        data_pay_status: data_pay_status,
        pay_date: datenow
    });


});
// GET /user
router.get('/', async (req, res) => {
    const cus_id = parseInt(req.query.user_cus_id);


    const cus_id_nan = Number.isNaN(cus_id)
    const client = new MongoClient(uri);
    await client.connect();


    if (cus_id !== "" && cus_id_nan == false) {
        var data = await client.db('home_rental').collection('payment').aggregate([
            {
                $match: { pay_cus_id: cus_id } // เลือกเอกสารที่ pay_cus_id เท่ากับ 2
            },
            {
                $lookup: {
                    from: 'room',
                    localField: 'pay_cus_room_id',
                    foreignField: 'room_id',
                    as: 'roomData'
                }
            },
            {
                $unwind: '$roomData'
            },
            {
                $sort: {
                    pay_status: 1 // 1 คือเรียงจากน้อยไปมาก
                }
            }
        ]).toArray();


    } else {
        var data = await client.db('home_rental').collection('payment').aggregate([
            {
                $lookup: {
                    from: 'room',
                    localField: 'pay_cus_room_id',
                    foreignField: 'room_id',
                    as: 'roomData'
                }
            },
            {
                $unwind: '$roomData'
            },
            {
                $sort: {
                    pay_status: 1 // 1 คือเรียงจากน้อยไปมาก
                }
            }
        ]).toArray();


    }


    await client.close();
    res.status(200).send(data);
});
router.post('/notify', async (req, res) => {
    const LINE_NOTIFY_API_URL = 'https://notify-api.line.me/api/notify';
    const LINE_NOTIFY_ACCESS_TOKEN = 'f8Qh0NgsqcDLmbJvQS1qhN7nWoiBVBuHGBWm3DMoM5Q'; // ใส่ Access Token ที่คุณได้รับจาก Line Notify ที่นี่

    try {
        const message = req.body.message; // รับข้อความที่ส่งมาจาก client ผ่าน request body
        const response = await axios({
            method: "POST",
            url: LINE_NOTIFY_API_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + LINE_NOTIFY_ACCESS_TOKEN,
            },
            data: "message=" + message,
        });
        console.log("notify response", response.data);
        res.send("Line Notify sent successfully!"); // ส่งข้อความกลับไปยัง client
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to send Line Notify"); // ส่งข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
    }
});
router.put('/pic_bin', async (req, res) => {

    if (!req.files || !req.files.file) {
        return res.status(400).send('No image file uploaded');
    }
    const id = req.query.pay_id;
    const imageFile = req.files.file;
    const fileName = `qr_${id}.jpg`; // ชื่อไฟล์ที่ผสมระหว่าง "qr_", ตัวเลขรัน, และชื่อไฟล์เดิม
    const uploadPath = path.join(__dirname, 'images', fileName); // ตำแหน่งในเครื่องเซิร์ฟเวอร์
    const filter = { pay_id: parseInt(id) };
    console.log(filter);
    try {
        await imageFile.mv(uploadPath);

        var updateDocument = {
            $set: {
                pay_pic: fileName,

            }
        };

        const client = new MongoClient(uri);
        await client.connect();
        await client.db('home_rental').collection('payment').updateOne(filter, updateDocument);
        await client.close();

        res.send('Image uploaded successfully');
    } catch (err) {
        console.error('Error saving image file:', err);
        res.status(500).send('Failed to save image file: ' + err);
    }

});



router.get('/pic_bin/file', async (req, res) => {
    const fileName = req.query.fileName;
    const imagePath = path.join(__dirname, 'images', fileName); // เปลี่ยนเป็น 'backend_images' หรือโฟลเดอร์ที่เก็บรูปภาพของคุณ
    res.sendFile(imagePath);
});

module.exports = router;
