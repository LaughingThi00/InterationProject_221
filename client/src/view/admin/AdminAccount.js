import React, { useContext } from "react";

import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminAccount = () => {
  const { AdminList, ClassList } = useContext(DataContext);
  const { isAuthenticated, account, actor } = useContext(AuthContext);

  const admin = AdminList.find((i) => i.id === account.id);

  if (actor !== "ADMIN") return <Navigate replace to="/" />;

  return (
    <>
      <h1>Tài khoản của tôi</h1>
      {/* =========================== GENERAL INFO ========================= */}
      <div className="DivAccount">
        <div>
          <h6>ID:</h6>
          <p>{admin ? (admin.id ? admin.id : "Chưa có") : "Chưa xác định"}</p>
        </div>

        <div>
          <h6>Tên:</h6>
          <p>
            {admin ? (admin.name ? admin.name : "Chưa có") : "Chưa xác định"}
          </p>
        </div>

        <div>
          <h6>Giới tính:</h6>
          <p>
            {admin
              ? admin.gender
                ? admin.gender
                : "Chưa có"
              : "Chưa xác định"}
          </p>
        </div>

        <div>
          <h6>Tháng sinh:</h6>
          <p>
            {admin ? (admin.birth ? admin.birth : "Chưa có") : "Chưa xác định"}
          </p>
        </div>

        <div>
          <h6>Số điện thoại:</h6>
          <p>
            {admin ? (admin.phone ? admin.phone : "Chưa có") : "Chưa xác định"}
          </p>
        </div>

        <div>
          <h6>Email:</h6>
          <p>
            {admin ? (admin.email ? admin.email : "Chưa có") : "Chưa xác định"}
          </p>
        </div>

        <div>
          <h6>Mô tả:</h6>
          <p>
            {admin
              ? admin.description
                ? admin.description
                : "Chưa có"
              : "Chưa xác định"}
          </p>
        </div>

        <div></div>
      </div>
    </>
  );
};

export default AdminAccount;
