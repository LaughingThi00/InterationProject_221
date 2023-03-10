import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Accordion, Form } from "react-bootstrap";
import { DataContext } from "../../../context/DataContext";
import InspectorDashboard from "../../inspector/InspectorMain";
import { ScheduleDetailButton } from "./ScheduleAWS";

export function ClassAWS() {
  const {
    ClassList,
    deleteClass,
    ScheduleList,
    StudentList,
    TeacherList,
    deleteOneSchedule,
  } = useContext(DataContext);
  useEffect(() => {
    ScheduleList.forEach((sc) => {
      if(! ClassList.find((c) => c.id === sc.class_)){
       
      }
      sc.class_ = ClassList.find((c) => c.id === sc.class_)
      ? sc.class_
      : null;

      if (!sc.class_) {

        deleteOneSchedule(sc.id);
        return;
      }
     
    });
  }, [ClassList]);

  return (
    <>
      <div className="table-fixed table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Tên lớp</th>
              <th scope="col">Chủ nhiệm </th>
              <th scope="col"> Tùy chỉnh</th>
            </tr>
          </thead>
          <tbody>
            {ClassList.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.id}</td>
                  <td>{item.name ? item.name : "Không"}</td>
                  <td>{item.teacher ? TeacherList.find(t=>t.id===item.teacher) ?TeacherList.find(t=>t.id===item.teacher).name : "Không":"Không"}</td>
                  <td>
                    <ClassDetailButton detail={item} />
                    <Button
                      variant="danger"
                      onClick={(e)=>{deleteClass(e.target.value)}}
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
        <AddClassButton />
      </div>
    </>
  );
}

