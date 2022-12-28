import React, { useState, useContext } from "react";
import { Button, Modal, Accordion, Form } from "react-bootstrap";
import { DataContext } from "../../../context/DataContext";

export function StudentAWS() {
  const { ClassList, StudentList, deleteStudent } = useContext(DataContext);
  const handleDeleteStudent = async (e) => {
    await deleteStudent(e.target.value);
  };

  return (
    <>
      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Họ Tên</th>
              <th scope="col">Lớp </th>
              <th scope="col"> Tùy chỉnh</th>
            </tr>
          </thead>

          <tbody>
            {StudentList.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.id}</td>
                  <td>{item.name ? item.name : "Không"}</td>
                  <td>
                    {ClassList.find((c) => c.id === item.class_) ? (
                      ClassList.find((c) => c.id === item.class_).name
                    ) : (
                      <p style={{ color: "red" }}>Chưa có</p>
                    )}
                  </td>
                  <td>
                    <StudentDetailButton detail={item} />
                    <Button
                      variant="danger"
                      onClick={handleDeleteStudent}
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
        <AddStudentButton />
      </div>
    </>
  );
}

export function AddStudentButton() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { ClassList, addStudent } = useContext(DataContext);
  //=========================== OBJECT =========================
  const [StudentTarget, setStudentTarget] = useState({
    name: null,
    gender: null,
    birth: null,
    email: null,
    phone: null,
    description: null,
    class_: null,
  });
  // const {
  //   name,
  //   phone,
  //   desc,
  //   class,
  //   gender,
  //   birth,
  //   email,
  // } = StudentTarget;

  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleChange = (e) => {
    if (e.target.value === "") return;
    if (e.target.name === "birth") {
      const d = new Date(e.target.value);
      setStudentTarget({ ...StudentTarget, birth: d.toLocaleDateString('en-GB') });
    } else
      setStudentTarget({ ...StudentTarget, [e.target.name]: e.target.value });
  };

  //=========================== HANDLE SUBMIT FUNCTION =========================
  const handleAdd = (e) => {
    e.preventDefault();
    addStudent({
      ...StudentTarget,
      id: `STU${Math.floor(10000 * Math.random())}`,
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
          <Modal.Title>Thông tin học sinh mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}

          <Form onSubmit={(e) => handleAdd(e)}>
            <h6 style={{ textAlign: "center" }}>Thông tin chung</h6>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên học sinh</Form.Label>
              <Form.Control
                placeholder="Họ tên đầy đủ..."
                name="name"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Control name="gender" onChange={handleChange} as="select">
                <option key="-" value="">
                  Chọn...{" "}
                </option>

                <option key="1" value="Nam">
                  Nam{" "}
                </option>
                <option key="2" value="Nữ">
                  Nữ{" "}
                </option>
                <option key="3" value="Chưa biết">
                  Chưa biết{" "}
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control name="birth" type="date" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                onChange={handleChange}
                placeholder="Nhập email..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cập nhật số điện thoại</Form.Label>
              <Form.Control
                placeholder="Nhập số điện thoại..."
                name="phone"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                name="description"
                onChange={handleChange}
                placeholder="Mô tả ngắn gọn..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chọn lớp</Form.Label>
              <Form.Select
                name="class_"
                onClick={handleChange}
                placeholder="Tên lớp"
                className="form-control"
              >
                <option key="0" value="">
                  Không
                </option>
                {ClassList.map((classItem, index) => {
                  return (
                    <option key={index} value={classItem.id}>
                      {classItem.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Thêm vào
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

export function StudentDetailButton({ detail }) {
  const { ClassList } = useContext(DataContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="info" onClick={handleShow}>
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
          <Modal.Title>Chi tiết học sinh</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>Tên học sinh:</h6>
                  <p>{detail.name}</p>
                </div>

                <div>
                  <h6>Sinh nhật:</h6>
                  <p>{detail.birth ? detail.birth : "Không"}</p>
                </div>

                <div>
                  <h6>Giới tính:</h6>
                  <p>{detail.gender ? detail.gender : "Không"}</p>
                </div>

                <div>
                  <h6>Số điện thoại:</h6>
                  <p>{detail.phone ? detail.phone : "Không"}</p>
                </div>

                <div>
                  <h6>Email:</h6>
                  <p>{detail.email ? detail.email : "Không"}</p>
                </div>

                <div>
                  <h6>Lớp:</h6>
                  <p>
                    {ClassList.find((c) => c.id === detail.class_)
                      ? ClassList.find((c) => c.id === detail.class_).name
                      : "Không"}{" "}
                    ({detail.class_})
                  </p>
                </div>

                <div>
                  <h6>Tên giáo viên chủ nhiệm:</h6>
                  <p>
                    {ClassList.find((c) => c.id === detail.class_)
                      ? ClassList.find((c) => c.id === detail.class_).teacher
                      : "Không"}
                  </p>
                </div>

                <div>
                  <h6>Chú thích:</h6>
                  <p>{detail.description ? detail.description : "Không"}</p>
                </div>
                <UpdateStudentButton student={detail} />
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

export function UpdateStudentButton({ student }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { ClassList, updateStudent } = useContext(DataContext);
  //=========================== OBJECT =========================
  const [StudentTarget, setStudentTarget] = useState({
    id: student.id,
    name: student.name,
    gender: student.gender,
    birth: student.birth,
    email: student.email,
    phone: student.phone,
    description: student.description,
    class_: student.class_,
  });

  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleChange = (e) => {
    if (e.target.value === "") return;
    if (e.target.name === "birth") {
      const d = new Date(e.target.value);
      setStudentTarget({ ...StudentTarget, birth: d.toLocaleDateString('en-GB') });
    } else
      setStudentTarget({ ...StudentTarget, [e.target.name]: e.target.value });
  };

  //=========================== HANDLE SUBMIT FUNCTION =========================
  const handleUpdate = (e) => {
    e.preventDefault();
    updateStudent(StudentTarget);
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
          <Modal.Title>Chỉnh sửa thông tin học sinh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}

          <Form onSubmit={(e) => handleUpdate(e)}>
            <h6 style={{ textAlign: "center" }}>Thông tin chung</h6>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên học sinh</Form.Label>
              <Form.Control
                defaultValue={student.name}
                name="name"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Control name="gender" onChange={handleChange} as="select">
                <option key="-" value="">
                  {student.gender}...{" "}
                </option>

                <option key="1" value="Nam">
                  Nam{" "}
                </option>
                <option key="2" value="Nữ">
                  Nữ{" "}
                </option>
                <option key="3" value="Chưa biết">
                  Chưa biết{" "}
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                name="birth"
                type="date"
                onChange={handleChange}
                defaultValue={student.birth}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                onChange={handleChange}
                placeholder={student.email}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cập nhật số điện thoại</Form.Label>
              <Form.Control
                placeholder={student.phone}
                name="phone"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                name="description"
                onChange={handleChange}
                placeholder={student.description}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chọn lớp</Form.Label>
              <Form.Select
                name="class_"
                onClick={handleChange}
                placeholder="Tên lớp"
                className="form-control"
              >
                <option key="0" value="">
                  Lớp cũ: {student.class_ ? student.class_ : "Không"} &nbsp;{" "}
                  {student.class_
                    ? ClassList.find((c) => c.id === student.class_).name
                    : "Không"}
                </option>
                {ClassList.map((classItem, index) => {
                  return (
                    <option key={index} value={classItem.id}>
                      {classItem.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Button variant="info" type="submit">
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
