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
  const data = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  const datain = await client.db('home_rental').collection('user').insertOne({
    user_id: data.user_id,
    user_name: data.user_name,
    user_username: data.user_username,
    user_password: data.user_password,
    user_status: data.user_status,
    user_usage: 1,
  });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = " + data.user_id + " is created",
    "data": datain
  });
});

router.put('/update', async (req, res) => {
  const data = req.body;


  const filter = { user_id: data.edit_user_id };
  const data_user_usage = parseInt(data.edit_user_usage);
  const updateDocument = {
    $set: {
      user_name: data.edit_user_name,
      user_username: data.edit_user_username,
      user_password: data.edit_user_password,
      user_status: data.edit_user_status,
      user_usage: data_user_usage,
    }
  };
  console.log(filter);
  console.log(updateDocument);
  const client = new MongoClient(uri);
  await client.connect();
  try {

    const database = client.db('home_rental');
    const collection = database.collection('user');
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
router.delete('/delete', async (req, res) => {
  const data = req.query;
  const data_user_id = parseInt(data.user_id);
  const filter = { user_id: data_user_id };
  const updateDocument = {
    $set: {
      user_usage: 2,
    }
  };
  console.log(filter);
  console.log(updateDocument);
  const client = new MongoClient(uri);
  await client.connect();
  try {

    const database = client.db('home_rental');
    const collection = database.collection('user');
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
router.get('/edit', async (req, res) => {
  const id = parseInt(req.query.user_id); // ควรเปลี่ยนจาก 'ids' เป็น 'id' เนื่องจากตาม URL ควรใช้ query parameter เป็น 'id'

  const client = new MongoClient(uri);
  await client.connect();
  const data = await client.db('home_rental').collection('user').find({ user_id: id }).toArray();
  await client.close();
  res.status(200).send(data);
});

// GET /user
router.get('/', async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();

  const username = req.query.user_username;
  const password = req.query.user_password;
  const check_str = req.query.user_id; // ส่งค่า user_id สูงสุดไปหน้า fontend

  if (check_str === "fetch_user_id_last") {
    var data = await client.db('home_rental').collection('user').find().sort({ user_id: -1 }).limit(1).toArray();
  } else if (username !== "" && username !== undefined) {
    var data = await client.db('home_rental').collection('user').findOne({ user_username: username, user_password: password });
  } else {
    var data = await client.db('home_rental').collection('user').find().sort({ user_status: 1 }).toArray();
  }

  await client.close();
  res.status(200).send(data);
});

module.exports = router;
