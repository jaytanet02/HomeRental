const express = require('express');
const app = express();

// นำเข้าเส้นทาง API จากไฟล์ apiuser.js
const apiUserRoutes_user = require('./api_user');
const apiUserRoutes_cus = require('./api_customer');
const apiUserRoutes_room = require('./api_room');
const apiUserRoutes_payment = require('./api_payment');
const apiUserRoutes_check_permission = require('./api_check_permission');
const apiUserRoutes_report = require('./api_report_dashboard');

app.use('/api_user', apiUserRoutes_user);
app.use('/api_room', apiUserRoutes_room);
app.use('/api_customer', apiUserRoutes_cus);
app.use('/api_payment', apiUserRoutes_payment);
app.use('/api_check_permission', apiUserRoutes_check_permission);
app.use('/api_report_dashboard', apiUserRoutes_report);


let port = process.env.PORT;
if(port == null || port == ""){
  port = 4000;
}
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
