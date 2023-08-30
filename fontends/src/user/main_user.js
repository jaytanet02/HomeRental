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
  const [user_id, setuser_id] = useState();
  const [user_name, set_user_name] = useState();
  const [user_username, set_user_username] = useState("");
  const [user_password, set_user_password] = useState("");
  const [user_status, set_user_status] = useState("admin");


  const [edit_user_id, set_edit_user_id] = useState();
  const [edit_user_name, set_edit_user_name] = useState();
  const [edit_user_username, set_edit_user_username] = useState();
  const [edit_user_password, set_edit_user_password] = useState();
  const [edit_user_status, set_edit_user_status] = useState();
  const [edit_user_usage, set_edit_user_usage] = useState();



  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const urlserver = "http://localhost:4000";
  // useEffect(() => {
  //   return () => {
  //     fetchUsers();
  //   }
  // }, []);


    // const urlserver = "https://homerentalbackend.onrender.com";

    const urlserver = "https://lazy-ruby-rooster-gown.cyclic.app";
  useEffect(() => {
    fetchUsers();
  }, []);

  const startIndex = (currentPage - 1) * 5;
  const endIndex = currentPage * 5;
  const currentUsers = users.slice(startIndex, endIndex);
  const changePage = (page) => {
    setCurrentPage(page);
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(urlserver + `/api_user`);
      setUsers(response.data);

      const num = response.data.length
      if (num > 0) {
        const fecth_user_id = await axios.get(urlserver + `/api_user?user_id=fetch_user_id_last`);
        const user_id_numlast = fecth_user_id.data[0].user_id;
        setuser_id(user_id_numlast + 1);
      } else {
        setuser_id(1);
      }
      setTotalPages(Math.ceil(response.data.length / 5));
      // const currentDate = new Date();
      // const formattedDate = currentDate.toISOString().split('T')[0];
      set_user_username("");
      set_user_password("");
      set_user_status("admin");


    } catch (error) {
      console.error(error);
    }
  };

  const fetchedit = async (id) => {


    try {
      const response = await axios.get(urlserver + `/api_user/edit?user_id=${id}`);

      set_edit_user_id(response.data[0].user_id);
      set_edit_user_name(response.data[0].user_name);
      set_edit_user_username(response.data[0].user_username);
      set_edit_user_password(response.data[0].user_password);
      set_edit_user_status(response.data[0].user_status);
      set_edit_user_usage(response.data[0].user_usage);
      setShowModaledit(true);
    } catch (error) {
      console.error(error);
    }
  };
  const deleterow = async (id) => {
    Swal.fire({
      title: "ต้องการลบผู้ใช้งานหรือไม่?",
      text: "การดำเนินการนี้จะปรับสถานะผู้ใช้งานเป็นไม่ใช้งาน",
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
            urlserver + `/api_user/delete?user_id=${id}`
          );
          console.log(response.data); // ตัวอย่างการใช้งาน response ที่ได้จาก server

          if (response.data !== "") {
            Swal.fire({
              title: "สำเร็จ",
              text: "ปรับสถานะผู้ใช้งานเป็นไม่ใช้งาน",
              icon: "success",
            });
            fetchUsers();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };


  const ob_status = {
    1: 'ใช้งาน',
    2: 'ไม่ใช้งาน',
  };


  const openModal = () => {
    setShowModal(true);

  };
  const closeModal = () => {
    setShowModal(false);
  };

  const closeModaledit = () => {
    setShowModaledit(false);
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    try {


      const response = await axios.post(urlserver + `/api_user/create`, {
        user_id,
        user_name,
        user_username,
        user_password,
        user_status
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

      const response = await axios.put(urlserver + `/api_user/update`, {
        edit_user_id,
        edit_user_name,
        edit_user_username,
        edit_user_password,
        edit_user_status,
        edit_user_usage,

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
              เพิ่มข้อมูลผู้ใช้
            </button>
          </div>
          <div className="container-fluid py2">
            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-header pb-0">
                    <h6>ข้อมูลผู้ใช้งาน</h6>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table align-items-center mb-0">
                        <thead >
                          <tr >
                            <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7">ชื่อ-นามสกุล</th>
                            <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7">ผู้ใช้งาน</th>
                            <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7 ps-2">รหัสผ่าน</th>
                            <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7">สิทธิ์<br />การใช้งาน</th>
                            <th className="text-center  text-secondary text-xs font-weight-bolder opacity-7">สถานะ</th>
                            <th colSpan={2} className="text-center opacity-7">#</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((file, index) => (
                            <tr key={index} >
                              <td className="text-center  text-sm font-weight-bolder opacity-8">
                                {file.user_name}
                              </td>
                              <td className="text-center  text-sm font-weight-bolder opacity-8">
                                {file.user_username}
                              </td>
                              <td className="text-center text-sm font-weight-bolder opacity-8">
                                {file.user_password}
                              </td>
                              {file.user_status === "admin" ? (
                                <td className="text-center ">
                                  <span style={{ width: '70px' }} className="badge badge-sm bg-gradient-info">{file.user_status}</span>
                                </td>
                              ) : (
                                <td className="text-center ">
                                  <span style={{ width: '70px' }} className="badge badge-sm bg-gradient-warning">{file.user_status}</span>
                                </td>
                              )}
                              {file.user_usage === 1 ? (
                                <td className="text-center ">
                                  <span style={{ width: '70px' }} className="badge badge-sm bg-gradient-success">{ob_status[file.user_usage]}</span>
                                </td>
                              ) : (
                                <td className="text-center ">
                                  <span style={{ width: '70px' }} className="badge badge-sm bg-gradient-danger">{ob_status[file.user_usage]}</span>
                                </td>
                              )}
                              <td className="text-center ">
                                <button className="btn btn-primary" type='button' onClick={() => fetchedit(file.user_id)}>
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                &nbsp;
                                <button className="btn btn-danger" type='button' onClick={() => deleterow(file.user_id)}>
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
          <Modal.Title>เพิ่มข้อมูลผู้ใช้</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={handleSignup}>
            <Form.Group hidden>
              <Form.Label>user_id</Form.Label>
              <Form.Control
                type="text"
                value={user_id}
                onChange={(e) => setuser_id(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label><span style={{ color: 'red' }}>*</span> ชื่อ-นามสกุล</Form.Label>
              <Form.Control
                type="text"
                value={user_name}
                onChange={(e) => set_user_name(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label><span style={{ color: 'red' }}>*</span> ชื่อผู้ใช้</Form.Label>
              <Form.Control
                type="text"
                value={user_username}
                onChange={(e) => set_user_username(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label><span style={{ color: 'red' }}>*</span> รหัสผ่าน</Form.Label>
              <Form.Control
                type="text"
                value={user_password}
                onChange={(e) => set_user_password(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label><span style={{ color: 'red' }}>*</span> สิทธิ์การใช้งาน</Form.Label>
              <Form.Control
                as="select"
                value={user_status}
                onChange={(e) => set_user_status(e.target.value)}>
                <option value="admin" >admin</option>
                <option value="user">user</option>
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
              <Form.Label>user_id</Form.Label>
              <Form.Control
                type="text"
                value={edit_user_id}
                onChange={(e) => set_edit_user_id(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label><span style={{ color: 'red' }}>*</span> ชื่อ-นามสกุล</Form.Label>
              <Form.Control
                type="text"
                value={edit_user_name}
                onChange={(e) => set_edit_user_name(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label><span style={{ color: 'red' }}>*</span> ชื่อผู้ใช้</Form.Label>
              <Form.Control
                type="text"
                value={edit_user_username}
                onChange={(e) => set_edit_user_username(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label><span style={{ color: 'red' }}>*</span> รหัสผ่าน</Form.Label>
              <Form.Control
                type="text"
                value={edit_user_password}
                onChange={(e) => set_edit_user_password(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label><span style={{ color: 'red' }}>*</span> สิทธิ์การใช้งาน</Form.Label>
              <Form.Control
                as="select"
                value={edit_user_status}
                onChange={(e) => set_edit_user_status(e.target.value)}>
                <option value="admin" >admin</option>
                <option value="user">user</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>สถานะ</Form.Label>
              <Form.Control
                as="select"
                value={edit_user_usage}
                onChange={(e) => set_edit_user_usage(e.target.value)}>
                <option value="1" >ใช้งาน</option>
                <option value="2">ไม่ใช้งาน</option>

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
