// apiuser.js - เส้นทาง API สำหรับผู้ใช้งาน

const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors()); // เปิดใช้งาน CORS สำหรับทุกเส้นทางใน Router
router.use(express.json()); // เปิดใช้งาน middleware ในการแปลง JSON สำหรับทุกเส้นทางใน Routerฃ
const axios = require('axios');
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin:0982846992@cluster0.qvuui0g.mongodb.net/?retryWrites=true&w=majority";

// POST /user/create

router.post('/create', async (req, res) => {

  const data = req.body;
  const status = parseInt(data.cus_status);
  const cus_room_id = parseInt(data.cus_room_id);

  const arr_room_bin = data.cus_room_bin_price.split(',');
  const arr_room_price = data.cus_room_price.split(',');
  const arr_room_guarantee = data.cus_room_guarantee.split(',');
  const arr_room_advance = data.cus_room_advance.split(',');
  const arr_room_electricity = data.cus_room_electricity.split(',');
  const arr_room_water = data.cus_room_water.split(',');
  const arr_room_sum = data.cus_room_sum.split(',');


  //  ข้อมูลช่องค่าห้อง
  if (arr_room_price.length > 1) {
    var data_room_price = parseInt(data.cus_room_price.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_price = parseInt(data.cus_room_price); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าขยะ
  if (arr_room_bin.length > 1) {
    var data_room_bin_price = parseInt(data.cus_room_bin_price.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_bin_price = parseInt(data.cus_room_bin_price);

  }

  //  ข้อมูลช่องประกัน
  if (arr_room_guarantee.length > 1) {
    var data_room_guarantee = parseInt(data.cus_room_guarantee.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_guarantee = parseInt(data.cus_room_guarantee); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่ามัดจำล่วงหน้า
  if (arr_room_advance.length > 1) {
    var data_room_advance = parseInt(data.cus_room_advance.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_advance = parseInt(data.cus_room_advance); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าน้ำ
  if (arr_room_water.length > 1) {
    var data_room_water = parseInt(data.cus_room_water.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_water = parseInt(data.cus_room_water); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าไฟฟ้า
  if (arr_room_electricity.length > 1) {
    var data_room_electricity = parseInt(data.cus_room_electricity.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_electricity = parseInt(data.cus_room_electricity); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องยอดที่ต้องชำระ
  if (arr_room_sum.length > 1) {
    var data_room_sum = parseInt(data.cus_room_sum.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_sum = parseInt(data.cus_room_sum); // เอาแต่ตัวเลข

  }
  var date_cus = new Date(data.cus_datein);
  var cus_round = (date_cus.getMonth() + 1).toString().padStart(2, '0');

  const client = new MongoClient(uri);

  await client.connect();
  await client.db('home_rental').collection('customer').insertOne({
    cus_id: data.cus_id,
    cus_name: data.cus_name,
    cus_id_card: data.cus_id_card,
    cus_tel: data.cus_tel,
    cus_room_id: cus_room_id,
    cus_room_price: data_room_price,
    cus_room_bin_price: data_room_bin_price,
    cus_room_guarantee: data_room_guarantee,
    cus_room_advance: data_room_advance,
    cus_room_water: data_room_water,
    cus_room_electricity: data_room_electricity,
    cus_room_sum: data_room_sum,
    cus_status: status,
    cus_datein: data.cus_datein,
    cus_round: cus_round,


  });

  const filter = { room_id: cus_room_id };
  const update_status_room = {
    $set: {
      room_status: 2,
    }
  };

const checkLastUserId = await client
  .db('home_rental')
  .collection('user')
  .find()
  .sort({ user_id: -1 })
  .limit(1)
  .toArray();

let runUserId = 1; // ค่าเริ่มต้นหากไม่มี user_id ที่มากที่สุด

if (checkLastUserId.length > 0) {
  runUserId = checkLastUserId[0].user_id + 1;
}
  const datauser = await client.db('home_rental').collection('user').insertOne({
    user_id: runUserId,
    user_cus_id: data.cus_id,
    user_name: data.cus_name,
    user_username: data.cus_id_card,
    user_password: data.cus_tel,
    user_status: "user",
  });

  await client.db('home_rental').collection('room').updateOne(filter, update_status_room);
  await client.close();

  res.status(200).send({
    "status": "ok",
    "message": "data with ID = " + data.id + " is created",
    "data": data,
    "datauser": datauser
  });
});



router.put('/update', async (req, res) => {
  const data = req.body;
  const status = parseInt(data.edit_cus_status);
  const room_id_new = parseInt(data.edit_cus_room_id);
  const edit_cus_id = data.edit_cus_id;

  const filter_room = { room_id: room_id_new };

  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db('home_rental').collection('customer').findOne({ cus_id: edit_cus_id });
  let room_id_old = parseInt(users.cus_room_id);

  let filter_old = { room_id: room_id_old };
  if (status === 1 && room_id_old !== room_id_new) {
    // อัพเดทข้อมูลใน เทเบิล room เมื่อเปลี่ยนเลขห้องขณะ สถานะเป็นพักอาศัย ให้ห้องใหม่มีสถานะไม่ว่าง แต่ห้องเก่ามีสถานะว่าง
    const update_status_room_new = {
      $set: {
        room_status: 2,
      }
    };
    const update_status_room_old = {
      $set: {
        room_status: 1,
      }
    };
    await client.db('home_rental').collection('room').updateOne(filter_room, update_status_room_new);
    await client.db('home_rental').collection('room').updateOne(filter_old, update_status_room_old);

  } else if (status === 2 && room_id_old !== room_id_new) {
    // อัพเดทข้อมูลใน เทเบิล room ให้กำหนดค่าห้องที่เปลี่ยนสถานะเป็นออกกลับมาเลือกได้ 
    const update_status_room_new = {
      $set: {
        room_status: 1,
      }
    };
    const update_status_room_old = {
      $set: {
        room_status: 1,
      }
    };
    await client.db('home_rental').collection('room').updateOne(filter_room, update_status_room_new);
    await client.db('home_rental').collection('room').updateOne(filter_old, update_status_room_old);

  } else if (status === 1 && room_id_old === room_id_new) {
    // อัพเดทข้อมูลใน เทเบิล room ให้กำหนดค่าห้องที่เปลี่ยนสถานะเป็นออกเป็นพักอาศัยห้องก็จะเต็ม
    const update_status_room_new = {
      $set: {
        room_status: 2,
      }
    };
    await client.db('home_rental').collection('room').updateOne(filter_room, update_status_room_new);

  } else if (status === 2 && room_id_old === room_id_new) {
    // อัพเดทข้อมูลใน เทเบิล room ให้กำหนดค่าห้องที่เปลี่ยนสถานะเป็นออกกลับมาเลือกได้ 
    const update_status_room_new = {
      $set: {
        room_status: 1,
      }
    };
    await client.db('home_rental').collection('room').updateOne(filter_room, update_status_room_new);
  }

  const arr_room_bin = data.edit_cus_room_bin_price.split(',');
  const arr_room_price = data.edit_cus_room_price.split(',');
  const arr_room_guarantee = data.edit_cus_room_guarantee.split(',');
  const arr_room_advance = data.edit_cus_room_advance.split(',');
  const arr_room_electricity = data.edit_cus_room_electricity.split(',');
  const arr_room_water = data.edit_cus_room_water.split(',');
  const arr_room_sum = data.edit_cus_room_sum.split(',');
  //  ข้อมูลช่องค่าห้อง
  if (arr_room_price.length > 1) {
    var data_room_price = parseInt(data.edit_cus_room_price.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_price = parseInt(data.edit_cus_room_price); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าขยะ
  if (arr_room_bin.length > 1) {
    var data_room_bin_price = parseInt(data.edit_cus_room_bin_price.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_bin_price = parseInt(data.edit_cus_room_bin_price);

  }

  //  ข้อมูลช่องประกัน
  if (arr_room_guarantee.length > 1) {
    var data_room_guarantee = parseInt(data.edit_cus_room_guarantee.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_guarantee = parseInt(data.edit_cus_room_guarantee); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่ามัดจำล่วงหน้า
  if (arr_room_advance.length > 1) {
    var data_room_advance = parseInt(data.edit_cus_room_advance.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_advance = parseInt(data.edit_cus_room_advance); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าน้ำ
  if (arr_room_water.length > 1) {
    var data_room_water = parseInt(data.edit_cus_room_water.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_water = parseInt(data.edit_cus_room_water); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องค่าไฟฟ้า
  if (arr_room_electricity.length > 1) {
    var data_room_electricity = parseInt(data.edit_cus_room_electricity.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_electricity = parseInt(data.edit_cus_room_electricity); // เอาแต่ตัวเลข

  }
  //  ข้อมูลช่องยอดที่ต้องชำระ
  if (arr_room_sum.length > 1) {
    var data_room_sum = parseInt(data.edit_cus_room_sum.replace(/,/g, '')); // เอาแต่ตัวเลข
  } else {
    var data_room_sum = parseInt(data.edit_cus_room_sum); // เอาแต่ตัวเลข

  }
  // อัพเดทข้อมูลใน เทเบิล customer 
  const filter_cus = { cus_id: edit_cus_id };
  const updateDocument = {
    $set: {
      cus_name: data.edit_cus_name,
      cus_id_card: data.edit_cus_id_card,
      cus_tel: data.edit_cus_tel,
      cus_room_id: room_id_new,
      cus_room_price: data_room_price,
      cus_room_advance: data_room_advance,
      cus_room_guarantee: data_room_guarantee,
      cus_room_water: data_room_water,
      cus_room_electricity: data_room_electricity,
      cus_room_bin_price: data_room_bin_price,
      cus_room_sum: data_room_sum,
      cus_status: status,
      cus_datein: data.edit_cus_datein,
    }
  };

  await client.db('home_rental').collection('customer').updateOne(filter_cus, updateDocument);
  



  const filter_user_cus_id = { user_cus_id: data.edit_user_cus_id };
  const update_user = {
    $set: {
      user_cus_id: data.edit_cus_id,
      user_name: data.edit_cus_name,
      user_username: data.edit_cus_id_card,
      user_password: data.edit_cus_tel,
    }
  };
  await client.db('home_rental').collection('user').updateOne(filter_user_cus_id, update_user);
  


  res.status(200).send({
    "status": "ok",
    "message": "User with ID = " + data.id + " is updated",
    "data": data,
    "data_user": update_user
  });


});

// GET /user
router.get('/', async (req, res) => {




  const client = new MongoClient(uri);
  await client.connect();


  const id = parseInt(req.query.cus_id); // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'
  const id_nan = Number.isNaN(id)

  const check_str = req.query.cus_id; // ส่งค่า room_id สูงสุดไปหน้า fontend
  if (check_str === "fetch_cus_id_last") {
    var data = await client.db('home_rental').collection('customer').find().sort({ cus_id: -1 }).limit(1).toArray();
  } else if (id !== "" && id_nan !== true) {
    var data = await client.db('home_rental').collection('customer').findOne({ cus_id: id });
  } else {
    var data = await client.db('home_rental').collection('customer').find({}).toArray();
  }

  await client.close();
  res.status(200).send(data);


});
router.get('/edit', async (req, res) => {
  const id = parseInt(req.query.cus_id); // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db('home_rental')
    .collection('customer')
    .aggregate([
      {
        $match: { cus_id: id } // ค้นหาลูกค้าที่มี cus_id ตามที่กำหนด
      },
      {
        $lookup: {
          from: 'user', // ชื่อคอลเลกชันที่ต้องการ join
          localField: 'cus_id', // ฟิลด์ที่ใช้ในคอลเลกชันปัจจุบัน (customer)
          foreignField: 'user_cus_id', // ฟิลด์ที่ใช้ในคอลเลกชันที่จะ join (user)
          as: 'user_data' // ชื่อของ field ที่จะเก็บข้อมูลหลังจาก join
        }
      }
    ])
    .toArray();
  await client.close();
  res.status(200).send(users);
});

router.delete('/delete', async (req, res) => {


  const id = req.query.cus_id; // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'
  const id_cus = parseInt(id);


  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db('home_rental').collection('customer').findOne({ cus_id: id_cus });
  const room_ids = parseInt(users.cus_room_id);

  if (users.cus_status === 1) {
    console.log(users.cus_status);

    const filter = { room_id: room_ids };
    const update_status_room = {
      $set: {
        room_status: 1,
      }
    };

    await client.db('home_rental').collection('room').updateOne(filter, update_status_room);
  }
  try {
    const db = client.db('home_rental');
    const collection = db.collection('customer');
    const result = await collection.deleteOne({ cus_id: id_cus });
    await client.close();



    if (result.deletedCount === 1) {
      res.status(200).send({
        "status": "ok",
        "message": `ลบเอกสารที่มี cus_id เท่ากับ ${id} เรียบร้อยแล้ว`,
        "data": result
      });
    } else {
      res.status(404).send({
        "status": "not found",
        "message": `ไม่พบเอกสารที่มี cus_id เท่ากับ ${id}`
      });
    }
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
