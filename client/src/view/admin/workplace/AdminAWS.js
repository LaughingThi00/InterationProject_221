import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Accordion, Form } from "react-bootstrap";
import { DataContext } from "./../../../context/DataContext";

export function AdminAWS() {
  const { AdminList,deleteAdmin } =
    useContext(DataContext);


  const handleDeleteAdmin =  (e) => {
     deleteAdmin(e.target.value);
  };

  return (
    <>
      <div className="table-fixed table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Mã</th>
              <th scope="col">Tên</th>
              <th scope="col"> Tùy chỉnh</th>
            </tr>
          </thead>

          <tbody>
            {AdminList.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.id}</td>
                  <td>{item.name ? item.name : "Không"}</td>

                  <td>
                    <AdminDetail detail={item.id} />

                    <Button
                      variant="danger"
                      onClick={handleDeleteAdmin}
                      value={item.id}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <AddAdmin />
      </div>
    </>
  );
}

export function AddAdmin() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {  addAdmin } = useContext(DataContext);
  //=========================== OBJECT =========================

  const [One, setOne] = useState({
    id: null,
    name: null,
    birth: null,
    phone: null,
    email: null,
    gender: null,
    description: null,
  });

  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleChange = (e) => {
    // if (e.target.value === "") return;
    // else 
    setOne({ ...One, [e.target.name]: e.target.value });
  };




  //=========================== HANDLE SUBMIT FUNCTION =========================
  const handleAdd = (e) => {
    e.preventDefault();

    addAdmin({
      ...One,
      id: `ADM${Math.floor(10000 * Math.random())}`,
    });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Thêm
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin admin mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}
          <>
            <Form onSubmit={handleAdd}>
              <Form.Group className="mb-3">
                <Form.Label>Tên admin</Form.Label>
                <Form.Control
                  placeholder="Điền tên admin vào đây..."
                  name="name"
                  // value={One.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tháng sinh</Form.Label>
                <Form.Control
                  name="birth"
                  type="month"
                  onChange={handleChange}
                  onClick={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giới tính:</Form.Label>
                <Form.Select
                name="gender"
                // type="gender"
                // value={admin.gender}
                onClick={handleChange}
              >
                <option key='0' value="Chưa biết">Chưa biết</option>
<option  key='1' value="Nam">Nam</option>
<option key='2'  value="Nữ">Nữ</option>

              </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  name="phone"
                  type="phone"
                  // value={One.phone}
                  onChange={handleChange}
                  onClick={handleChange}                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  // value={One.email}
                  onChange={handleChange}
                  onClick={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  name="description"
                  // value={One.description}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn gọn..."
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Thêm vào
              </Button>
            </Form>
          </>
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

export function AdminDetail({ detail }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { AdminList, ClassList } = useContext(DataContext);
  const admin = AdminList.find((i) => i.id === detail);

  const handleDeleteOneTeachedClass = (e) => {
    ClassList.find(c=>c.id===e.target.id).admin=null;  };
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
          <Modal.Title>Admin {admin ? admin.name : ""}</Modal.Title>
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
                    {admin
                      ? admin.id
                        ? admin.id
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Tên:</h6>
                  <p>
                    {admin
                      ? admin.name
                        ? admin.name
                        : "Chưa có"
                      : "Chưa xác định"}
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
                    {admin
                      ? admin.birth
                        ? admin.birth
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Số điện thoại:</h6>
                  <p>
                    {admin
                      ? admin.phone
                        ? admin.phone
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Email:</h6>
                  <p>
                    {admin
                      ? admin.email
                        ? admin.email
                        : "Chưa có"
                      : "Chưa xác định"}
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

                <div>
                  <h6>Danh sách lớp chủ nhiệm:</h6>
                  {ClassList.map((item) => {
                    return (
                      item.admin===detail&&<div className="editors_item" key={item}>
                        <div className="editors_item_content">
                          {item.name}
                        </div>

                        <i
                          id={item}
                          onClick={handleDeleteOneTeachedClass}
                          className="fa-solid fa-delete-left"
                        ></i>
                      </div>
                    );
                  })}
                </div>
                <UpdateAdmin detail={detail} />
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

export function UpdateAdmin({ detail }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { RoomList, ClassList, AdminList,updateAdmin } = useContext(DataContext);

  //=========================== OBJECT =========================

  const [One, setOne] = useState({
    id: null,
    name: null,
    birth: null,
    gender: null,
    phone: null,
    email: null,
    description: null,
  });

  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleChange = (e) => {
    if (e.target.value === "") return;
     else setOne({ ...One, [e.target.name]: e.target.value });
  };



  //=========================== HANDLE SUBMIT FUNCTION =========================
  const handleUpdate =  (e) => {
    e.preventDefault(); 
     updateAdmin({
      ...One,
      id: detail,
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
          <Modal.Title>Cập nhật thông tin admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}

          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Tên admin</Form.Label>
              <Form.Control
                name="name"
                onChange={handleChange}
              />
            </Form.Group>

            

            <Form.Group className="mb-3">
              <Form.Label>Tháng sinh</Form.Label>
              <Form.Control
                name="birth"
                type="month"
                onChange={handleChange}
                  onClick={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select
                name="gender"
                // type="gender"
                // value={admin.gender}
                onClick={handleChange}
              >
                <option key='0' value="Chưa biết">Chưa biết</option>
<option  key='1' value="Nam">Nam</option>
<option key='2'  value="Nữ">Nữ</option>

              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                name="phone"
                type="phone"
                onChange={handleChange}
                onClick={handleChange}              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                // value={One.email}
                onChange={handleChange}
                onClick={handleChange}              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                name="description"
                onChange={handleChange}
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
