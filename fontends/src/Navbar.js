import React from 'react'
import { Link } from 'react-router-dom';

function Navbar() {

  function checkbody() {
    document.body.classList.toggle('g-sidenav-show');
    // หากมีคลาส "bg-gray-100" ใน <body> ให้ลบออก
    document.body.classList.toggle('bg-gray-100');
    // หากมีคลาส "g-sidenav-pinned" ใน <body> ให้ลบออก
    document.body.classList.toggle('g-sidenav-pinned');


  };

  return (
    <>

      <div className="min-height-300 bg-primary position-absolute w-100"></div>
      <aside className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 " id="sidenav-main">
        <div className="sidenav-header">
          <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
          <div className="navbar-brand m-0" >
            <img src="../assets/img/logo-ct-dark.png" className="navbar-brand-img h-100" alt="main_logo" />
            <span className="ms-1 font-weight-bold"> ห้องเช่า</span>
          </div>
        </div>
        <hr className="horizontal dark mt-0" />
        <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/main_dashboard" className="nav-link" onClick={checkbody}>
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">ภาพรวม</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/main_customer" className="nav-link" onClick={checkbody}>
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-credit-card text-success text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">ลูกบ้าน</span>
              </Link>
            </li>
            <li className="nav-item">
              {/* เพิ่ม Link เพื่อลิ้งก์ไปยังหน้า table_user.js */}
              <Link to="/main_room" className="nav-link" onClick={checkbody}>
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-calendar-grid-58 text-warning text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">ห้องเช่า</span>
              </Link>
            </li>



            <li className="nav-item">
              <Link to="/main_user" className="nav-link" onClick={checkbody}>
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-single-02 text-dark text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">ผู้ใช้งาน</span>
              </Link>
            </li>

          </ul>
        </div>

      </aside>

    </>
  )
}

export default Navbar
