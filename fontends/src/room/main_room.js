import React, { useState, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import Navbar from "../Navbar";
import Indexmain from '../indexmain';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const Customers = () => {
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

    const [showModal, setShowModal] = useState(false);
    const [showModaledit, setShowModaledit] = useState(false);
    const [users, setUsers] = useState([]);
    const [room_id, setroom_id] = useState();
    const [room_typename, setroom_typename] = useState("");
    const [room_name, setroom_name] = useState("");
    const [room_status, setroom_status] = useState("");
    const [room_meter_water, setroom_meter_water] = useState("");
    const [room_meter_electricity, setroom_meter_electricity] = useState("");

    const [room_price, setroom_price] = useState("");
    const [room_guarantee, setroom_guarantee] = useState("");
    const [room_advance, setroom_advance] = useState("");
    const [room_bin_price, setroom_bin_price] = useState("10");
    const [room_water, setroom_water] = useState("18");
    const [room_electricity, setroom_electricity] = useState("9");

    const [edit_room_guarantee, set_edit_room_guarantee] = useState("");
    const [edit_room_advance, set_edit_room_advance] = useState("");
    const [edit_room_bin_price, set_edit_room_bin_price] = useState("");
    const [edit_room_water, set_edit_room_water] = useState("");
    const [edit_room_electricity, set_edit_room_electricity] = useState("");
    const [edit_room_id, set_edit_room_id] = useState();
    const [edit_room_typename, set_edit_room_typename] = useState("");
    const [edit_room_name, set_edit_room_name] = useState("");
    const [edit_room_status, set_edit_room_status] = useState("");
    const [edit_room_price, set_edit_room_price] = useState("");
    const [edit_room_meter_water, set_edit_room_meter_water] = useState("");
    const [edit_room_meter_electricity, set_edit_room_meter_electricity] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
  const urlserver = "http://localhost:4000";
   //  const urlserver = "https://backendrental.onrender.com";
    useEffect(() => {
      return () => {
            fetchUsers();
       }
    }, []);

    const startIndex = (currentPage - 1) * 10;
    const endIndex = currentPage * 10;
    const currentUsers = users.slice(startIndex, endIndex);
    const changePage = (page) => {
        setCurrentPage(page);
    };
    const fetchUsers = async () => {
        try {
            const response = await axios.get(urlserver + `/api_room`);
            setUsers(response.data);
            const num = response.data.length
            if (num > 0) {
                const fecth_room_id = await axios.get(urlserver + `/api_room?room_id=fetch_room_id_last`);
                const room_id_numlast = fecth_room_id.data[0].room_id;
                setroom_id(room_id_numlast + 1);
            } else {
                setroom_id(1);
            }
            setTotalPages(Math.ceil(response.data.length / 10));
            // const currentDate = new Date();
            // const formattedDate = currentDate.toISOString().split('T')[0];
            setroom_typename("");
            setroom_name("");
            setroom_status(1);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchedit = async (id) => {
        try {
            const response = await axios.get(urlserver + `/api_room/edit?room_id=${id}`);
            console.log(response.id);
            console.log(response.data);
            set_edit_room_id(response.data[0].room_id);
            set_edit_room_typename(response.data[0].room_typename);
            set_edit_room_name(response.data[0].room_name);
            set_edit_room_status(response.data[0].room_status);
            set_edit_room_price(response.data[0].room_price.toLocaleString());
            set_edit_room_bin_price(response.data[0].room_bin_price.toLocaleString());
            set_edit_room_guarantee(response.data[0].room_guarantee.toLocaleString());
            set_edit_room_advance(response.data[0].room_advance.toLocaleString());
            set_edit_room_electricity(response.data[0].room_electricity.toLocaleString());
            set_edit_room_water(response.data[0].room_water.toLocaleString());
            set_edit_room_meter_electricity(response.data[0].room_meter_electricity.toLocaleString());
            set_edit_room_meter_water(response.data[0].room_meter_water.toLocaleString());




        } catch (error) {
            console.error(error);
        }
    };
    const deleterow = async (id) => {

        try {
            const response = await axios.delete(urlserver + `/api_room/delete?room_id=${id}`);
            console.log(response.data); // ตัวอย่างการใช้งาน response ที่ได้จาก server

            if (response.data !== "") {
                Swal.fire({
                    title: '',
                    text: 'ลบข้อมูลสำเร็จ',
                    icon: 'success',
                });
                fetchUsers();
            }

        } catch (error) {
            console.error(error);
        }
    };
    const ob_status = {
        1: 'ว่าง',
        2: 'ไม่ว่าง',
    };

    const openModal = () => {
        setShowModal(true);

    };
    const closeModal = () => {
        setShowModal(false);
    };
    const openModaledit = (id) => {


        fetchedit(id)
        setShowModaledit(true);
    };
    const closeModaledit = () => {
        setShowModaledit(false);
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            if (room_name === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก เลขห้อง',
                    icon: 'warning',
                });
                return false;
            } else if (room_typename === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ประเภทห้อง',
                    icon: 'warning',
                });
                return false;
            } else if (room_bin_price === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่าขยะ',
                    icon: 'warning',
                });
                return false;
            } else if (room_price === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ราคาห้อง',
                    icon: 'warning',
                });
                return false;

            } else if (room_guarantee === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่าประกัน',
                    icon: 'warning',
                });
                return false;

            } else if (room_advance === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่ามัดจำล่วงหน้า',
                    icon: 'warning',
                });
                return false;

            } else if (room_water === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่าน้ำ',
                    icon: 'warning',
                });
                return false;

            } else if (room_electricity === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่าไฟฟ้า',
                    icon: 'warning',
                });
                return false;
            }
            const response = await axios.post(urlserver + `/api_room/create`, {
                room_id,
                room_name,
                room_typename,
                room_price,
                room_guarantee,
                room_advance,
                room_electricity,
                room_water,
                room_bin_price,
                room_status,
                room_meter_water,
                room_meter_electricity,
            });
            // กระบวนการอื่นๆ เมื่อสำเร็จ
            console.log(response.data); // ตัวอย่างการใช้งาน response ที่ได้จาก server
            if (response.data !== "") {
                Swal.fire({
                    title: '',
                    text: 'บันทึกข้อมูลสำเร็จ',
                    icon: 'success',
                });
                setShowModal(false);
            }
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };
    const updatmodal = async (e) => {
        e.preventDefault();
        try {
            if (edit_room_name === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก เลขห้อง',
                    icon: 'warning',
                });
                return false;
            } else if (edit_room_typename === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ประเภทห้อง',
                    icon: 'warning',
                });
                return false;

            } else if (edit_room_bin_price === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่าขยะ',
                    icon: 'warning',
                });
                return false;
            } else if (edit_room_price === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ราคาห้อง',
                    icon: 'warning',
                });
                return false;

            } else if (edit_room_guarantee === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่าประกัน',
                    icon: 'warning',
                });
                return false;

            } else if (edit_room_advance === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่ามัดจำล่วงหน้า',
                    icon: 'warning',
                });
                return false;

            } else if (edit_room_water === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่าน้ำ',
                    icon: 'warning',
                });
                return false;

            } else if (edit_room_electricity === "") {
                Swal.fire({
                    title: '',
                    text: 'กรุณากรอก ค่าไฟฟ้า',
                    icon: 'warning',
                });
                return false;
            }
            const response = await axios.put(urlserver + `/api_room/update`, {
                edit_room_id,
                edit_room_name,
                edit_room_typename,
                edit_room_bin_price,
                edit_room_price,
                edit_room_guarantee,
                edit_room_advance,
                edit_room_electricity,
                edit_room_water,
                edit_room_status,
                edit_room_meter_water,
                edit_room_meter_electricity,
            });
            // กระบวนการอื่นๆ เมื่อสำเร็จ

            console.log(response.data); // ตัวอย่างการใช้งาน response ที่ได้จาก server
            if (response.data !== "") {
                Swal.fire({
                    title: '',
                    text: 'แก้ไขข้อมูลสำเร็จ',
                    icon: 'success',
                });
                setShowModaledit(false);
            }
            fetchUsers();
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
                    <div align="right" className=" container-fluid ">
                        <button type="button" className="btn btn-success" onClick={openModal} >
                            เพิ่มข้อมูล
                        </button>
                    </div>
                    <div className="container-fluid py2">
                        <div className="row">
                            <div className="col-12">
                                <div className="card mb-4">
                                    <div className="card-header pb-0">
                                        <h6>ข้อมูลห้องเช่า</h6>
                                    </div>
                                    <div className="card-body px-0 pt-0 pb-2">
                                        <div className="table-responsive p-0">
                                            <table className="table align-items-center mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7">ประเภทห้อง</th>
                                                        <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7 ps-2">เลขห้อง</th>
                                                        <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7">สถานะห้อง</th>
                                                        <th colSpan={2} className="text-center opacity-7">#</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentUsers.map((file, index) => (
                                                        <tr key={index}>
                                                            <td className="text-center  text-sm font-weight-bolder opacity-8">
                                                                {file.room_typename}
                                                            </td>
                                                            <td className="text-center text-sm font-weight-bolder opacity-8">
                                                                {file.room_name}
                                                            </td>

                                                            {file.room_status === 1 ? (
                                                                <td className="text-center ">
                                                                    <span style={{ width: '70px' }} className="badge badge-sm bg-gradient-success">{ob_status[file.room_status]}</span>
                                                                </td>
                                                            ) : (
                                                                <td className="text-center ">
                                                                    <span style={{ width: '70px' }} className="badge badge-sm bg-gradient-danger">{ob_status[file.room_status]}</span>
                                                                </td>
                                                            )}
                                                            <td className="text-center ">
                                                                <button className="btn btn-primary" type='button' onClick={() => openModaledit(file.room_id)}>
                                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                                </button>
                                                                &nbsp;
                                                                <button className="btn btn-danger" type='button' onClick={() => deleterow(file.room_id)}>
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
                            <Form.Label>room_id</Form.Label>
                            <Form.Control
                                type="text"
                                value={room_id}
                                onChange={(e) => setroom_id(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> ประเภทห้อง</Form.Label>
                            <Form.Control
                                type="text"
                                value={room_typename}
                                onChange={(e) => setroom_typename(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> เลขห้อง</Form.Label>
                            <Form.Control
                                type="text"
                                value={room_name}
                                onChange={(e) => setroom_name(e.target.value)}
                            />
                        </Form.Group>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าห้อง</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={room_price}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            setroom_price(formattedValue);
                                            setroom_advance(formattedValue);

                                        }}
                                    />
                                </Form.Group>

                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่ามัดจำล่วงหน้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={room_advance}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            setroom_advance(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>


                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> ค่าประกัน</Form.Label>
                            <Form.Control
                                type="text"
                                value={room_guarantee}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    const formattedValue = Number(inputValue).toLocaleString('en-US');
                                    setroom_guarantee(formattedValue);

                                }}
                            />
                        </Form.Group>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าน้ำ/หน่วย</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={room_water}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            setroom_water(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>

                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> มิตเตอร์น้ำ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={room_meter_water}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            setroom_meter_water(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>

                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าไฟฟ้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={room_electricity}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            setroom_electricity(formattedValue);

                                        }}
                                    />
                                </Form.Group>

                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>

                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> มิตเตอร์ค่าไฟฟ้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={room_meter_electricity}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            setroom_meter_electricity(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>

                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าขยะ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={room_bin_price}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            setroom_bin_price(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group hidden>
                            <Form.Label>สถานะ</Form.Label>
                            <Form.Control
                                as="select"
                                value={room_status}
                                onChange={(e) => setroom_status(e.target.value)}>
                                <option value="1" >ว่าง</option>
                                <option value="2">ไม่ว่าง</option>

                            </Form.Control>
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
                            <Form.Label>room_id</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_room_id}
                                onChange={(e) => set_edit_room_id(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> ประเภทห้อง</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_room_typename}
                                onChange={(e) => set_edit_room_typename(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> เลขห้อง</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_room_name}
                                onChange={(e) => set_edit_room_name(e.target.value)}
                            />
                        </Form.Group>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าห้อง</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_room_price}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_room_price(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่ามัดจำล่วงหน้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_room_advance}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_room_advance(formattedValue);

                                        }}
                                    />
                                </Form.Group>

                            </div>
                        </div>
                        <Form.Group>
                            <Form.Label><span style={{ color: 'red' }}>*</span> ค่าประกัน</Form.Label>
                            <Form.Control
                                type="text"
                                value={edit_room_guarantee}
                                onChange={(e) => {
                                    const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                    const formattedValue = Number(inputValue).toLocaleString('en-US');
                                    set_edit_room_guarantee(formattedValue);

                                }}
                            />
                        </Form.Group>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าน้ำ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_room_water}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_room_water(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> มิตเตอร์น้ำ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_room_meter_water}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_room_meter_water(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าไฟฟ้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_room_electricity}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_room_electricity(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> มิตเตอร์ไฟฟ้า</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_room_meter_electricity}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_room_meter_electricity(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1', marginRight: '10px' }}>
                                <Form.Group>
                                    <Form.Label><span style={{ color: 'red' }}>*</span> ค่าขยะ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={edit_room_bin_price}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // เอาแต่ตัวเลข
                                            const formattedValue = Number(inputValue).toLocaleString('en-US');
                                            set_edit_room_bin_price(formattedValue);

                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group>
                            <Form.Label>สถานะ</Form.Label>
                            <Form.Control
                                as="select"
                                value={edit_room_status}
                                onChange={(e) => set_edit_room_status(e.target.value)}>
                                <option value="1" >ว่าง</option>
                                <option value="2">ไม่ว่าง</option>

                            </Form.Control>
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

export default Customers 
