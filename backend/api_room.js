// apiuser.js - เส้นทาง API สำหรับผู้ใช้งาน

const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors()); // เปิดใช้งาน CORS สำหรับทุกเส้นทางใน Router
router.use(express.json()); // เปิดใช้งาน middleware ในการแปลง JSON สำหรับทุกเส้นทางใน Router
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin:0982846992@cluster0.qvuui0g.mongodb.net/?retryWrites=true&w=majority";




// POST /user/create
router.post('/create', async (req, res) => {
  const client = new MongoClient(uri);
  const data = req.body;
  const arr_room_bin = data.room_bin_price.split(',');
  const arr_room_price = data.room_price.split(',');
  const arr_room_guarantee = data.room_guarantee.split(',');
  const arr_room_advance = data.room_advance.split(',');
  const arr_room_electricity = data.room_electricity.split(',');
  const arr_room_meter_electricity = data.room_meter_electricity.split(',');
  const arr_room_water = data.room_water.split(',');
  const arr_room_meter_water = data.room_meter_water.split(',');

  //  ข้อมูลช่องค่าขยะ
  if (arr_room_bin.length > 1) {
    var data_room_bin_price = parseInt(data.room_bin_price.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_bin_price = parseInt(data.room_bin_price);

  }
  //  ข้อมูลช่องค่าห้อง
  if (arr_room_price.length > 1) {
    var data_room_price = parseInt(data.room_price.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_price = parseInt(data.room_price); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องประกัน
  if (arr_room_guarantee.length > 1) {
    var data_room_guarantee = parseInt(data.room_guarantee.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_guarantee = parseInt(data.room_guarantee); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่ามัดจำล่วงหน้า
  if (arr_room_advance.length > 1) {
    var data_room_advance = parseInt(data.room_advance.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_advance = parseInt(data.room_advance); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าน้ำ
  if (arr_room_water.length > 1) {
    var data_room_water = parseInt(data.room_water.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_water = parseInt(data.room_water); // เอาแต่ตัวเลข

  }
  //มิตเตอร์
  if (arr_room_meter_water.length > 1) {
    var data_room_meter_water = parseInt(data.room_meter_water.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_meter_water = parseInt(data.room_meter_water); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าไฟฟ้า
  if (arr_room_electricity.length > 1) {
    var data_room_electricity = parseInt(data.room_electricity.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_electricity = parseInt(data.room_electricity); // เอาแต่ตัวเลข

  }
  //  มิตเตอร์ไฟฟ้า
  if (arr_room_meter_electricity.length > 1) {
    var data_room_meter_electricity = parseInt(data.room_meter_electricity.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_meter_electricity = parseInt(data.room_meter_electricity); // เอาแต่ตัวเลข

  }

  const status = parseInt(data.room_status);
  await client.connect();
  await client.db('home_rental').collection('room').insertOne({
    room_id: data.room_id,
    room_typename: data.room_typename,
    room_name: data.room_name,
    room_bin_price: data_room_bin_price,
    room_price: data_room_price,
    room_guarantee: data_room_guarantee,
    room_advance: data_room_advance,
    room_water: data_room_water,
    room_electricity: data_room_electricity,
    room_status: status,
    room_meter_water: data_room_meter_water,
    room_meter_electricity: data_room_meter_electricity,
  });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "data with ID = " + data.id + " is created",
    "data": data
  });
});
router.put('/update', async (req, res) => {
  const data = req.body;
  const status = parseInt(data.edit_room_status);
  const edit_room_id = data.edit_room_id; // ควรมีตัวแปร edit_room_id ก่อนใช้งาน
  const filter = { room_id: edit_room_id };
  const arr_room_bin = data.edit_room_bin_price.split(',');
  const arr_room_price = data.edit_room_price.split(',');
  const arr_room_guarantee = data.edit_room_guarantee.split(',');
  const arr_room_advance = data.edit_room_advance.split(',');
  const arr_room_electricity = data.edit_room_electricity.split(',');
  const arr_room_meter_electricity = data.edit_room_meter_electricity.split(',');
  const arr_room_water = data.edit_room_water.split(',');
  const arr_room_meter_water = data.edit_room_meter_water.split(',');

  //  ข้อมูลช่องค่าขยะ
  if (arr_room_bin.length > 1) {
    var data_room_bin_price = parseInt(data.edit_room_bin_price.replace(/,/g, '')); // เอาแต่ตัวเลข

  } else {
    var data_room_bin_price = parseInt(data.edit_room_bin_price);

  }
  //  ข้อมูลช่องค่าห้อง
  if (arr_room_price.length > 1) {
    var data_room_price = parseInt(data.edit_room_price.replace(/,/g, '')); // เอาแต่ตัวเลข

  } else {
    var data_room_price = parseInt(data.edit_room_price); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องประกัน
  if (arr_room_guarantee.length > 1) {
    var data_room_guarantee = parseInt(data.edit_room_guarantee.replace(/,/g, '')); // เอาแต่ตัวเลข

  } else {
    var data_room_guarantee = parseInt(data.edit_room_guarantee); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่ามัดจำล่วงหน้า
  if (arr_room_advance.length > 1) {
    var data_room_advance = parseInt(data.edit_room_advance.replace(/,/g, '')); // เอาแต่ตัวเลข

  } else {
    var data_room_advance = parseInt(data.edit_room_advance); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าน้ำ
  if (arr_room_water.length > 1) {
    var data_room_water = parseInt(data.edit_room_water.replace(/,/g, '')); // เอาแต่ตัวเลข

  } else {
    var data_room_water = parseInt(data.edit_room_water); // เอาแต่ตัวเลข

  }

  //มิตเตอร์
  if (arr_room_meter_water.length > 1) {
    var data_room_meter_water = parseInt(data.edit_room_meter_water.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_meter_water = parseInt(data.edit_room_meter_water); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าไฟฟ้า
  if (arr_room_electricity.length > 1) {
    var data_room_electricity = parseInt(data.edit_room_electricity.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_electricity = parseInt(data.edit_room_electricity); // เอาแต่ตัวเลข

  }
  //  มิตเตอร์ไฟฟ้า
  if (arr_room_meter_electricity.length > 1) {
    var data_room_meter_electricity = parseInt(data.edit_room_meter_electricity.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_meter_electricity = parseInt(data.edit_room_meter_electricity); // เอาแต่ตัวเลข

  }

  const updateDocument = {
    $set: {
      room_typename: data.edit_room_typename,
      room_name: data.edit_room_name,
      room_bin_price: data_room_bin_price,
      room_price: data_room_price,
      room_guarantee: data_room_guarantee,
      room_advance: data_room_advance,
      room_water: data_room_water,
      room_electricity: data_room_electricity,
      room_status: status,
      room_meter_water: data_room_meter_water,
      room_meter_electricity: data_room_meter_electricity,
    }
  };
  const client = new MongoClient(uri);
  await client.connect();
  try {

    const database = client.db('home_rental');
    const collection = database.collection('room');
    const result = await collection.updateOne(filter, updateDocument);
    console.log(`${result.modifiedCount} document updated`);
    res.status(200).send({
      "status": "ok",
      "message": "data with ID = " + data.id + " is updated",
      "data": data
    });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).send({
      "status": "error",
      "message": "Failed to update data",
      "error": error
    });
  } finally {
    client.close();
  }
});

// GET /data

router.get('/', async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();


  const id = parseInt(req.query.room_id); // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'
  const id_nan = Number.isNaN(id)

  const check_str = req.query.room_id; // ส่งค่า room_id สูงสุดไปหน้า fontend
  if (check_str === "fetch_room_id_last") {
    var data = await client.db('home_rental').collection('room').find().sort({ room_id: -1 }).limit(1).toArray();
  } else if (id !== "" && id_nan !== true) {
    var data = await client.db('home_rental').collection('room').findOne({ room_id: id });
  } else {
    var data = await client.db('home_rental').collection('room').find({
      $or: [
        { room_status: 1 },
        { room_status: 2 }
      ]
    }).toArray();
    data.sort((a, b) => {
      if (parseInt(a.room_typename) !== parseInt(b.room_typename)) {
        return parseInt(a.room_typename) - parseInt(b.room_typename);
      } else {
        return a.room_name.localeCompare(b.room_name);
      }
    });

  }
  await client.close();
  res.status(200).send(data);
});
router.get('/edit', async (req, res) => {
  const id = parseInt(req.query.room_id); // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'

  const client = new MongoClient(uri);
  await client.connect();
  const data = await client.db('home_rental').collection('room').find({ room_id: id }).toArray();
  await client.close();
  res.status(200).send(data);
});

router.delete('/delete', async (req, res) => {
  const client = new MongoClient(uri);
  const id = req.query.room_id; // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'
  const id_room = parseInt(id);

  try {
    await client.connect();

    const update_status = {
      $set: {
        room_status: 2
      }
    };
    const filter = { room_id: id_room };
    const database = client.db('home_rental');
    const collection = database.collection('room');
    const result = await collection.updateOne(filter, update_status);
    console.log(`${result.modifiedCount} document updated`);
    res.status(200).send({
      "status": "ok",
      "message": "data with ID = " + id_room + " is updated",
      "data": result
    });

  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการลบเอกสาร:', err);
    res.status(500).send({
      "status": "error",
      "message": "เกิดข้อผิดพลาดในการลบเอกสาร"
    });
  } finally {
    await client.close();
  }
});




module.exports = router;
