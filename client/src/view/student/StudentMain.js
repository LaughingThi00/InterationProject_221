import React, { useContext, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { DataContext } from '../../context/DataContext';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { AuthContext } from './../../context/AuthContext';
import { LogOutButton } from './../admin/AdminMain';


const StudentMain = () => {
  const {
    isAuthenticated,
    account,
    actor,
  }=useContext(AuthContext);

  if(actor!=="STUDENT") return (<Navigate replace to='/' />)

  return (
    <div>

      <div className="HeaderBar">
        <ul>
         
          <li>
            <Link to="/student/home">
              <button>Trang của tôi</button>
            </Link>
          </li>
          <li>
            <Link to="/student/thisday">
              <button>Ca học</button>
            </Link>
          </li>
        
          <li>
            <Link to="/student/account">
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

export default StudentMain