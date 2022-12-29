import React from "react";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { Navigate } from "react-router-dom";
import DashChart from "../../component/DashChart";

const AdminDashboard = () => {
  const { actor } = useContext(AuthContext);
  if (actor !== "ADMIN") {
    console.log("Bi day tu Dashboard:", actor);

    return <Navigate  to="/" />;
  }
  return (
    <div>
      <div className="content">

      <DashChart />

      </div>
    </div>
  );
};

export default AdminDashboard;
