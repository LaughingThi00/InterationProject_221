import React, { useContext } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./../../context/AuthContext";
import { LogOutButton } from "./../admin/AdminMain";

const TeacherMain = () => {
  const { actor,account} = useContext(AuthContext);

  if (actor !== "TEACHER") return <Navigate  to="/" />;

  return (
    <div>
      <div className="HeaderBar">
      {account&&<div className="header-welcome-text">Xin chào {account.name}!</div>}

        <ul>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "activeButton" : "normalButton"
              }
              end
              to="/teacher/home"
            >
              Trang của tôi
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "activeButton" : "normalButton"
              }
              end
              to="/teacher/thisday"
            >
              Ca dạy
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "activeButton" : "normalButton"
              }
              end
              to="/teacher/account"
            >
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

export default TeacherMain;
