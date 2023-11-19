
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors()); // เปิดใช้งาน CORS สำหรับทุกเส้นทางใน Router
router.use(express.json()); // เปิดใช้งาน middleware ในการแปลง JSON สำหรับทุกเส้นทางใน Router
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin:0982846992@cluster0.qvuui0g.mongodb.net/?retryWrites=true&w=majority";
// POST /user/create
router.post('/insLalamove', async (req, res) => {
    const data = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('home_rental').collection('lalamove').insertOne(data).then((result) => {
        res.status(200).json("OK");
    }).catch((err) => {
        res.status(400).json({ msg: err })
    })


});
module.exports = router;
