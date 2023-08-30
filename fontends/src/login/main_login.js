import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Import Sweetalert
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
function App() {
    const [user_username, set_user_username] = useState('');
    const [user_password, set_user_password] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate


    // const urlserver = "http://localhost:4000";
    // const urlserver = "https://homerentalbackend.onrender.com";
    const urlserver = "https://lazy-ruby-rooster-gown.cyclic.app";
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(urlserver + `/api_user?user_username=${user_username}&user_password=${user_password}`);
            sessionStorage.setItem('user', JSON.stringify(response.data));

            if (response.data.user_status === "admin" && response.data.user_usage === 1) {
                navigate('/main_dashboard');
            } else if (response.data.user_status === "user" && response.data.user_usage === 1) {
                navigate('/main_pay_by_user');
            } else if (response.data.user_usage === 2) {
                Swal.fire({
                    icon: 'error',
                    title: 'ผู้ใช้งานไม่มีสิทธิ์เข้าระบบ ',
                    text: 'กรุณาติดต่อเจ้าของห้องพัก',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'รหัสไม่ถูกต้อง',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดในการล็อกอิน กรุณาลองใหม่อีกครั้ง',
            });
        }
    };


    return (
        <div className="container-fluid">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12">
                    <div className="card bg-white my-5 mx-auto" style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                        <div className="card-body p-5 w-100 d-flex flex-column">
                            <center> <img src="../assets/img/logo-ct-dark.png" width={75} height={75} alt="bin" /></center>
                            <h4 className="fw-bold mb-2 text-center">Login</h4>
                            <p className="text-white-50 mb-3">Please enter your login and password!</p>
                            <Form.Group className="mb-4 w-100" controlId="formBasicEmail">
                                <Form.Label>Username/ID_Card</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={user_username}
                                    onChange={(e) => set_user_username(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4 w-100" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={user_password}
                                    onChange={(e) => set_user_password(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Remember password" />
                            </Form.Group><br />

                            <Button size="lg" onClick={handleLogin} style={{ backgroundColor: '#3b5998' }}>
                                Login
                            </Button>
                            <hr className="my-4" />
                            {/* <Button className="mb-2 w-100" size="lg" style={{ backgroundColor: '#dd4b39' }}>
                Sign in with google
              </Button>
              <Button className="mb-4 w-100" size="lg" >
                Sign in with facebook
              </Button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
