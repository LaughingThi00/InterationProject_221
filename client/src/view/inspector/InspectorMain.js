import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from "react-router-dom";
import { LogOutButton } from './../admin/AdminMain';
const InspectorMain = () => {
  
  const {
    actor,account
  }=useContext(AuthContext);
  if(actor!=="INSPECTOR") return (<Navigate replace to='/' />)

  return (
    <div>
      <div className="HeaderBar" >
      {account&&<div className="header-welcome-text">Xin chào {account.name}!</div>}

        <ul>
          <li>
            <NavLink 
            
            className={({ isActive }) => (isActive ?  "activeButton":"normalButton" )}
            end


            to="/inspector/home">
              Trang của tôi
            </NavLink>
          </li>
          <li>
            <NavLink 
              className={({ isActive }) => (isActive ?  "activeButton":"normalButton" )}
              end

to="/inspector/thisday">
              Ca trực
            </NavLink>
          </li>

          <li>
            <NavLink 
              className={({ isActive }) => (isActive ?  "activeButton":"normalButton" )}
              end

to="/inspector/account">
             Tài khoản
            </NavLink>
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
