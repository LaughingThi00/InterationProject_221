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
    console.log("Bi day tu AdminMain:",actor)
    return (<Navigate replace to='/' />)}

  return (
    <div>

      <div className="HeaderBar">
        <ul>
          <li>
            <Link to="/admin">
              <button>Logo</button>
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard">
              <button>Dashboard</button>
            </Link>
            
          </li>
          <li>
            <Link to="/admin/manage">
              <button>Quản lý</button>
            </Link>
          </li>
          <li>
            <Link to="/admin/account">
              <button>Tài khoản</button>
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
