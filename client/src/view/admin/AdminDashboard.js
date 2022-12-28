import React from "react";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { actor } = useContext(AuthContext);
  if (actor !== "ADMIN") {
    console.log("Bi day tu Dashboard:", actor);

    return <Navigate replace to="/" />;
  }
  return (
    <div>
      <div className="content"></div>
    </div>
  );
};

export default AdminDashboard;
