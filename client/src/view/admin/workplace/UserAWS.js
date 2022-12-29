import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Accordion, Form } from "react-bootstrap";
import { DataContext } from "./../../../context/DataContext";

export function UserAWS() {
  const {
    UserList,
    AdminList,
    InspectorList,
    TeacherList,
    StudentList,
    deleteUser,
  } = useContext(DataContext);
  const handleDeleteUser = (e) => {
    deleteUser(e.target.value);
  };
  
  const [list, setList] = useState(UserList);
  const [ActorFilter, setActorFilter] = useState(null);
  

  const sortByTimeLastest = () => {
    setList([
      ...UserList.sort((a, b) => {
        return (
          new Date(a.active_day).getTime() - new Date(b.active_day).getTime()
        );
      }).reverse(),
    ]);
  };

  const sortByTimeOldest = () => {
    setList([
      ...UserList.sort((a, b) => {
        return (
          new Date(b.active_day).getTime() - new Date(a.active_day).getTime()
        );
      }).reverse(),
    ]);
  };

  const filtByActor = (act) => {
    switch (act) {
      case "ADMIN":
        setList(
          list.filter((item) =>
            AdminList.find((itm) => itm.userId === item._id)
          )
        );
        break;
      case "INSPECTOR":
        setList(
          list.filter((item) =>
            InspectorList.find((itm) => itm.userId === item._id)
          )
        );
        break;
      case "TEACHER":
        setList(
          list.filter((item) =>
            TeacherList.find((itm) => itm.userId === item._id)
          )
        );
        break;
      case "STUDENT":
        setList(
          list.filter((item) =>
            StudentList.find((itm) => itm.userId === item._id)
          )
        );
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="table-fixed table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th colSpan="1" scope="col">
                #
              </th>
              <th colSpan="2" scope="col">
                Username
              </th>
              <th colSpan="2" scope="col">
                Loại
              </th>
              <th colSpan="2" scope="col">
                Ngày tạo
              </th>
              <th colSpan="2" scope="col">
                {" "}
                Tùy chỉnh
              </th>
            </tr>
          </thead>

          <tbody>
            {list.map((item, index) => {
              return (
                <tr key={index}>
                  <th colSpan="1" scope="row">
                    {index + 1}
                  </th>
                  <td colSpan="2">{item.username}</td>
                  <td colSpan="2">
                    {StudentList.find((itm) => itm.userId === item._id) ? (
                      "Học sinh"
                    ) : TeacherList.find((itm) => itm.userId === item._id) ? (
                      "Giáo viên"
                    ) : InspectorList.find((itm) => itm.userId === item._id) ? (
                      "Giám thị"
                    ) : AdminList.find((itm) => itm.userId === item._id) ? (
                      "Quản trị viên"
                    ) : (
                      <p className="red-text"> Không xác định</p>
                    )}
                  </td>
                  <td colSpan="2">
                    {item.active_day ? item.active_day : "Không"}
                  </td>

                  <td colSpan="2">
                    <UserDetail detail={item._id} />

                    <Button
                      variant="danger"
                      onClick={handleDeleteUser}
                      value={item._id}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: "center" }}>
        <Button variant="warning" onClick={sortByTimeLastest}>
          Sắp xếp (tạo gần nhất)
        </Button>
        <Button variant="warning" onClick={sortByTimeOldest}>
          Sắp xếp (tạo lâu nhất)
        </Button>
      </div>
      <div style={{ textAlign: "center" }}>
        <Form onSubmit={(e)=>{ e.preventDefault(); filtByActor(ActorFilter)}}>
              <Form.Label>Chọn loại người dùng</Form.Label>
              <Form.Select style={{display: 'inline-block', width:'30%',margin:'0 10px'}}
                onClick={(e)=>{setActorFilter(e.target.value)}}
                placeholder="Tên lớp"
              >
                <option key="0" value="">
                  Tất cả
                </option>
               
                    <option key="1" value="ADMIN">
                      Quản trị viên
                    </option>
                    <option key="1" value="INSPECTOR">
                      Giám thị
                    </option>
                    <option key="1" value="TEACHER">
                      Giáo viên
                    </option>
                    <option key="1" value="STUDENT">
                    Học viên
                    </option>
                  
              </Form.Select>

            <Button variant="info" type="submit" style={{marginTop:'5px'}}>
              Lọc lớp
            </Button>
          </Form>
      </div>
    </>
  );
}

export function UserDetail({ detail }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { UserList, AdminList, InspectorList, TeacherList, StudentList } =
    useContext(DataContext);
  const user = UserList.find((i) => i._id === detail);

  let account = StudentList.find((item) => item.userId === detail)
    ? StudentList.find((item) => item.userId === detail)
    : TeacherList.find((item) => item.userId === detail)
    ? TeacherList.find((item) => item.userId === detail)
    : InspectorList.find((item) => item.userId === detail)
    ? InspectorList.find((item) => item.userId === detail)
    : AdminList.find((item) => item.userId === detail)
    ? AdminList.find((item) => item.userId === detail)
    : null;

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Chi tiết
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>User {user ? user.username : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL INFO ========================= */}
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>ID:</h6>
                  <p>
                    {user ? (user._id ? user._id : "Chưa có") : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Username:</h6>
                  <p>
                    {user
                      ? user.username
                        ? user.username
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Mật khẩu:</h6>
                  <p className="red-text">Không được xem</p>
                </div>

                <div>
                  <h6>Ngày kích hoạt</h6>
                  <p>
                    {user
                      ? user.active_day
                        ? user.active_day
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Mail phục hồi:</h6>
                  <p>
                    {user
                      ? user.recovery_mail
                        ? user.recovery_mail
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <UpdateUser detail={detail} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin tài khoản</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>Loại:</h6>
                  <p>
                    {account
                      ? account.id.slice(0, 3) === "ADM"
                        ? "QUẢN TRỊ VIÊN"
                        : account.id.slice(0, 3) === "INS"
                        ? "GIÁM THỊ"
                        : account.id.slice(0, 3) === "TEA"
                        ? "GIÁO VIÊN"
                        : account.id.slice(0, 3) === "STU"
                        ? "HỌC SINH"
                        : "Không xác định"
                      : "Không có"}
                  </p>
                </div>

                <div>
                  <h6>Họ tên:</h6>
                  <p>
                    {account
                      ? account.name
                        ? account.name
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Giới tính:</h6>
                  <p>
                    {account
                      ? account.gender
                        ? account.gender
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Ngày sinh:</h6>
                  <p>
                    {account
                      ? account.birth
                        ? account.birth
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>
                <div>
                  <h6>Số điện thoại:</h6>
                  <p>
                    {account
                      ? account.phone
                        ? account.phone
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>
                <div>
                  <h6>Email:</h6>
                  <p>
                    {account
                      ? account.email
                        ? account.email
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>
                <div>
                  <h6>Mô tả:</h6>
                  <p>
                    {account
                      ? account.description
                        ? account.description
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>
                <UpdateUser detail={detail} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function UpdateUser({ detail }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { updateUser } = useContext(DataContext);

  //=========================== OBJECT =========================

  const [One, setOne] = useState({
    username: null,
    password: null,
    recovery_mail: null,
  });

  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleChange = (e) => {
    if (e.target.value === "") return;
    else setOne({ ...One, [e.target.name]: e.target.value });
  };

  //=========================== HANDLE SUBMIT FUNCTION =========================
  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser({
      ...One,
      _id: detail,
    });
  };

  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Chỉnh sửa
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}

          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                name="password"
                onChange={handleChange}
                onClick={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mail phục hồi mới</Form.Label>
              <Form.Control
                name="recovery_mail"
                onChange={handleChange}
                onClick={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Sửa
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