export function AddClassButton() {
  //=========================== OBJECT =========================
  const [show, setShow] = useState(false);
  const [One, setOne] = useState({
    name: null,
    teacher: null,
    inspector: null,
    description: null,
  });

 

  const { ClassList, InspectorList ,addClass,TeacherList} = useContext(DataContext);

  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    if (e.target.value === "") return;
    setOne({ ...One, [e.target.name]: e.target.value });
  };
  const handleAdd = (e) => {
    if (ClassList.find(c=>c.name===One.name)) {
      alert(`Tên lớp trùng gây khó trong quản lý. Yêu cầu đổi tên!`);
      return;
    }
    e.preventDefault();
    addClass({...One,id: `CLS${Math.floor(10000 * Math.random())}`,num:0});
  };

  /* ================================================= FORM ================================================= */
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Thêm{" "}
      </Button>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin lớp mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}

          <Form onSubmit={handleAdd}>
            <h6 style={{ textAlign: "center" }}>Thông tin chung</h6>
            <Form.Group className="mb-3">
              <Form.Label>Đặt tên lớp</Form.Label>
              <Form.Control
                placeholder="Tên lớp"
                name="name"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chọn giáo viên</Form.Label>
              <Form.Select
                name="teacher"
                onClick={handleChange}
                onChange={handleChange}
                placeholder="Tên giáo viên"
                required
              >
                {TeacherList.map((teacher, index) => {
                  return (
                    teacher&&<option key={index} value={teacher.id}>
                      {teacher.name} &nbsp;{teacher.id}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chọn giám thị</Form.Label>
              <Form.Select
                name="inspector"
                onClick={handleChange}
                onChange={handleChange}
                placeholder="Tên giám thị"
                required
              >
                {InspectorList.map((ins, index) => {
                  return (
                    ins&&<option key={index} value={ins.id}>
                      {ins.name}&nbsp;{ins.id}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Có mô tả nào không?</Form.Label>
              <Form.Control
                name="description"
                onChange={handleChange}
                placeholder="Mô tả ngắn gọn"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Thêm vào
            </Button>
          </Form>

          <AddStudentInClassForm
            detail={
              ClassList.length !== 0
                ? ClassList[ClassList.length - 1].name === One.name
                  ? ClassList[ClassList.length - 1]
                  : { id: "", name: "", description: "", num: null }
                : { id: "", name: "", description: "", num: null }
            }
          />
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

export function ClassDetailButton({ detail }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const {InspectorList,TeacherList,StudentList,ScheduleList,ClassList,RoomList}=useContext(DataContext)

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
          <Modal.Title>Lớp {detail.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL INFO ========================= */}
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>Tên lớp:</h6>
                  <p>{detail?detail.name:"Không"}</p>
                </div>
                <div>
                  <h6>Giáo viên chủ nhiệm:</h6>
                  <p>{detail.teacher ? TeacherList.find(t=>t.id===detail.teacher)?TeacherList.find(t=>t.id===detail.teacher).name:"Không" : "Không"}</p>
                </div>
                <div>
                  <h6>Giám thị:</h6>
                  <p>{detail.inspector ?InspectorList.find(isp=>isp.id===detail.inspector)? InspectorList.find(isp=>isp.id===detail.inspector).name : "Không":"Không"}</p>
                </div>

                <div>
                  <h6>Mô tả:</h6>
                  <p>{detail.description ? detail.description : "Không"}</p>
                </div>
                <UpdateClassDetail detail={detail} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Danh sách thành viên{" "}
              </Accordion.Header>
              <Accordion.Body>
                <AddStudentInClassForm detail={detail} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Thời khóa biểu</Accordion.Header>
              <Accordion.Body>
              <div className="table-fixed table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" colSpan="1">
                #
              </th>
              <th scope="col" colSpan="2">
                ID
              </th>
              <th scope="col" colSpan="2">
                Lớp
              </th>
              <th scope="col" colSpan="2">
                Ngày
              </th>
              <th scope="col" colSpan="2">
                Phòng
              </th>
              <th scope="col" colSpan="2">
                {" "}
                Tùy chỉnh
              </th>
            </tr>
          </thead>
          <tbody>
            {ScheduleList.map((item, index) => {
              return (
                item.class_===detail.id&&<tr key={index}>
                  <th scope="row" colSpan="1">
                    {index + 1}
                  </th>
                  <td colSpan="2">{item.id}</td>
                  <td colSpan="2">
                    {item.class_
                      ? ClassList.find((c) => c.id === item.class_)
                        ? ClassList.find((c) => c.id === item.class_).name
                        : "Không"
                      : "Không"}
                  </td>
                  <td colSpan="2">{item.date}</td>
                  <td colSpan="2">
                    {item.room
                    ?RoomList.find((r) => r.id === item.room)
                      ? RoomList.find((r) => r.id === item.room).name
                      : "Phòng đã bị xóa": "Không"}
                  </td>
                  <td colSpan="2">
                    <ScheduleDetailButton detail={item} />
              
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

export function UpdateClassDetail({ detail }) {
  const {
    updateClass,
    InspectorList,
    TeacherList,
    StudentList,
    ClassList
    // , ClassList
  } = useContext(DataContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [One, setOne] = useState({
    id: detail.id,
    name: detail.name,
    teacher: detail.teacher,
    inspector: detail.inspector,
    description: detail.description,
  });


  const handleUpdate = (e) => {
    e.preventDefault();
    updateClass(One);
  };

  const handleChange = (e) => {
    if (e.target.value === "") return;
    setOne({ ...One, [e.target.name]: e.target.value });
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
        className="UpdateClassDetail-Modal"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa lớp {detail.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={handleUpdate}>
                  <h6 style={{ textAlign: "center" }}>Thông tin chung</h6>
                  <Form.Group className="mb-3">
                    <Form.Label>Đặt tên lớp</Form.Label>
                    <Form.Control
                      placeholder={detail.name}
                      name="name"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Chọn giáo viên</Form.Label>
                    <Form.Select
                      name="teacher"
                      onClick={handleChange}
                      onChange={handleChange}
                      className="form-control"
                    >
                      {TeacherList.map((teacher, index) => {
                        return (
                          <option key={index} value={teacher.id}>
                            {teacher.name}&nbsp;{teacher.id}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Chọn giám thị</Form.Label>
                    <Form.Select
                      name="inspector"
                      onClick={handleChange}
                      onChange={handleChange}
                    >
                      {InspectorList.map((ins, index) => {
                        return (
                          <option key={index} value={ins.id}>
                            {ins.name}&nbsp;{ins.id}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Có mô tả nào không?</Form.Label>
                    <Form.Control name="description" onChange={handleChange} />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Cập nhật
                  </Button>
                </Form>
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

export function AddStudentInClassForm({ detail }) {
  const { StudentList, updateClass, addStudentIn, deleteOneStudentIn } =
    useContext(DataContext);
  const [UpdatingClass, setUpdatingClass] = useState({
    id: detail.id,
    name: detail.name,
    teacher: detail.teacher,
    inspector: detail.inspector,
    description: detail.description,
    num: detail.num,
  });
  const currentStudentList = StudentList.filter((d) =>
    d.class_ ? (d.class_ === detail.id ? true : false) : false
  );
  const [student, setStudent] = useState(currentStudentList); //student[{}]  is list of all students detail-id class after updating
  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleStudentPick = (e) => {
    if (detail.id === "") {
      alert(`Chưa tạo lớp, vui lòng nhấn "Thêm vào"`);
      return;
    }
    if (e.target.value === "") return;
    const stu = StudentList.find((k) => k.id === e.target.value);
    if (!stu) {
      alert("Học sinh không tồn tại trong hệ thống");
      return;
    }
    if (!student.includes(stu)) {
      setStudent((student) => [...student, stu]);
      addStudentIn(detail.id, e.target.value);
    
    }
  };
  const handleDeleteStudent = (e) => {
    updateClass(UpdatingClass);
    setStudent(student.filter((d) => d.id !== e.target.value));
    deleteOneStudentIn(detail.id, e.target.value);
  };
  //=========================== HANDLE SUBMIT FUNCTION =========================

  const handleSubmitStudent = (e) => {
    e.preventDefault();
    updateClass(UpdatingClass);
  };

  const liststudentfilted = StudentList.filter((s) => !student.includes(s));
  useEffect(() => {
    setStudent(currentStudentList);
  }, [StudentList]);

  return (
    <Form onSubmit={handleSubmitStudent}>
      <div className="student-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" colSpan="1">
                #
              </th>
              <th scope="col" colSpan="4">
                Tên
              </th>

              <th scope="col" colSpan="1">
                {" "}
                Tùy chỉnh
              </th>
            </tr>
          </thead>
          <tbody>
            {student.map((st, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td colSpan="4">{st.name}</td>

                  <td colSpan="1">
                    <Button
                      name="day"
                      value={st.id}
                      variant="danger"
                      onClick={handleDeleteStudent}
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
      <div>
        <h6>Lớp hiện có {student.length} học sinh</h6>
      </div>
      <Form.Group>
        <Form.Control
          name="studentList"
          placeholder="Chọn và click chuột để thêm học sinh mới..."
          onClick={handleStudentPick}
          type="text"
          list="TheStudentList"
          className="TheStudentList-container"
          required
        />
        <datalist id="TheStudentList">
          {liststudentfilted.map((student, index) => {
            return (
              <option value={student.id} key={index}>
                {student.name}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </option>
            );
          })}
        </datalist>
      </Form.Group>
      <br></br>
      <Button variant="info" type="submit">
        Lưu danh sách
      </Button>
    </Form>
  );
}
