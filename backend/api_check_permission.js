// apiuser.js - เส้นทาง API สำหรับผู้ใช้งาน

const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors()); // เปิดใช้งาน CORS สำหรับทุกเส้นทางใน Router
router.use(express.json()); // เปิดใช้งาน middleware ในการแปลง JSON สำหรับทุกเส้นทางใน Router

// const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://admin:0982846992@cluster0.qvuui0g.mongodb.net/?retryWrites=true&w=majority";


// GET /data
router.get('/', async (req, res) => {
 

//   const usersession = JSON.parse(sessionStorage.getItem('user'));


  res.status(200).send("usersession.user_status");
});


module.exports = router;
