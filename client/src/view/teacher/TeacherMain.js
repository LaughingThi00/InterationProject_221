import React, { useContext, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { DataContext } from '../../context/DataContext';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import TeacherDashboard from "./TeacherDashBoard";
import { AuthContext } from './../../context/AuthContext';
import { LogOutButton } from './../admin/AdminMain';


const TeacherMain = () => {
  const {
    isAuthenticated,
    account,
    actor,
  }=useContext(AuthContext);

  if(actor!=="TEACHER") return (<Navigate replace to='/' />)

  return (
    <div>

      <div className="HeaderBar">
        <ul>
         
          <li>
            <Link to="/teacher/home">
              <button>Trang của tôi</button>
            </Link>
          </li>
          <li>
            <Link to="/teacher/thisday">
              <button>Ca dạy</button>
            </Link>
          </li>
        
          <li>
            <Link to="/teacher/account">
              <button> Tài khoản</button>
            </Link>
          </li>
          <li>
          <LogOutButton />

          </li>
        </ul>
      </div>

      <div className="content">
                <Outlet />
      </div>
    </div>
  );
}











export default TeacherMain