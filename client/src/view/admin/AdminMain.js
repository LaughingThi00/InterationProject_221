import React from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from './../../context/AuthContext';

export const LogOutButton=()=>{
  const {
    logoutUser
  }=useContext(AuthContext);

  return(
    <button onClick={()=>{console.log("Tu out");logoutUser();}}>Log out</button>

  )
}

const AdminMain = () => {
  const {
   actor
  }=useContext(AuthContext);

  if(actor!=="ADMIN") {
    return (<Navigate replace to='/' />)}

  return (
    <div>

      <div className="HeaderBar">
        <ul>
       
          <li>
            <Link to="/admin/dashboard">
              <button className={window.location.pathname==='/admin/dashboard'? "yellow-button butt": "butt"}>Dashboard</button>
            </Link>
          </li>
          <li >
            <Link to="/admin/manage">
              <button className={window.location.pathname==='/admin/manage'? "yellow-button butt": "butt"}>Quản lý</button>
            </Link>
          </li>
          <li>
            <Link to="/admin/account">
              <button className={window.location.pathname==='/admin/account'? "yellow-button": "butt"}>Tài khoản</button>
            </Link>
          </li>
          <li>
          <LogOutButton />
          </li>
        </ul>
      </div>

        <Outlet />
    </div>
  );
};

export default AdminMain;
