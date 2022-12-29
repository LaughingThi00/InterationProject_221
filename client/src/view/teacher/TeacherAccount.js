import React, { useContext } from "react";

import { DataContext } from "./../../context/DataContext";
import { AuthContext } from "./../../context/AuthContext";
import { Navigate } from "react-router-dom";

const TeacherAccount = () => {
  const { TeacherList, ClassList } = useContext(DataContext);
  const { isAuthenticated, account, actor } = useContext(AuthContext);

  const teacher = TeacherList.find((i) => i.id === account.id);

  if (actor !== "TEACHER") return <Navigate  to="/" />;

  return (
    <>
      <div className="content">
        <h1>Tài khoản của tôi</h1>
        {/* =========================== GENERAL INFO ========================= */}
        <div className="DivAccount">
          <div>
            <h6>ID:</h6>
            <p>
              {teacher
                ? teacher.id
                  ? teacher.id
                  : "Chưa có"
                : "Chưa xác định"}
            </p>
          </div>

          <div>
            <h6>Tên:</h6>
            <p>
              {teacher
                ? teacher.name
                  ? teacher.name
                  : "Chưa có"
                : "Chưa xác định"}
            </p>
          </div>

          <div>
            <h6>Giới tính:</h6>
            <p>
              {teacher
                ? teacher.gender
                  ? teacher.gender
                  : "Chưa có"
                : "Chưa xác định"}
            </p>
          </div>

          <div>
            <h6>Tháng sinh:</h6>
            <p>
              {teacher
                ? teacher.birth
                  ? teacher.birth
                  : "Chưa có"
                : "Chưa xác định"}
            </p>
          </div>

          <div>
            <h6>Số điện thoại:</h6>
            <p>
              {teacher
                ? teacher.phone
                  ? teacher.phone
                  : "Chưa có"
                : "Chưa xác định"}
            </p>
          </div>

          <div>
            <h6>Email:</h6>
            <p>
              {teacher
                ? teacher.email
                  ? teacher.email
                  : "Chưa có"
                : "Chưa xác định"}
            </p>
          </div>

          <div>
            <h6>Mô tả:</h6>
            <p>
              {teacher
                ? teacher.description
                  ? teacher.description
                  : "Chưa có"
                : "Chưa xác định"}
            </p>
          </div>

          <div>
            <h6>Danh sách lớp dạy:</h6>
            {ClassList.map((item) => {
              return (
                item.teacher === account.id && (
                  <div className="editors_item" key={item}>
                    <div className="editors_item_content">{item.name}</div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherAccount;
