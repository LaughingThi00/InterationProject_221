import React from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";

export const LogOutButton = () => {
  const { logoutUser } = useContext(AuthContext);

  return (
    <button
      onClick={() => {
        logoutUser();
      }}
    >
      Log out
    </button>
  );
};

const AdminMain = () => {
  const { actor,account } = useContext(AuthContext);

  if (actor !== "ADMIN") {
    return <Navigate replace to="/" />;
  }

 

  return (
    <div>
      <div className="HeaderBar">
        {account&&<div className="header-welcome-text">Xin chào {account.name}!</div>}
        <ul>
          <li>
            <NavLink

              className={({ isActive }) => (isActive ?  "activeButton":"normalButton" )}
              end

              to="/admin/dashboard"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ?  "activeButton":"normalButton" )}
              end
              to="/admin/manage"
            >
              Quản lý
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ?  "activeButton":"normalButton" )}
              end
              to="/admin/account"
            >
              Tài khoản
            </NavLink>
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
