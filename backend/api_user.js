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
  const datain= await client.db('home_rental').collection('user').insertOne({
    user_id:data.user_id,
    user_name: data.user_name,
    user_username: data.user_username,
    user_password: data.user_password,
    user_status:data.user_status,
  });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = " + data.user_id + " is created",
    "data": data
  });
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
  } else if (username !== "" ) {
    var data = await client.db('home_rental').collection('user').findOne({ user_username: username , user_password:password});
  } 
  await client.close();
  res.status(200).send(data);
});

module.exports = router;
