import React, { useState, useEffect } from 'react'
import Navbar from "../Navbar";
import Indexmain from '../indexmain';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Dashboard() {
  const navigate = useNavigate(); // Initialize useNavigate
  const usersession = JSON.parse(sessionStorage.getItem('user'));

  if (usersession === null || usersession.user_status === "user") {

    setTimeout(() => {
      Swal.fire({
        icon: 'error',
        title: 'คุณไม่มีสิทธิ์เข้า',
        text: 'กรุณาล็อกอินใหม่อีกครั้ง',
      });
      navigate('/main_login');
    }, 1000);
  }

  const [searchtext, setSearchtext] = useState("");
  const [searchmonth, setSearchmonth] = useState("");
  const [searchyear, setSearchyear] = useState("");
  const [searchstatus, setSearchStatus] = useState("00");
  const [session_name, set_session_name] = useState("");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSaveButtonPay, setshowSaveButtonPay] = useState(true);
  const [not_received_amount, setnot_received_amount] = useState("");
  const [wait_received_amount, set_wait_received_amount] = useState("");
  const [status_model, set_status_model] = useState("");
  const [status_modal_button, set_status_modal_button] = useState("");
  const [status_modal_button_bin, set_status_modal_button_bin] = useState("");
  const [text_titel_model, set_text_titel_model] = useState("");
  const [pic_bin, set_pic_bin] = useState();
  const [date_fine, setdate_fine] = useState("");
  const [received_amount, setreceived_amount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [pic_qr_code, set_pic_qr_code] = useState(1);
  const [ownerName, set_ownerName] = useState(1);
  const [amount, set_amount] = useState(1);
  const [pay_id, set_pay_id] = useState("");
  const [pay_cus_name, set_pay_cus_name] = useState("");
  const [pay_cus_room_name_full, set_pay_cus_room_name_full] = useState("");
  const [pay_cus_room_price, set_pay_cus_room_price] = useState("");
  const [pay_meter_water_after, set_pay_meter_water_after] = useState("");
  const [pay_price_water, set_pay_price_water] = useState("");
  const [pay_meter_electricity_after, set_pay_meter_electricity_after] = useState("");
  const [pay_price_electricity, set_pay_price_electricity] = useState("");
  const [pay_room_bin_price, set_pay_room_bin_price] = useState("");
  const [pay_price_fine, set_pay_price_fine] = useState("0");
  const [pay_price_total, set_pay_price_total] = useState("");
  const [pay_room_meter_water_before, set_pay_room_meter_water_before] = useState("");
  const [pay_room_meter_electricity_before, set_pay_room_meter_electricity_before] = useState("");
  const [pay_room_water, set_pay_room_water] = useState("");
  const [pay_room_electricity, set_pay_room_electricity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [data, setData] = useState([]);
  // const [showModal, setShowModal] = useState(false);
  const [showModaledit, setShowModaledit] = useState(false);
  const [showqr, setShowshowqr] = useState(false);


  const filteredUsers = data.filter(user => {
    const lowercaseSearchTerm = searchmonth.toLowerCase();
    const lowerstatus = searchstatus.toLowerCase();
    const lowerhtext = searchtext.toLowerCase();
    const loweryear = searchyear.toLowerCase();

    if (lowercaseSearchTerm === "00" && lowerstatus === "00" && loweryear === "0" && !lowerhtext) {
      return true; // ไม่มีการค้นหา
    }

    return (
      (lowercaseSearchTerm === "00" || user.pay_cus_round.toLowerCase().includes(lowercaseSearchTerm)) &&
      (lowerstatus === "00" || String(user.pay_status).toLowerCase() === lowerstatus) &&
      (loweryear === "00" || String(user.pay_cus_round_year).toLowerCase() === loweryear) &&

      (!lowerhtext ||
        user.pay_cus_name.toLowerCase().includes(lowerhtext) ||
        user.pay_cus_room_name_full.toLowerCase().includes(lowerhtext) ||
        String(user.pay_price_total).toLowerCase().includes(lowerhtext) ||
        String(user.pay_round).toLowerCase().includes(lowerhtext))
    )
  });



  const startIndex = (currentPage - 1) * 5;
  const endIndex = currentPage * 5;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);


  // const urlserver = "http://localhost:4000";
  // useEffect(() => {
  //   return () => {
  //     fetchUsers();
  //   };
  // }, []);
  // const urlserver = "https://homerentalbackend.onrender.com";

  const urlserver = "https://lazy-ruby-rooster-gown.cyclic.app";
  useEffect(() => {
    return () => {
      fetchUsers();
    };
  }, []);


  useEffect(() => {
    const calculatedTotalPages = Math.ceil(filteredUsers.length / 5);
    setTotalPages(calculatedTotalPages);
  }, [filteredUsers]);


  const changePage = (page) => {
    setCurrentPage(page);
  };

  const notify = async (data) => {
    try {
      const response = await axios.post(urlserver + `/api_payment/notify`, {
        message: data,
      });
      console.log(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const sumtotal_dashboard = async (value) => {

    try {
      const response = await axios.get(urlserver + `/api_payment`);
      const data = {}; // สร้างออบเจ็กต์เปล่าเพื่อเก็บข้อมูล
      const arr = response.data;
      for (const value of arr) {
        if (!data[value.pay_cus_round]) {
          data[value.pay_cus_round] = {}; // สร้างอ็อบเจกต์ย่อยสำหรับรอบลูกค้า (x)
        }

        if (!data[value.pay_cus_round][value.pay_status]) {
          data[value.pay_cus_round][value.pay_status] = value.pay_price_total; // กำหนดค่าในอ็อบเจกต์ย่อย (y)
        } else {
          data[value.pay_cus_round][value.pay_status] += value.pay_price_total; // เพิ่มค่าในอ็อบเจกต์ย่อย (y)
        }

        // เพิ่มค่าในตำแหน่ง "00" สำหรับยอดรวมทั้งหมดที่มีสถานะเดียวกัน
        if (!data["00"]) {
          data["00"] = {};
        }
        if (!data["00"][value.pay_status]) {
          data["00"][value.pay_status] = value.pay_price_total;
        } else {
          data["00"][value.pay_status] += value.pay_price_total;
        }
      }
      console.log(data[value]);
      if (data[value] !== undefined) {
        if ((data[value][0]) === undefined) {
          setnot_received_amount("0");
        } else {
          setnot_received_amount(data[value][0]);
        }
        if ((data[value][1]) === undefined) {
          set_wait_received_amount("0");
        } else {
          set_wait_received_amount(data[value][1]);
        }
        if ((data[value][2]) === undefined) {
          setreceived_amount("0");
        } else {
          setreceived_amount(data[value][2]);
        }
      } else {
        setnot_received_amount("0");
        set_wait_received_amount("0");
        setreceived_amount("0");
      }
    } catch (error) {
      console.error(error);
    }
  };

  function formatDate(type, dateString) {

    const date = new Date(dateString);
    const year = date.getFullYear() + 543;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const datenow = new Date();
    const day_now = datenow.getDate().toString().padStart(2, '0');
    const color = day_now >= day ? "badge badge-sm bg-gradient-danger" : "badge badge-sm bg-gradient-primary";

    if (type === "format_date") {
      return `${day}/${month}/${year}`;

    }
    if (type === "color") {
      return `${color}`;
    }
  }

  function textstatus(type, text) {
    if (type === "text") {
      if (text === -1) {
        return `รอคิดค่าเช่าบ้าน`;
      } else if (text === 0) {
        return `รอชำระเงิน`;
      } else if (text === 1) {
        return `รอการตรวจสอบ`;
      } else if (text === 2) {
        return `ชำระเงินเรียบร้อย`;
      }
    } else if (type === "color") {
      if (text === -1) {
        return `badge badge-sm bg-gradient-danger`;
      } else if (text === 0) {
        return `badge badge-sm bg-gradient-info`;
      } else if (text === 1) {
        return `badge badge-sm bg-gradient-warning`;
      } else if (text === 2) {
        return `badge badge-sm bg-gradient-success`;
      }
    }
  }



  function bathformat(data) {
    var amout = data.toLocaleString('th-TH', {
      currency: 'THB',
      minimumFractionDigits: 2
    })
    return `${amout}`;


  }
  const fetchUsers = async (month) => {

    try {
      await axios.post(urlserver + `/api_payment/create`);
      const response = await axios.get(urlserver + `/api_payment`);
      const data = {}; // สร้างออบเจ็กต์เปล่าเพื่อเก็บข้อมูล
      const arr = response.data;
      for (const value of arr) {
        if (!data[value.pay_cus_round]) {
          data[value.pay_cus_round] = {}; // สร้างอ็อบเจกต์ย่อยสำหรับรอบลูกค้า (x)
        }

        if (!data[value.pay_cus_round][value.pay_status]) {
          data[value.pay_cus_round][value.pay_status] = value.pay_price_total; // กำหนดค่าในอ็อบเจกต์ย่อย (y)
        } else {
          data[value.pay_cus_round][value.pay_status] += value.pay_price_total; // เพิ่มค่าในอ็อบเจกต์ย่อย (y)
        }

        // เพิ่มค่าในตำแหน่ง "00" สำหรับยอดรวมทั้งหมดที่มีสถานะเดียวกัน
        if (!data["00"]) {
          data["00"] = {};
        }
        if (!data["00"][value.pay_status]) {
          data["00"][value.pay_status] = value.pay_price_total;
        } else {
          data["00"][value.pay_status] += value.pay_price_total;
        }
      }
      var currentDate = new Date();
      var formattedDate = currentDate.toISOString().split('T')[0];
      var date = new Date(formattedDate);
      var now_year = date.getFullYear() + 543;
      var now_month = (date.getMonth() + 1).toString().padStart(2, '0');
      // var now_day = date.getDate();


      setSearchmonth(now_month);
      setSearchyear(String(now_year));
      setData(response.data);
      if ((data[now_month][0]) === undefined) {
        setnot_received_amount("0");
      } else {
        setnot_received_amount(data[now_month][0]);
      }
      if ((data[now_month][1]) === undefined) {
        set_wait_received_amount("0");
      } else {
        set_wait_received_amount(data[now_month][1]);
      }
      if ((data[now_month][2]) === undefined) {
        setreceived_amount("0");
      } else {
        setreceived_amount(data[now_month][2]);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchedit = async (id) => {
    try {
      const response = await axios.get(urlserver + `/api_payment/edit?pay_id=${id}`);
      set_pay_id(response.data[0].pay_id);
      set_pay_cus_name(response.data[0].pay_cus_name);
      set_pay_cus_room_name_full(response.data[0].pay_cus_room_name_full);
      set_pay_cus_room_price(response.data[0].pay_cus_room_price.toLocaleString());
      set_pay_price_fine(response.data[0].pay_price_fine.toLocaleString());
      set_pay_room_meter_water_before(response.data[0].pay_room_meter_water_before.toLocaleString());
      set_pay_price_water(response.data[0].pay_price_water.toLocaleString());
      if (response.data[0].pay_meter_water_after === 0) {
        set_pay_meter_water_after(response.data[0].pay_room_meter_water_before.toLocaleString());
      } else {
        set_pay_meter_water_after(response.data[0].pay_meter_water_after.toLocaleString());
      }
      set_pay_room_meter_electricity_before(response.data[0].pay_room_meter_electricity_before.toLocaleString());
      if (response.data[0].pay_meter_electricity_after === 0) {
        set_pay_meter_electricity_after(response.data[0].pay_room_meter_electricity_before.toLocaleString());
      } else {
        set_pay_meter_electricity_after(response.data[0].pay_meter_electricity_after.toLocaleString());
      }
      set_pay_price_electricity(response.data[0].pay_price_electricity.toLocaleString());
      set_pay_room_bin_price(response.data[0].pay_room_bin_price.toLocaleString());
      set_pay_price_total(response.data[0].pay_price_total.toLocaleString());
      set_pay_room_water(response.data[0].pay_room_water.toLocaleString());
      set_pay_room_electricity(response.data[0].pay_room_electricity.toLocaleString());
      set_session_name(usersession.user_name);
      if (response.data[0].pay_payment_type === "") {
        setShowshowqr(false);
        setSelectedPaymentMethod(1);
      } else {
        setSelectedPaymentMethod(response.data[0].pay_payment_type);
      }
      if (response.data[0].pay_status===2) {
        setshowSaveButtonPay(false);//ปิดปุ่มชำระเงิน
      }else{
        setshowSaveButtonPay(true);
      }
      if (response.data[0].pay_pic === "") {
        set_status_modal_button_bin("hidden");
      } else if (response.data[0].pay_pic !== "") {
        const api_bin = await axios.get(urlserver + `/api_payment/pic_bin/file?fileName=${response.data[0].pay_pic}`, {
          responseType: 'arraybuffer' // ให้ Axios รับ response เป็น arraybuffer
        });
        const imageBlob = new Blob([api_bin.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        set_pic_bin(imageUrl);
      }
      const date = new Date(response.data[0].pay_round);
      const datenow = new Date();
      let date_fine = 0; // เริ่มต้นเป็น 0
      if (datenow > date) {
        const timeDifference = datenow.getTime() - date.getTime();
        date_fine = Math.floor(timeDifference / (1000 * 3600 * 24)); // แปลงเป็นจำนวนวัน
      }
      setdate_fine(date_fine);
      setShowModaledit(true);
      qr_code(response.data[0].pay_price_total.toLocaleString());
    } catch (error) {
      console.error(error);
    }
  };

  const sum_total = async (type, pay_input, value) => {

    let d_pay_cus_room_price,
      d_pay_price_fine,
      d_pay_meter_water_after,
      d_pay_room_meter_water_before,
      d_pay_room_meter_electricity_before,
      d_pay_meter_electricity_after,
      d_pay_room_bin_price,
      d_pay_price_water,
      d_pay_price_electricity;

    if (pay_input === 1) {
      d_pay_cus_room_price = value;
    } else {
      d_pay_cus_room_price = pay_cus_room_price;
    }

    if (pay_input === 2) {
      d_pay_price_fine = value;
    } else {
      d_pay_price_fine = pay_price_fine;
    }

    if (pay_input === 3) {
      d_pay_room_meter_water_before = value;
    } else {
      d_pay_room_meter_water_before = pay_room_meter_water_before;
    }

    if (pay_input === 4) {
      d_pay_meter_water_after = value;
    } else {
      d_pay_meter_water_after = pay_meter_water_after;
    }

    if (pay_input === 5) {
      d_pay_price_water = value;
    } else {
      d_pay_price_water = pay_price_water;
    }

    if (pay_input === 6) {
      d_pay_room_meter_electricity_before = value;
    } else {
      d_pay_room_meter_electricity_before = pay_room_meter_electricity_before;
    }

    if (pay_input === 7) {
      d_pay_meter_electricity_after = value;
    } else {
      d_pay_meter_electricity_after = pay_meter_electricity_after;
    }
    if (pay_input === 8) {
      d_pay_price_electricity = value;
    } else {
      d_pay_price_electricity = pay_price_electricity;
    }
    if (pay_input === 9) {
      d_pay_room_bin_price = value;
    } else {
      d_pay_room_bin_price = pay_room_bin_price;
    }

    var arr_pay_cus_room_price = d_pay_cus_room_price.split(',');
    var arr_pay_price_fine = d_pay_price_fine.split(',');
    var arr_pay_room_meter_water_before = d_pay_room_meter_water_before.split(',');
    var arr_pay_meter_water_after = d_pay_meter_water_after.split(',');
    var arr_pay_price_water = d_pay_price_water.split(',');
    var arr_pay_room_meter_electricity_before = d_pay_room_meter_electricity_before.split(',');
    var arr_pay_meter_electricity_after = d_pay_meter_electricity_after.split(',');
    var arr_pay_price_electricity = d_pay_price_electricity.split(',');
    var arr_pay_room_bin_price = d_pay_room_bin_price.split(',');
    var d_room_water_nk = pay_room_water;
    var d_room_electricity_nk = pay_room_electricity;
    var arr_room_water_nk = d_room_water_nk.split(',');
    var arr_room_electricity_nk = d_room_electricity_nk.split(',');

    let data_pay_cus_room_price,
      data_pay_price_fine,
      data_pay_meter_water_after,
      data_pay_room_meter_water_before,
      data_pay_room_meter_electricity_before,
      data_pay_meter_electricity_after,
      data_pay_room_bin_price,
      data_room_water_nk,
      data_room_electricity_nk,
      data_pay_price_water,
      data_pay_price_electricity;

    if (type === "edit") {
      if (arr_pay_cus_room_price.length > 1) {
        data_pay_cus_room_price = parseInt(d_pay_cus_room_price.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_cus_room_price = parseInt(d_pay_cus_room_price); // เอาแต่ตัวเลข
      }
      if (arr_pay_price_fine.length > 1) {
        data_pay_price_fine = parseInt(d_pay_price_fine.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_price_fine = parseInt(d_pay_price_fine); // เอาแต่ตัวเลข
      }

      if (arr_pay_room_meter_water_before.length > 1) {
        data_pay_room_meter_water_before = parseInt(d_pay_room_meter_water_before.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_room_meter_water_before = parseInt(d_pay_room_meter_water_before); // เอาแต่ตัวเลข
      }

      if (arr_pay_meter_water_after.length > 1) {
        data_pay_meter_water_after = parseInt(d_pay_meter_water_after.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_meter_water_after = parseInt(d_pay_meter_water_after); // เอาแต่ตัวเลข
      }

      if (arr_pay_room_meter_electricity_before.length > 1) {
        data_pay_room_meter_electricity_before = parseInt(d_pay_room_meter_electricity_before.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_room_meter_electricity_before = parseInt(d_pay_room_meter_electricity_before); // เอาแต่ตัวเลข
      }

      if (arr_pay_meter_electricity_after.length > 1) {
        data_pay_meter_electricity_after = parseInt(d_pay_meter_electricity_after.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_meter_electricity_after = parseInt(d_pay_meter_electricity_after); // เอาแต่ตัวเลข
      }

      if (arr_pay_room_bin_price.length > 1) {
        data_pay_room_bin_price = parseInt(d_pay_room_bin_price.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_room_bin_price = parseInt(d_pay_room_bin_price); // เอาแต่ตัวเลข
      }

      if (arr_room_water_nk.length > 1) {
        data_room_water_nk = parseInt(d_room_water_nk.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_room_water_nk = parseInt(d_room_water_nk); // เอาแต่ตัวเลข
      }

      if (arr_room_electricity_nk.length > 1) {
        data_room_electricity_nk = parseInt(d_room_electricity_nk.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_room_electricity_nk = parseInt(d_room_electricity_nk); // เอาแต่ตัวเลข
      }
      if (arr_pay_price_water.length > 1) {
        data_pay_price_water = parseInt(d_pay_price_water.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_price_water = parseInt(d_pay_price_water); // เอาแต่ตัวเลข
      }

      if (arr_pay_price_electricity.length > 1) {
        data_pay_price_electricity = parseInt(d_pay_price_electricity.replace(/,/g, '')); // เอาแต่ตัวเลข
      } else {
        data_pay_price_electricity = parseInt(d_pay_price_electricity); // เอาแต่ตัวเลข
      }

      let price_water, price_electricity;

      if (pay_input === 5 || pay_input === 8) {
        price_water = data_pay_price_water;
        price_electricity = data_pay_price_electricity;
      } else {
        price_water = (data_pay_meter_water_after - data_pay_room_meter_water_before) * data_room_water_nk;
        price_electricity = (data_pay_meter_electricity_after - data_pay_room_meter_electricity_before) * data_room_electricity_nk;
      }

      if (isNaN(price_water)) {
        price_water = 0;
      }
      if (isNaN(price_electricity)) {
        price_electricity = 0;
      }

      set_pay_price_water((price_water).toLocaleString());
      set_pay_price_electricity((price_electricity).toLocaleString());
      // set_pay_price_total((data_pay_cus_room_price + data_pay_price_fine + price_water + price_electricity + data_pay_room_bin_price).toLocaleString());
      set_pay_price_total((data_pay_cus_room_price + data_pay_price_fine + price_water + price_electricity + data_pay_room_bin_price).toLocaleString());
      qr_code(data_pay_cus_room_price + data_pay_price_fine + price_water + price_electricity + data_pay_room_bin_price);
      setShowSaveButton(true);
    }

  };
  const deleteRow = async (id) => {

    try {
      const response = await axios.delete(urlserver + `/api_payment/delete?pay_id=${id}`);
      Swal.fire({
        title: '',
        text: 'ลบข้อมูลสำเร็จ',
        icon: 'success',
      });
      fetchUsers();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  const edit_pay = (type, id) => {

    if (type === "edit") {
      set_status_model("");
      set_status_modal_button("");
      set_status_modal_button_bin("hidden");

      set_text_titel_model("ชำระเงิน");
    } else if (type === "examine") {
      set_status_model("readOnly");
      set_status_modal_button("hidden");
      set_status_modal_button_bin("");
      set_text_titel_model("ตรวจสอบการชำระเงิน");
    }
    fetchedit(id);
  };
  const closeModal = () => {
    setShowModaledit(false);
  };
  const qr_code = async (value) => {
    var t_pay_price_total = value;
    try {
      const response = await axios.get(urlserver + `/api_payment/qr_code?amount_pay=${t_pay_price_total}`);

      set_pic_qr_code(response.data.qrData);
      set_ownerName(response.data.ownerName);
      set_amount(response.data.amount.toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2
      }));

    } catch (error) {
      console.error(error);
    }
  };
  const handleSignup = async (e, typebutton) => {
    e.preventDefault();

    var text_title, path_pic, text_imageWidth, text_imageHeight;
    // pay_price_total ดึงจาก useState 

    if (typebutton === "save") {
      text_title = "คุณต้องการบันทึก<br/>ใช่หรือไม่ ?"
      path_pic = "../../assets/img/save.png"
      text_imageWidth = "150"
      text_imageHeight = "150"
    } else if (typebutton === "paymoney") {
      text_title = "คุณได้รับเงินจำนวน<br/>" + pay_price_total + " บาท <br/>แล้วใช่หรือไม่ ?"

      path_pic = "../../assets/img/paymoney1.png"
      text_imageWidth = "150"
      text_imageHeight = "150"
    }
    try {

      Swal.fire({
        title: text_title,
        text: "",
        imageUrl: path_pic,  // ระบุพาธของไฟล์ภาพที่ต้องการแสดง
        imageWidth: text_imageWidth,
        imageHeight: text_imageHeight,
        // icon: "info",
        showCancelButton: true,
        showCloseButton: true,  // เพิ่มปุ่มปิด (X) ด้านขวาบน
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#28A745",
        cancelButtonColor: "#DC3545",

      }).then(async (result) => {
        if (result.isConfirmed) {

          const response = await axios.put(urlserver + `/api_payment/update`, {
            pay_id,
            pay_cus_name,
            pay_cus_room_name_full,
            pay_cus_room_price,
            pay_price_fine,
            pay_room_meter_water_before,
            pay_meter_water_after,
            pay_price_water,
            pay_room_meter_electricity_before,
            pay_meter_electricity_after,
            pay_price_electricity,
            pay_room_bin_price,
            pay_price_total,
            typebutton,
            selectedPaymentMethod,
            session_name,
          });

          console.log(response.data); // ตัวอย่างการใช้งาน response ที่ได้จาก server
          if (response.data.data_pay_status === 0) {
            Swal.fire({
              title: "บันทึกสำเร็จ",
              text: "",
              icon: "success",
            });
            setShowSaveButton(false); // ปิดปุ่ม "บันทึก"
            fetchUsers();
          } else if (response.data.data_pay_status === 2) {
            Swal.fire({
              title: "ชำระเงินสำเร็จ",
              text: "",
              icon: "success",
            });

            notify("ชำระเงินสำเร็จ " + pay_cus_name + " ห้อง " + pay_cus_room_name_full + " จำนวนเงิน "
              + pay_price_total + " บาท ชำระเงินวันที่ " + formatDate("format_date", response.data.pay_date));
            setShowModaledit(false);
            fetchUsers();
          }

        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      })

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>

      <Indexmain />
      <body className="g-sidenav-show   bg-gray-100">
        <Navbar />
        <main className="main-content position-relative border-radius-lg ">

          <div className="container-fluid py-5 ">
            <div className="row">
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold">รอชำระเงิน</p>
                          <h5 className="font-weight-bolder">
                            <span className="text-danger text-m font-weight-bolder">{bathformat(not_received_amount)} </span>
                            บาท

                          </h5>

                          <p className="mb-0">

                          </p>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-danger shadow-primary text-center rounded-circle">
                          <i className="ni ni-money-coins text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold">รอการตรวจสอบ</p>
                          <h5 className="font-weight-bolder">
                            <span className="text-warning text-m font-weight-bolder">{bathformat(wait_received_amount)} </span>
                            บาท
                          </h5>
                          <p className="mb-0">

                          </p><i class="bi bi-cash-coin"></i>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-warning shadow-danger text-center rounded-circle">
                          <i className="ni ni-money-coins text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold">ชำระเงินเรียบร้อย</p>
                          <h5 className="font-weight-bolder">
                            <span className="text-success text-m font-weight-bolder">{bathformat(received_amount)} </span>
                            บาท
                          </h5>
                          <p className="mb-0">

                          </p><i class="bi bi-cash-coin"></i>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-success shadow-danger text-center rounded-circle">
                          <i className="ni ni-money-coins text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center container-fluid">
            <div className="input-group" style={{ maxWidth: '250px' }}>
              <select
                className="form-select border-1 small text-right"
                aria-label="Select Month"
                value={searchmonth}
                onChange={(e) => {
                  sumtotal_dashboard(e.target.value);
                  setSearchmonth(e.target.value);

                }}>
                <option value="00">ทั้งหมด</option>
                <option value="01">มกราคม</option>
                <option value="02">กุมภาพันธ์</option>
                <option value="03">มีนาคม</option>
                <option value="04">เมษายน</option>
                <option value="05">พฤษภาคม</option>
                <option value="06">มิถุนายน</option>
                <option value="07">กรกฎาคม</option>
                <option value="08">สิงหาคม</option>
                <option value="09">กันยายน</option>
                <option value="10">ตุลาคม</option>
                <option value="11">พฤศจิกายน</option>
                <option value="12">ธันวาคม</option>
              </select>
            </div>&nbsp;&nbsp;
            <div className="input-group" style={{ maxWidth: '250px' }}>
              <select
                className="form-select border-1 small text-right"
                aria-label="Select year"
                value={searchyear}
                onChange={(e) => setSearchyear(e.target.value.toString())}>
                <option value="00">ทั้งหมด</option>
                <option value="2566">2566</option>
                <option value="2567">2567</option>
                <option value="2568">2568</option>
                <option value="2569">2569</option>
                <option value="2570">2570</option>
                <option value="2571">2571</option>
                <option value="2572">2572</option>
                <option value="2573">2573</option>
              </select>

            </div>&nbsp;&nbsp;
            <div className="input-group" style={{ maxWidth: '250px' }}>
              <select
                className="form-select border-1 small text-right"
                aria-label="Select status"
                value={searchstatus}
                onChange={(e) => setSearchStatus(e.target.value)}>
                <option value="00">ทั้งหมด</option>
                <option value="-1">รอคิดค่าเช่าบ้าน</option>
                <option value="0">รอชำระเงิน</option>
                <option value="1">รอการตรวจสอบ</option>
                <option value="2">ชำระเงินเรียบร้อย</option>
              </select>
            </div>&nbsp;&nbsp;

          </div><br />

          <div className="d-flex justify-content-center align-items-center container-fluid">
            <div className="input-group" style={{ maxWidth: '770px' }}>
              <input
                type="text"
                className="form-control border-1 small text-right"
                placeholder="ค้นหาข้อมูล"
                aria-label="Search"
                aria-describedby="basic-addon2"
                value={searchtext}
                onChange={(e) => setSearchtext(e.target.value)}
              />
            </div>
          </div><br />
          {/* table */}
          <div className="container-fluid py-4">


            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-header pb-0">
                    <h6>ค่าเช่าที่ต้องเก็บ</h6>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-center  text-secondary text-sm font-weight-bolder opacity-7">ชื่อ<br />เลขห้อง<br />ประเภทห้อง</th>
                            <th className="text-center  text-secondary text-sm font-weight-bolder opacity-7">ยอดที่<br />ต้องชำระ</th>
                            <th className="text-center  text-secondary text-sm font-weight-bolder opacity-7">งวด<br />เดือน/ปี</th>
                            <th className="text-center  text-secondary text-sm font-weight-bolder opacity-7">สถานะ</th>
                            <th className="text-center opacity-7">#</th>
                          </tr>
                        </thead>
                        <tbody>

                          {currentUsers.map((value, index) => (

                            <tr key={index}>
                              <td className="text-center  text-sm font-weight-bolder opacity-8">
                                {value.pay_cus_name}<br />
                                <span style={{ color: "green" }}>{value.roomData.room_name + ' ' + value.roomData.room_typename}</span>
                              </td>

                              <td className="text-center text-sm font-weight-bolder opacity-8">
                                {bathformat(value.pay_price_total)}
                              </td>

                              <td className="text-center ">
                                <span className={formatDate("color", value.pay_round)}>{formatDate("format_date", value.pay_round)} </span>
                              </td>

                              <td className="text-center ">
                                <span className={textstatus("color", value.pay_status)}>{textstatus("text", value.pay_status)} </span>
                              </td>

                              <td className="text-center ">
                                {value.pay_status === 1 || value.pay_status === 2 ? (
                                  <button className="btn btn-warning" type='button' onClick={() => edit_pay("examine", value.pay_id)}>
                                    <i className="fa-regular fa-pen-to-square"></i>
                                  </button>
                                ) : null}
                                &nbsp;
                                {value.pay_status === -1 || value.pay_status === 0 ? (
                                  <button className="btn btn-success" type='button' onClick={() => edit_pay("edit", value.pay_id)}>
                                    <i className="fa-regular fa-pen-to-square"></i>
                                  </button>
                                ) : null}
                                &nbsp;
                                {value.pay_status === 0 || value.pay_status === -1 ? (
                                  <button className="btn btn-danger" type='button' onClick={() => deleteRow(value.pay_id)}>
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                ) : null}
                              </td>

                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div>
                  </div>
                  <ul className="pagination justify-content-end">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li className={`page-item ${currentPage === page ? 'active' : ''}`}
                        key={page}
                        onClick={() => changePage(page)}>
                        <span className="page-link">{page}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>




          {/* <add> */}
          <Modal show={showModaledit} onHide={closeModal} >
            <Modal.Header closeButton>
              <Modal.Title>{text_titel_model}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column">

              <Form onSubmit={handleSignup} >
                <div hidden>
                  <Form.Group  >
                    <Form.Label>pay_id</Form.Label>
                    <Form.Control
                      type="text"
                      value={pay_id}
                      onChange={(e) => set_pay_id(e.target.value)} />
                  </Form.Group>
                  <Form.Group  >
                    <Form.Label>ค่าน้ำหน่วยละ</Form.Label>
                    <Form.Control
                      type="text"
                      value={pay_room_water}
                      onChange={(e) => set_pay_room_water(e.target.value)} />
                  </Form.Group>
                  <Form.Group  >
                    <Form.Label>ค่าไฟ/หน่วยละ</Form.Label>
                    <Form.Control
                      type="text"
                      value={pay_room_electricity}
                      onChange={(e) => set_pay_room_electricity(e.target.value)} />
                  </Form.Group>
                </div>
                <Form.Group >
                  <Form.Label ><span style={{ color: 'red' }}>*</span> ชื่อ-นามสกุล</Form.Label>
                  <Form.Control
                    type="text"
                    value={pay_cus_name}
                    onChange={(e) => { set_pay_cus_name(e.target.value) }} readOnly
                  />
                </Form.Group>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: '1', marginRight: '10px' }}>
                    <Form.Group >
                      <Form.Label><span style={{ color: 'red' }}>*</span> เลขห้อง/ประเภทห้อง</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_cus_room_name_full}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                          const formattedValue = Number(inputValue).toLocaleString('en-US');
                          set_pay_cus_room_name_full(formattedValue);


                        }} readOnly
                      />
                    </Form.Group>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }} >
                  <div style={{ flex: '1', marginRight: '10px' }}>
                    <Form.Group>
                      <Form.Label><span style={{ color: 'red' }}>*</span> ค่าห้อง</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_cus_room_price}
                        readOnly={status_model === "readOnly"}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                          const formattedValue = Number(inputValue).toLocaleString('en-US');
                          set_pay_cus_room_price(formattedValue);
                          sum_total("edit", 1, formattedValue);

                        }}
                      />
                    </Form.Group>
                  </div>
                  <div style={{ flex: '1', marginRight: '10px' }}>
                    <Form.Group>
                      <Form.Label><span style={{ color: 'red' }}>*</span> ค่าปรับ</Form.Label>
                      <Form.Label><span style={{ color: 'red' }}> {date_fine}</span> วัน</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_price_fine}
                        readOnly={status_model === "readOnly"}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                          const formattedValue = Number(inputValue).toLocaleString('en-US');
                          set_pay_price_fine(formattedValue);
                          sum_total("edit", 2, formattedValue);
                        }}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }} >
                  <div style={{ flex: '1', marginRight: '10px' }}>
                    <Form.Group>
                      <Form.Label><span style={{ color: 'red' }}>*</span> มิตเตอร์น้ำเดือนก่อน</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_room_meter_water_before}
                        readOnly={status_model === "readOnly"}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, '');
                          if (inputValue.length <= 4) { // ตรวจสอบว่ามีเลขไม่เกิน 4 หลัก
                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                            set_pay_room_meter_water_before(formattedValue);
                            sum_total("edit", 3, formattedValue);
                          }
                        }}
                      />
                    </Form.Group>
                  </div>
                  <div style={{ flex: '1', marginRight: '10px' }}>

                    <Form.Group>
                      <Form.Label><span style={{ color: 'red' }}>*</span> มิตเตอร์น้ำล่าสุด</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_meter_water_after}
                        readOnly={status_model === "readOnly"}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, '');
                          if (inputValue.length <= 4) { // ตรวจสอบว่ามีเลขไม่เกิน 4 หลัก
                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                            set_pay_meter_water_after(formattedValue);
                            sum_total("edit", 4, formattedValue);
                          }
                        }}
                      />
                    </Form.Group>
                  </div>
                  <div style={{ flex: '1', marginLeft: '10px' }}>
                    <Form.Group>
                      <Form.Label><span style={{ color: 'red' }}>*</span> ค่าน้ำ</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_price_water}
                        readOnly={status_model === "readOnly"}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, '');
                          const formattedValue = Number(inputValue).toLocaleString('en-US');
                          set_pay_price_water(formattedValue);
                          sum_total("edit", 5, formattedValue);
                        }}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }} >
                  <div style={{ flex: '1', marginRight: '10px' }}>
                    <Form.Group>
                      <Form.Label><span style={{ color: 'red' }}>*</span> มิตเตอร์ไฟฟ้าเดือนก่อน</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_room_meter_electricity_before}
                        readOnly={status_model === "readOnly"}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, '');
                          if (inputValue.length <= 4) { // ตรวจสอบว่ามีเลขไม่เกิน 4 หลัก
                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                            set_pay_room_meter_electricity_before(formattedValue);
                            sum_total("edit", 6, formattedValue);
                          }
                        }}
                      />
                    </Form.Group>
                  </div>
                  <div style={{ flex: '1', marginRight: '10px' }}>
                    <Form.Group>
                      <Form.Label><span style={{ color: 'red' }}>*</span> มิตเตอร์ไฟฟ้าล่าสุด</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_meter_electricity_after}
                        readOnly={status_model === "readOnly"}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, '');
                          if (inputValue.length <= 4) { // ตรวจสอบว่ามีเลขไม่เกิน 4 หลัก
                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                            set_pay_meter_electricity_after(formattedValue);
                            sum_total("edit", 7, formattedValue);
                          }
                        }}
                      />
                    </Form.Group>
                  </div>
                  <div style={{ flex: '1', marginLeft: '10px' }}>
                    <Form.Group>
                      <Form.Label><span style={{ color: 'red' }}>*</span> ค่าไฟฟ้า</Form.Label>
                      <Form.Control
                        type="text"
                        value={pay_price_electricity}
                        readOnly={status_model === "readOnly"}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, '');
                          const formattedValue = Number(inputValue).toLocaleString('en-US');
                          set_pay_price_electricity(formattedValue);
                          sum_total("edit", 8, formattedValue);
                        }}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Form.Group>
                  <Form.Label><span style={{ color: 'red' }}>*</span> ค่าขยะ</Form.Label>
                  <Form.Control
                    type="text"
                    value={pay_room_bin_price}
                    readOnly={status_model === "readOnly"}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                      const formattedValue = Number(inputValue).toLocaleString('en-US');
                      set_pay_room_bin_price(formattedValue);
                      sum_total("edit", 9, formattedValue);
                    }}
                  />
                </Form.Group>


                <Form.Group  >
                  <Form.Label><span style={{ color: 'red' }}>*</span> ยอดที่ต้องชำระ</Form.Label>
                  <Form.Control style={{ backgroundColor: '#42bd41', color: 'white' }}
                    type="text"
                    value={pay_price_total}
                    readOnly={status_model === "readOnly"}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                      const formattedValue = Number(inputValue).toLocaleString('en-US');
                      set_pay_price_total(formattedValue);
                      qr_code(formattedValue);
                      setShowSaveButton(true);
                    }}
                  />
                </Form.Group>
                <br />

                <div className="d-flex flex-fill justify-content-between "   >
                  <Button
                    className={`btn ${selectedPaymentMethod === 1 ? "btn-success" : "btn-light"} flex-grow-1 mr-1`}
                    onClick={() => {
                      setSelectedPaymentMethod(1);
                      setShowshowqr(false);
                    }}
                  >
                    ชำระด้วยเงินสด
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    className={`btn ${selectedPaymentMethod === 2 ? "btn-success" : "btn-light"} flex-grow-1 ml-1`}
                    onClick={() => {
                      setSelectedPaymentMethod(2);
                      setShowshowqr(true);
                    }}
                  >
                    ชำระด้วย QR CODE
                  </Button>
                </div>
                <div hidden={status_modal_button_bin === "hidden"}  ><center>
                  <img src={pic_bin} width={300} height={450} alt="bin" />
                </center>
                </div>

                {showqr && (
                  <div hidden={status_modal_button === "hidden"}><center>
                    <img id="qrImage" src={pic_qr_code} alt="PromptPay QR Code" />
                    <p> {ownerName}</p>
                    <p>ยอดชำระ: {amount} บาท</p>
                  </center>
                  </div>
                )}

                <Modal.Footer>

                  {showSaveButton && (
                    <Button type="submit" onClick={(e) => handleSignup(e, "save")}>
                      บันทึก
                    </Button>
                  )}
                
                   
                    {showSaveButtonPay && (
                      <Button variant="success" type="submit" onClick={(e) => handleSignup(e, "paymoney")}>
                        ชำระเงิน
                      </Button>
                       )}
                      <Button variant="danger" onClick={closeModal}>
                        ปิด
                      </Button>
                  
                 
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>

        </main>
      </body >
    </>
  )

}

export default Dashboard 
