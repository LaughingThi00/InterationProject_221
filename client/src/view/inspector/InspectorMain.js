import React from "react";
import { Link, Outlet } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from "react-router-dom";
import { LogOutButton } from './../admin/AdminMain';
const InspectorMain = () => {
  
  const {
    actor,
  }=useContext(AuthContext);
  if(actor!=="INSPECTOR") return (<Navigate replace to='/' />)

  return (
    <div>
      <div className="HeaderBar" >
        <ul>
          <li>
            <Link to="/inspector/home">
              <button >Trang của tôi</button>
            </Link>
          </li>
          <li>
            <Link to="/inspector/thisday">
              <button>Ca trực</button>
            </Link>
          </li>

          <li>
            <Link to="/inspector/account">
              <button > Tài khoản</button>
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
};


export default InspectorMain;
