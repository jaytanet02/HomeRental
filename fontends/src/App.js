import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';

import Dashboard from './dashboard/main_dashboard';
import User from './user/main_user';
import Customer from './customer/main_customer';
import Room from './room/main_room';
// import Indexmain from './indexmain';
import Loginmain from './login/main_login';
import Paybyuser from './pay_by_user/main_pay_by_user';


// import Education from './education';


function App() {
  return (
    <HashRouter>

      <Routes>
        <Route path="/" element={<Navigate to="/main_login" />} />
        <Route path="/main_login" element={<Loginmain />} />
        <Route path="/main_pay_by_user" element={<Paybyuser />} />
        <Route path="/main_dashboard" element={<Dashboard />} />
        <Route path="/main_customer" element={<Customer />} />
        <Route path="/main_user" element={<User />} />
        <Route path="/main_room" element={<Room />} />

      </Routes>
    </HashRouter>
  );
}

export default App;
