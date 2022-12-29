import React, { useContext } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./../../context/AuthContext";
import { LogOutButton } from "./../admin/AdminMain";

const StudentMain = () => {
  const { actor,account } = useContext(AuthContext);

  if (actor !== "STUDENT") return <Navigate replace to="/" />;

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
              to="/student/home"
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
              to="/student/thisday"
            >
              Ca học
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "activeButton" : "normalButton"
              }
              end
              to="/student/account"
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

export default StudentMain;
