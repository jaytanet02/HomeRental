import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Swal from 'sweetalert2'; // นำเข้า Swal เป็น default import
export default function IndexMain() {
  const [fullname, setFullname] = useState("");
  const [status, setstatus] = useState("");
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    if (userData) {
      setFullname(userData.user_name);
      setstatus(userData.user_status);
    }
  }, [userData]);

  function checkbody() {
    document.body.classList.toggle('g-sidenav-show');
    document.body.classList.toggle('bg-gray-100');
    document.body.classList.toggle('g-sidenav-pinned');
  }
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const checkout = () => {
    sessionStorage.clear();
    Swal.fire({
      icon: 'warning',
      title: 'คุณต้องการออกจากระบบ ใช่หรือไหม ?',
      text: '',
      showCancelButton: true,
      showCloseButton: true,  // เพิ่มปุ่มปิด (X) ด้านขวาบน
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#28A745",
      cancelButtonColor: "#DC3545",
    }).then(async (result) => {
      if (result.isConfirmed) {
        navigate('/main_login');
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  };
  return (

    <>
      <body className="g-sidenav-show   bg-gray-100" >
        <Navbar />
        <main className="main-content position-relative border-radius-lg ">
          <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl " id="navbarBlur" data-scroll="false">
            <div className="container-fluid py-1 px-3">
              <nav aria-label="breadcrumb">
              </nav>


              <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                <div className="ms-md-auto pe-md-3 d-flex align-items-center">

                </div>

                <ul className="navbar-nav  justify-content-end">
                  <li className="nav-item d-flex align-items-center">
                    <Button className="btn btn-warning" onClick={openModal}>
                      <i className="fa fa-user me-sm-1"></i>
                      {"  " + fullname}
                    </Button>
                  </li>
                  <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                    <label >
                      <div className="nav-link text-white p-0" onClick={checkbody}>
                        <div className="sidenav-toggler-inner">
                          <i className="sidenav-toggler-line bg-white"></i>
                          <i className="sidenav-toggler-line bg-white"></i>
                          <i className="sidenav-toggler-line bg-white"></i>
                        </div>
                      </div>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </main>
      </body>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>ข้อมูลส่วนตัว</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Form >
            <Form.Group>
              <Form.Label> ชื่อ-นามสกุล</Form.Label>
              <Form.Control
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>สถานะ</Form.Label>
              <Form.Control
                type="text"
                value={status}
                onChange={(e) => setstatus(e.target.value)}
                readOnly
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="success" onClick={checkout}>
                ออกจากระบบ
              </Button>
              <Button variant="danger" onClick={closeModal}>
                ปิด
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>


  )
}
