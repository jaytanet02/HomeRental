import React, { useState, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import Navbar from "../Navbar";
import Indexmain from '../indexmain';
import axios from 'axios';
import Swal from 'sweetalert2';

import { useNavigate } from 'react-router-dom'; // Import useNavigate
const Maincustomer = () => {
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
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showModaledit, setShowModaledit] = useState(false);
    const [roomTypenames, setRoomTypenames] = useState({});
    const [users, setUsers] = useState([]);

    const [dataroom, setroom] = useState([]);
    const [cus_id, setcus_id] = useState();
    const [cus_name, setcus_name] = useState("");
    const [cus_id_card, setcus_id_card] = useState("");
    const [cus_otp, setcus_otp] = useState("");
    const [cus_tel, setcus_tel] = useState("");

    const [cus_room_id, setcus_room_id] = useState("");

    const [cus_status, setcus_status] = useState(1);
    const [cus_datein, setcus_datein] = useState(formattedDate);
    const [cus_room_price, set_cus_room_price] = useState("");
    const [cus_room_guarantee, set_cus_room_guarantee] = useState("");
    const [cus_room_advance, set_cus_room_advance] = useState("");
    const [cus_room_water, set_cus_room_water] = useState("");
    const [cus_room_electricity, set_cus_room_electricity] = useState("");
    const [cus_room_bin_price, set_cus_room_bin_price] = useState("");
    const [cus_room_sum, set_cus_room_sum] = useState("");

    const [edit_user_cus_id, set_edit_user_cus_id] = useState("");
    const [edit_cus_id, set_edit_cus_id] = useState();
    const [edit_cus_name, set_edit_cus_name] = useState("");
    const [edit_cus_id_card, set_edit_cus_id_card] = useState("");
    const [edit_cus_tel, set_edit_cus_tel] = useState("");
    const [edit_cus_room_id, set_edit_cus_room_id] = useState("");
    const [edit_cus_status, set_edit_cus_status] = useState("");
    const [edit_cus_datein, set_edit_cus_datein] = useState("");
    const [edit_cus_room_price, set_edit_cus_room_price] = useState("");
    const [edit_cus_room_guarantee, set_edit_cus_room_guarantee] = useState("");
    const [edit_cus_room_advance, set_edit_cus_room_advance] = useState("");
    const [edit_cus_room_water, set_edit_cus_room_water] = useState("");
    const [edit_cus_room_electricity, set_edit_cus_room_electricity] = useState("");
    const [edit_cus_room_bin_price, set_edit_cus_room_bin_price] = useState("");
    const [edit_cus_room_sum, set_edit_cus_room_sum] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ob_status = {
        1: 'พักอาศัย',
        2: 'ออก',
    };
    const filteredUsers = users.filter(user => {
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        return (
            user.cus_name.toLowerCase().includes(lowercaseSearchTerm) ||
            roomTypenames[user.cus_room_id].toLowerCase().includes(lowercaseSearchTerm) ||
            String(ob_status[user.cus_status]).toLowerCase().includes(lowercaseSearchTerm)
        );
    });

    const startIndex = (currentPage - 1) * 5;
    const endIndex = currentPage * 5;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);


    // const urlserver = "http://localhost:4000";
    // useEffect(() => {
    //     return () => {
    //         fetchUsers();
    //         fettyperoom();

    //     };
    // }, []);

    // const urlserver = "https://homerentalbackend.onrender.com";

    const urlserver = "https://lazy-ruby-rooster-gown.cyclic.app";
    useEffect(() => {
        fetchUsers();
        fettyperoom();

    }, []);


    useEffect(() => {
        const calculatedTotalPages = Math.ceil(filteredUsers.length / 5);
        setTotalPages(calculatedTotalPages);
    }, [filteredUsers]);



    const changePage = (page) => {
        setCurrentPage(page);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(urlserver + `/api_customer`);
            setUsers(response.data);
            const num = response.data.length

            if (num > 0) {
                const fecth_cus_id = await axios.get(urlserver + `/api_customer?cus_id=fetch_cus_id_last`);
                const cus_id_numlast = fecth_cus_id.data[0].cus_id;
                setcus_id(cus_id_numlast + 1);
            } else {
                setcus_id(1);
            }

            setTotalPages(Math.ceil(response.data.length / 10));
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            setcus_name("");
            setcus_id_card("");
            setcus_tel("");
            setcus_otp("");
            setcus_status(1);
            setcus_datein(formattedDate);
        } catch (error) {
            console.error(error);
        }
    };


    // const notify = async (data) => {
    //     try {
    //         const response = await axios.post(urlserver + `/api_customer/notify`, {
    //             message: data,

    //         });


    //         console.log(response.data);

    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const send_otp = async (value) => {
        try {
            const response = await axios.get(urlserver + `/api_customer/send_otp?cus_tel=${value}`);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }

    };
    const sum_total = async (type) => {
        var room_price = cus_room_price;
        var room_guarantee = cus_room_guarantee;
        var room_advance = cus_room_advance;
        const arr_room_price = cus_room_price.split(',');
        const arr_room_guarantee = cus_room_guarantee.split(',');
        const arr_room_advance = cus_room_advance.split(',');
        let data_room_price, data_room_guarantee, data_room_advance;

        if (arr_room_price.length > 1) {
            data_room_price = parseInt(room_price.replace(/,/g, '')); // เอาแต่ตัวเลข
        } else {
            data_room_price = parseInt(room_price); // เอาแต่ตัวเลข
        }
        if (arr_room_guarantee.length > 1) {
            data_room_guarantee = parseInt(room_guarantee.replace(/,/g, '')); // เอาแต่ตัวเลข
        } else {
            data_room_guarantee = parseInt(room_guarantee); // เอาแต่ตัวเลข
        }
        if (arr_room_advance.length > 1) {
            data_room_advance = parseInt(room_advance.replace(/,/g, '')); // เอาแต่ตัวเลข
        } else {
            data_room_advance = parseInt(room_advance); // เอาแต่ตัวเลข
        }
        // console.log(data_room_guarantee);
        // console.log(data_room_advance);     console.log(data_room_price);

        set_cus_room_sum((data_room_price + data_room_guarantee + data_room_advance).toLocaleString());


    };

    const fetchedit = async (id) => {
        try {
            const response = await axios.get(urlserver + `/api_customer/edit?cus_id=${id}`);

            console.log(response.data);
            set_edit_cus_id(response.data[0].cus_id);
            set_edit_cus_name(response.data[0].cus_name);
            set_edit_cus_id_card(response.data[0].cus_id_card);
            set_edit_cus_tel(response.data[0].cus_tel);
            set_edit_cus_status(response.data[0].cus_status);
            set_edit_cus_datein(response.data[0].cus_datein);
            set_edit_cus_room_id(response.data[0].cus_room_id);
            set_edit_cus_room_price(response.data[0].cus_room_price.toLocaleString());
            set_edit_cus_room_guarantee(response.data[0].cus_room_guarantee.toLocaleString());
            set_edit_cus_room_advance(response.data[0].cus_room_advance.toLocaleString());
            set_edit_cus_room_water(response.data[0].cus_room_water.toLocaleString());
            set_edit_cus_room_electricity(response.data[0].cus_room_electricity.toLocaleString());
            set_edit_cus_room_bin_price(response.data[0].cus_room_bin_price.toLocaleString());
            set_edit_cus_room_sum(response.data[0].cus_room_sum.toLocaleString());
            setShowModaledit(true);

            set_edit_user_cus_id(response.data[0].user_data[0].user_id);
        } catch (error) {
            console.error(error);
        }
    };
    const fettyperoom = async (room_id, type) => {

        try {
            if (room_id === "" || room_id === undefined) {

                var response = await axios.get(urlserver + `/api_room/`);
                const roomTypenames = {};
                const roomid = {};
                let i = 0;
                response.data.forEach((data) => {
                    roomTypenames[data.room_id] = data.room_name + " " + data.room_typename;
                    if (data.room_status === 1) {
                        roomid[i] = data.room_id;
                        i++;
                    }
                });

                setcus_room_id(roomid[0]);
                setRoomTypenames(roomTypenames);
                setroom(response.data);
                set_cus_room_price(response.data[0].room_price.toLocaleString());
                set_cus_room_guarantee(response.data[0].room_guarantee.toLocaleString());
                set_cus_room_advance(response.data[0].room_advance.toLocaleString());
                set_cus_room_water(response.data[0].room_water.toLocaleString());
                set_cus_room_electricity(response.data[0].room_electricity.toLocaleString());
                set_cus_room_bin_price(response.data[0].room_bin_price.toLocaleString());
                const sum = response.data[0].room_price + response.data[0].room_advance + response.data[0].room_guarantee;
                set_cus_room_sum(sum.toLocaleString());
            } else if (type === "add") {
                var responses = await axios.get(urlserver + `/api_room?room_id=${room_id}`);
                console.log(responses.data);
                set_cus_room_price(responses.data.room_price.toLocaleString());
                set_cus_room_bin_price(responses.data.room_bin_price.toLocaleString());
                set_cus_room_guarantee(responses.data.room_guarantee.toLocaleString());
                set_cus_room_advance(responses.data.room_advance.toLocaleString());
                set_cus_room_water(responses.data.room_water.toLocaleString());
                set_cus_room_electricity(responses.data.room_electricity.toLocaleString());
                const sum = responses.data.room_price + responses.data.room_advance + responses.data.room_guarantee;
                set_cus_room_sum(sum.toLocaleString());
            } else if (type === "edit") {
                var responsex = await axios.get(urlserver + `/api_room?room_id=${room_id}`);
                console.log(responsex.data);
                set_edit_cus_room_price(responsex.data.room_price.toLocaleString());
                set_edit_cus_room_bin_price(responsex.data.room_bin_price.toLocaleString());
                set_edit_cus_room_guarantee(responsex.data.room_guarantee.toLocaleString());
                set_edit_cus_room_advance(responsex.data.room_advance.toLocaleString());
                set_edit_cus_room_water(responsex.data.room_water.toLocaleString());
                set_edit_cus_room_electricity(responsex.data.room_electricity.toLocaleString());
                const sum = responsex.data.room_price + responsex.data.room_advance + responsex.data.room_guarantee;
                set_edit_cus_room_sum(sum.toLocaleString());
            }

        } catch (error) {
            console.error(error);
        }
    };

    const deleteRow = async (id) => {
        Swal.fire({
            title: "ต้องการลบลูกบ้านใช่หรือไม่?",
            text: "การดำเนินการนี้จะปรับสถานะลูกบ้านเป็นออก",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#28A745",
            cancelButtonColor: "#DC3545",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(
                        urlserver + `/api_customer/delete?cus_id=${id}`
                    );

                    if (response.data !== "") {
                        Swal.fire({
                            title: "สำเร็จ",
                            text: "ปรับสถานะลูกบ้านเป็นออก",
                            icon: "success",
                        });
                        fetchUsers();
                        fettyperoom();
                    } else {
                        Swal.fire({
                            title: "ไม่สำเร็จ",
                            text: "เกิดข้อผิดพลาดในการลบข้อมูล",
                            icon: "error",
                        });
                    }

                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "เกิดข้อผิดพลาดในการส่งคำร้องขอลบข้อมูล",
                        icon: "error",
                    });
                }
            }
        });
    };



    const openModal = () => {
        setShowModal(true);

    };
    const closeModal = () => {
        setShowModal(false);
    };
    const openModaledit = (id) => {
        fetchedit(id)
    };
    const closeModaledit = () => {
        setShowModaledit(false);
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            if (cus_name === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอกชื่อ',
                    icon: 'warning',
                });
                return false;
            }
            if (cus_id_card === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอกเลขบัตรประชาชน',
                    icon: 'warning',
                });
                return false;
            }
            if (cus_tel === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอกเบอร์โทรศัพท์',
                    icon: 'warning',
                });
                return false;
            }
            if (cus_otp === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก OTP',
                    icon: 'warning',
                });
                return false;
            }
            const response_otp = await axios.post(urlserver + `/api_customer/verify_otp`, {
                cus_tel,
                cus_otp
            });
            console.log(response_otp.data);
            if (response_otp.data.error === false) {
                const response = await axios.post(urlserver + `/api_customer/create`, {
                    cus_id,
                    cus_name,
                    cus_id_card,
                    cus_tel,
                    cus_room_id,
                    cus_status,
                    cus_datein,
                    cus_room_guarantee,
                    cus_room_advance,
                    cus_room_water,
                    cus_room_electricity,
                    cus_room_bin_price,
                    cus_room_price,
                    cus_room_sum,



                });
                if (response.data !== "") {
                    Swal.fire({
                        title: '',
                        text: 'บันทึกข้อมูลสำเร็จ',
                        icon: 'success',
                    });
                    setShowModal(false);
                }
                fetchUsers();
                fettyperoom();
            } else if (response_otp.data.error === true && (response_otp.data.code === "V0002" || response_otp.data.code === 'V0001')) {
                Swal.fire({
                    title: '',
                    text: 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
                    icon: 'error',
                });

            } else if (response_otp.data.error === true && response_otp.data.code === "V0003") {
                Swal.fire({
                    title: '',
                    text: 'รหัส OTP หมดอายุ กรุณาลองใหม่อีกครั้ง',
                    icon: 'error',
                });

            }
        } catch (error) {
            console.error(error);
        }
    };
    const updatmodal = async (e) => {
        e.preventDefault();
        try {
            if (edit_cus_name === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอกชื่อ',
                    icon: 'warning',
                });
                return false;
            }
            if (edit_cus_id_card === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอกเลขบัตรประชาชน',
                    icon: 'warning',
                });
                return false;
            }
            if (edit_cus_tel === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอกเบอร์โทรศัพท์',
                    icon: 'warning',
                });
                return false;
            }
            const response = await axios.put(urlserver + `/api_customer/update`, {
                edit_user_cus_id,
                edit_cus_id,
                edit_cus_name,
                edit_cus_id_card,
                edit_cus_tel,
                edit_cus_room_id,
                edit_cus_status,
                edit_cus_datein,
                edit_cus_room_guarantee,
                edit_cus_room_advance,
                edit_cus_room_water,
                edit_cus_room_electricity,
                edit_cus_room_bin_price,
                edit_cus_room_price,
                edit_cus_room_sum,
            });
            // กระบวนการอื่นๆ เมื่อสำเร็จ


            if (response.data !== "") {
                Swal.fire({
                    title: '',
                    text: 'แก้ไขข้อมูลสำเร็จ',
                    icon: 'success',
                });
                setShowModaledit(false);
            }
            fetchUsers();
            fettyperoom();
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
                    {/* table */}
                    <br />
                    <div className="d-flex justify-content-between align-items-center container-fluid">
                        <button type="button" className="btn btn-success" onClick={openModal}>
                            เพิ่มข้อมูล
                        </button>
                        <div className="input-group" style={{ maxWidth: '200px' }}>
                            <input
                                type="text"
                                className="form-control border-1 small text-right"
                                placeholder="ค้นหาข้อมูล"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="container-fluid py2">
                        <div className="row">
                            <div className="col-12">
                                <div className="card mb-4">
                                    <div className="card-header pb-0">
                                        <h6>ข้อมูลลูกบ้าน</h6>
                                    </div>
                                    <div className="card-body px-0 pt-0 pb-2">
                                        <div className="table-responsive p-0">
                                            <table className="table align-items-center mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7">ชื่อ</th>
                                                        <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7 ps-2">เลขห้อง<br />ประเภทห้อง</th>
                                                        <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7">สถานะ</th>
                                                        <th colSpan={2} className="text-center opacity-7">#</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentUsers.map((file, index) => (

                                                        <tr key={index}>
                                                            <td className="text-center  text-sm font-weight-bolder opacity-8">
                                                                {file.cus_name}
                                                            </td>
                                                            <td className="text-center text-sm font-weight-bolder opacity-8">
                                                                {roomTypenames[file.cus_room_id]}
                                                            </td>

                                                            {file.cus_status === 1 ? (
                                                                <td className="text-center ">
                                                                    <span style={{ width: '70px' }} className="badge badge-sm bg-gradient-success">{ob_status[file.cus_status]}</span>
                                                                </td>
                                                            ) : (
                                                                <td className="text-center ">
                                                                    <span style={{ width: '70px' }} className="badge badge-sm bg-gradient-danger">{ob_status[file.cus_status]}</span>
                                                                </td>
                                                            )}
                                                            <td className="text-center ">
                                                                <button className="btn btn-info" type='button' onClick={() => openModaledit(file.cus_id)}>
                                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                                </button>
                                                                &nbsp;
                                                                <button className="btn btn-danger" type='button' onClick={() => deleteRow(file.cus_id)}>
                                                                    <i className="fa-solid fa-trash-can"></i>
                                                                </button>
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
                </main>
            </body >

            {/* <add> */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>เพิ่มข้อมูล</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form onSubmit={handleSignup}>
                        <Form.Group hidden>
                            <Form.Label>cus_id</Form.Label>
                            <Form.Control
                                type="text"
                                value={cus_id}
                                onChange={(e) => setcus_id(e.target.value)} />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label ><span style={{ color: 'red' }}>*</span> ชื่อ-นามสกุล</Form.Label>
                            <Form.Control
                                type="text"
                                value={cus_name}
                                onChange={(e) => setcus_name(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label ><span style={{ color: 'red' }}>*</span> เลขบัตรประชาชน</Form.Label>
                            <Form.Control
                                type="text"
                                value={cus_id_card}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    if (inputValue.length <= 13) {
                                        setcus_id_card(inputValue);
                                    }


                                }}
                            />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label ><span style={{ color: 'red' }}>*</span> เบอร์โทรศัพท์</Form.Label>
                        </Form.Group>

                        <Form.Group style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Control
                                style={{ width: '70%' }} // ปรับความกว้างตามต้องการ
                                type="text"
                                value={cus_tel}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    if (inputValue.length <= 10) {
                                        setcus_tel(inputValue);
                                    }
                                }}
                            />

                            <Button onClick={() => send_otp(cus_tel)}>ส่ง OTP</Button>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label ><span style={{ color: 'red' }}>*</span> OTP</Form.Label>
                            <Form.Control
                                type="text"
                                value={cus_otp}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    if (inputValue.length <= 6) {
                                        setcus_otp(inputValue);
                                    }


                                }}
                            />
                        </Form.Group>





                        <Form.Group >
                            <Form.Label>ประเภทห้อง/เลขห้อง</Form.Label>
                            <Form.Control
                                as="select"
                                value={cus_room_id}
                                onChange={(e) => {
                                    setcus_room_id(e.target.value);
                                    fettyperoom(e.target.value, "add");
                                }}>
                                {dataroom
                                    .filter((option) => {
                                        // กรองข้อมูลที่ต้องการโดยใช้เงื่อนไข if-else
                                        if (option.room_status === 1) {
                                            return true; // แสดง Element นี้
                                        } else {
                                            return false; // ไม่แสดง Element นี้
                                        }
                                    })
                                    .map((option) => (
                                        <option key={option.room_id} value={option.room_id}>
                                            {option.room_name + " " + option.room_typename}
                                        </option>
                                    ))}
                            </Form.Control>
                        </Form.Group>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าห้อง</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cus_room_price}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_cus_room_price(formattedValue);
                                            sum_total("add");

                                        }}
                                    />
                                </Form.Group>
                            </div>

                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่ามัดจำล่วงหน้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cus_room_advance}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_cus_room_advance(formattedValue);
                                            sum_total("add");

                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> ค่าประกัน</Form.Label>
                            <Form.Control
                                type="text"
                                value={cus_room_guarantee}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    const formattedValue = Number(inputValue).toLocaleString('en-US');
                                    set_cus_room_guarantee(formattedValue);
                                    sum_total("add");
                                }}
                            />
                        </Form.Group>

                        <div style={{ display: 'flex', alignItems: 'center' }} hidden>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าน้ำ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cus_room_water}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, '');
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_cus_room_water(formattedValue);
                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginLeft: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าไฟฟ้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cus_room_electricity}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, '');
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_cus_room_electricity(formattedValue);
                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginLeft: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าขยะ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cus_room_bin_price}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_cus_room_bin_price(formattedValue);
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group  >
                            <Form.Label><span style={{ color: 'red' }}>*</span> ยอดที่ต้องชำระ</Form.Label>
                            <Form.Control style={{ backgroundColor: '#42bd41', color: 'white' }}
                                type="text"
                                value={cus_room_sum}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    const formattedValue = Number(inputValue).toLocaleString('en-US');
                                    set_cus_room_sum(formattedValue);

                                }}
                            />
                        </Form.Group>




                        <Form.Group hidden>
                            <Form.Label>สถานะ</Form.Label>
                            <Form.Control disabled
                                as="select"
                                value={cus_status}
                                onChange={(e) => setcus_status(e.target.value)}>
                                <option value="1" >พักอาศัย</option>
                                <option value="2">ออก</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>วันที่เข้าพัก</Form.Label>
                            <Form.Control
                                type="date"
                                value={cus_datein}
                                onChange={(e) => setcus_datein(e.target.value)}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="success" type="submit" >
                                ยืนยัน
                            </Button>
                            <Button variant="danger" onClick={closeModal}>
                                ปิด
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>



            {/* <edit> */}
            <Modal show={showModaledit} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขข้อมูล</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form onSubmit={updatmodal}>
                        <Form.Group hidden >
                            <Form.Label>cus_id</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_cus_id}
                                onChange={(e) => set_edit_cus_id(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group hidden>
                            <Form.Label>user_cus_id</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_user_cus_id}
                                onChange={(e) => set_edit_user_cus_id(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> ชื่อ-นามสกุล</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_cus_name}
                                onChange={(e) => set_edit_cus_name(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label ><span style={{ color: 'red' }}>*</span> เลขบัตรประชาชน</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_cus_id_card}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    if (inputValue.length <= 13) {
                                        set_edit_cus_id_card(inputValue);
                                    }


                                }}
                            />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label ><span style={{ color: 'red' }}>*</span> เบอร์โทรศัพท์</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_cus_tel}

                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    if (inputValue.length <= 10) {
                                        set_edit_cus_tel(inputValue);
                                    }


                                }}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>ประเภทห้อง/เลขห้อง</Form.Label>
                            <Form.Control
                                as="select"
                                value={edit_cus_room_id}
                                onChange={(e) => {
                                    set_edit_cus_room_id(e.target.value);
                                    fettyperoom(e.target.value, "edit");
                                }}>
                                {dataroom
                                    .filter((option) => {
                                        // กรองข้อมูลที่ต้องการโดยใช้เงื่อนไข if-else
                                        if (option.room_status === 1 || option.room_id === edit_cus_room_id) {

                                            return true; // แสดง Element นี้
                                        } else {
                                            return false; // ไม่แสดง Element นี้
                                        }
                                    })
                                    .map((option) => (
                                        <option key={option.room_id} value={option.room_id}>
                                            {option.room_name + " " + option.room_typename}
                                        </option>
                                    ))}
                            </Form.Control>

                        </Form.Group>


                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าห้อง</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_cus_room_price}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_cus_room_price(formattedValue);
                                            sum_total("edit");
                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่ามัดจำล่วงหน้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_cus_room_advance}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_cus_room_advance(formattedValue);
                                            sum_total("edit");
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> ค่าประกัน</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_cus_room_guarantee}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    const formattedValue = Number(inputValue).toLocaleString('en-US');
                                    set_edit_cus_room_guarantee(formattedValue);
                                    sum_total("edit");
                                }}
                            />
                        </Form.Group>

                        <div style={{ display: 'flex', alignItems: 'center' }} hidden>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าน้ำ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_cus_room_water}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_cus_room_water(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าไฟฟ้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_cus_room_electricity}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_cus_room_electricity(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าขยะ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_cus_room_bin_price}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_cus_room_bin_price(formattedValue);
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <Form.Group  >
                            <Form.Label><span style={{ color: 'red' }}>*</span> ยอดที่ต้องชำระ</Form.Label>
                            <Form.Control style={{ backgroundColor: '#42bd41', color: 'white' }}
                                type="text"
                                value={edit_cus_room_sum}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    const formattedValue = Number(inputValue).toLocaleString('en-US');
                                    set_edit_cus_room_sum(formattedValue);

                                }}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>สถานะ</Form.Label>
                            <Form.Control
                                as="select"
                                value={edit_cus_status}
                                onChange={(e) => set_edit_cus_status(e.target.value)}>
                                <option value="1" >พักอาศัย</option>
                                <option value="2">ออก</option>

                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>วันที่เข้าพัก</Form.Label>
                            <Form.Control
                                type="date"
                                value={edit_cus_datein}
                                onChange={(e) => set_edit_cus_datein(e.target.value)}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="success" type="submit" >
                                ยืนยัน
                            </Button>
                            <Button variant="danger" onClick={closeModaledit}>
                                ปิด
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
};

export default Maincustomer 
