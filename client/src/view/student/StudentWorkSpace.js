import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { Accordion, Button, ProgressBar } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { CompleteOneAttendanceToday } from "./../admin/workplace/AttendanceAWS";
import { StudentDetailButton } from "../admin/workplace/StudentAWS";
import { compareDateString } from "./StudentDashBoard";
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from "react-router-dom";

const StudentWorkSpace = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    ClassList,
    ScheduleList,
    RoomList,
    AttendanceList,
    StudentList,
    TeacherList,
    AdminList,
    InspectorList,
    deleteAttendance,
  } = useContext(DataContext);
  const {
    isAuthenticated,
    account,
    actor,
  }=useContext(AuthContext);
  //for table, detail

  const now = new Date();
  
  const datenow = now.toLocaleDateString('en-GB');
  
  const myclass = account.class_;
  
  const [schedulenow, setScheduleNow] = useState([]);
  useState(() => {
    setScheduleNow([]);
  }, [account]);

  const [ThisSchedule, setThisSchedule] = useState(null);
  const handleJoin = (e) => {
    setThisSchedule(e.target.value);
    handleShow();
  };
  let idx = 0;
  console.log(ThisSchedule)
  const Schedule = ThisSchedule
    ? ScheduleList.find((s) => s.id === ThisSchedule)
    : null;
  const Class = ThisSchedule
    ? ClassList.find((c) => c.id === Schedule.class_)
    : null;

    let numClass=StudentList.filter(item=>ThisSchedule&&item.class_===Schedule.class_).length
  //for statistics purposes
  let Statistic = {
    total: ThisSchedule ? numClass : 0,
    unchecked: 0,
    lated: 0,
    present: 0,
    transit:0,
    isPrechecked: false,
    isTeacherPresent:false
  };


  const myattendance= AttendanceList.find(a=>a.id_target===account.id&&schedulenow.find(s=>s.id===a.id_schedule))
  let mylasteditor
  if(myattendance){
    if(AdminList.find(element=>element.id===myattendance.id_last_editor)){
      mylasteditor = AdminList.find(element=>element.id===myattendance.id_last_editor)
    }
    else if(TeacherList.find(element=>element.id===myattendance.id_last_editor)){
      mylasteditor = TeacherList.find(element=>element.id===myattendance.id_last_editor)
    }
    else if(InspectorList.find(element=>element.id===myattendance.id_last_editor)){
      mylasteditor = InspectorList.find(element=>element.id===myattendance.id_last_editor)
    }
    else mylasteditor=StudentList.find(element=>element.id===myattendance.id_last_editor)
  }
  

  AttendanceList.forEach((att) => {
    if (att.id_schedule === ThisSchedule)
      if (att.id_target.substring(0, 3) === "STU")
        {if(!att.debt_schedule)
            switch (att.type) {
          case "UNCHECKED":
            ++Statistic.unchecked;
            break;

          case "LATED":
            ++Statistic.lated;
            break;

          case "PRESENT":
            ++Statistic.present;
            break;

          default:
            break;
        }
    else ++Statistic.transit;
    }
      else if (att.id_target.substring(0, 3) === "TEA") {
        if (att.type !== "UNCHECKED") Statistic.isTeacherPresent = true;
      } else {
        if (att.prenum) Statistic.isPrechecked = true;
      }
  });
  let ssnow=Statistic.total? Math.floor(100*(Statistic.present+Statistic.lated)/Statistic.total) :0;


  const PlusWorkDay = AttendanceList.find(item=>item.id_target===account.id&&item.debt_schedule);
  let PlusSchedule= PlusWorkDay? ScheduleList.find(item=>item.id===PlusWorkDay.id_schedule):null;
   
  if(actor!=="STUDENT") return (<Navigate  to='/' />)

  return (
    <>
    <h1>TIẾT HỌC HÔM NAY</h1>
      {schedulenow.map((item, index) => {
        return (
          <h2 key={index}>
            Ca {index===0? "đầu tiên": `thứ ${index+1}`} diễn ra vào {item.starttime}, kết thúc lúc{" "}
            {item.endtime} ở phòng{" "}
            {RoomList.find((r) => r.id === item.room).name}.
          </h2>
        );
      })}
{PlusWorkDay&&<> 
          <h2 >
            Hôm nay, bạn được học bù ở lớp  {PlusSchedule.class_?ClassList.find(itm=>itm.id===PlusSchedule.class_).name: 'Không xác định'} diễn ra vào {PlusSchedule.starttime}, kết thúc lúc{" "}
            {PlusSchedule.endtime} ở phòng{" "}
            {RoomList.find((r) => r.id === PlusSchedule.room).name}. 
          </h2>
          <Button
                          variant="success"
                          value={PlusWorkDay.id_schedule}
                          onClick={handleJoin}
                        >
                          {" "}
                          Tham gia
                        </Button>
          </>
        }
      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" colSpan="1">
                #
              </th>

              <th scope="col" colSpan="2">
                Lớp
              </th>
              <th scope="col" colSpan="2">
                Bắt đầu
              </th>
              <th scope="col" colSpan="2">
                Kết thúc
              </th>
              <th scope="col" colSpan="2">
                Phòng
              </th>
              <th scope="col" colSpan="3">
                {" "}
                Tùy chỉnh
              </th>
            </tr>
          </thead>
          <tbody>
            {ScheduleList.map((item, index) => {
             if (
              item.class_===myclass &&
              compareDateString(datenow, item.date) === 0
            ) {
              if (!schedulenow.includes(item))
                setScheduleNow([...schedulenow, item]);
            }
            return (
              item.class_===myclass &&
              compareDateString(datenow, item.date) === 0 && (
                  <tr key={index}>
                    <th scope="row" colSpan="1">
                      {index + 1}
                    </th>
                    <td colSpan="2">
                      {ClassList.find((c) => c.id === item.class_).name}
                    </td>
                    <td colSpan="2">{item.starttime}</td>
                    <td colSpan="2">{item.endtime}</td>
                    <td colSpan="2">
                      {item.room
                        ? RoomList.find((r) => r.id === item.room)
                          ? RoomList.find((r) => r.id === item.room).name
                          : "Phòng đã bị xóa"
                        : "Không"}
                    </td>
                    <td colSpan="3">
                      <ScheduleDetailButton detail={item} />
                      {compareDateString(datenow, item.date) === 1 ? (
                        <Button variant="warning" value={item.id}>
                          Xem lại{" "}
                        </Button>
                      ) : compareDateString(datenow, item.date) === -1 ? (
                        <Button variant="dark" value={item.id}>
                          Xem trước{" "}
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          value={item.id}
                          onClick={handleJoin}
                        >
                          {" "}
                          Tham gia
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </div>
      <br></br>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
        className="InspectorClass-Modal"
      >
        <Modal.Header>
          <Modal.Title>Lớp học hôm nay</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Accordion defaultActiveKey={["0","1"]} alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Thống kê</Accordion.Header>
                <Accordion.Body>
                  <div>
                    Lấp đầy hiện tại (chính quy):
                    <br></br>
                    <br></br>

                    <ProgressBar animated now={ssnow} label={`${ssnow}%`} />
                    <br></br>
                    Học sinh:
                    <br></br>
                    -Tổng số hôm nay: {Statistic.transit+Statistic.total}
                    <br></br>
                    -Đi học bù: {Statistic.transit}/{Statistic.transit+Statistic.total}
                    <br></br>                    <br></br>

                    -Học chính khóa: {Statistic.total}
                    <br></br>
                    -Chưa điểm danh: {Statistic.unchecked}/{Statistic.total}
                    <br></br>
                    -Vào trễ: {Statistic.lated}/{Statistic.total}
                    <br></br>
                    -Có mặt: {Statistic.present}/{Statistic.total}
                    <br></br>
                    <br></br>

                    Giáo viên đã điểm danh: {Statistic.isTeacherPresent? <div className="green-text">Rồi</div>:<div className="red-text">Chưa</div>}
                    <br></br>
                    Giám thị đã kiểm tra đầu giờ: {Statistic.isPrechecked? <div className="green-text">Rồi</div>:<div className="red-text">Chưa</div>}
                  </div>

                  <ScheduleDetailButton
                    detail={ThisSchedule ? Schedule : null}
                  />
                  <ClassDetailButton
                    detail={
                      ThisSchedule
                        ? ClassList.find(
                            (c) =>
                              c.id ===
                              ScheduleList.find((s) => s.id === ThisSchedule)
                                .class_
                          )
                        : null
                    }
                  />
                  <StudentDetail detail={ThisSchedule ? Class.teacher : null} /> {/*Cho nay ban dau la TeacherDetail*/}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Điểm danh của bạn</Accordion.Header>
                <Accordion.Body>
                <div>
                  <h6>Trạng thái hiện tại:</h6>
                  <p>{myattendance ? myattendance.type : "Chưa tạo"}</p>
                </div>

                <div>
                  <h6>Thời gian cập nhật cuối cùng:</h6>
                  <p>{myattendance ? myattendance.datetime_update : "Chưa tạo"}</p>
                </div>
                
                <div>
                  <h6>Người chỉnh sửa cuối:</h6>
                  <p>{myattendance ? mylasteditor? `${mylasteditor.name} (${mylasteditor.id})`:"Lỗi" : "Chưa tạo"}</p>
                </div>
                
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
          {myattendance?myattendance.isSelfCheck
                ?<p className="green-text">Điểm danh đã được mở. Hãy hoàn tất ghi danh ngay!</p>
                :<p className="yellow-text">Bạn chưa có quyền tự điểm danh!</p>
                :<p className="green-text">Điểm danh đã được mở. Hãy liên hệ với giáo viên hoặc giám thị trực!</p>
                }
          <br></br>
        </Modal.Body>
        <Modal.Footer>
          <div className="GroupButonInspectorClass">
            {myattendance&&myattendance.isSelfCheck&&<CompleteOneAttendanceToday attendance={myattendance.id} />}
          </div>
          <Button variant="dark" onClick={handleClose}>
            Rời lớp
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

function ClassDetailButton({ detail }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { InspectorList, TeacherList } = useContext(DataContext);
  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Thông tin lớp
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
                  <p>{detail ? detail.name : "Không"}</p>
                </div>
                <div>
                  <h6>Giáo viên chủ nhiệm:</h6>
                  <p>
                    {detail.teacher
                      ? TeacherList.find((t) => t.id === detail.teacher)
                        ? TeacherList.find((t) => t.id === detail.teacher).name
                        : "Không"
                      : "Không"}
                  </p>
                </div>
                <div>
                  <h6>Giám thị:</h6>
                  <p>
                    {detail.inspector
                      ? InspectorList.find((isp) => isp.id === detail.inspector)
                        ? InspectorList.find(
                            (isp) => isp.id === detail.inspector
                          ).name
                        : "Không"
                      : "Không"}
                  </p>
                </div>

                <div>
                  <h6>Mô tả:</h6>
                  <p>{detail.description ? detail.description : "Không"}</p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Danh sách {detail.num} học sinh{" "}
              </Accordion.Header>
              <Accordion.Body>
                <StudentInClass detail={detail} />
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

function StudentInClass({ detail }) {
  const { StudentList } = useContext(DataContext);

  const student = StudentList.filter((d) =>
    d.class_ ? (d.class_ === detail.id ? true : false) : false
  );

  return (
    <>
      <div className="student-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" colSpan="1">
                #
              </th>
              <th scope="col" colSpan="4">
                ID
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
                  <td colSpan="4">{st.id}</td>

                  <td colSpan="4">{st.name}</td>

                  <td colSpan="1">
                    <StudentDetailButton detail={st.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ScheduleDetailButton({ detail }) {
  const { StudentList, ClassList, RoomList } = useContext(DataContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [member, setMember] = useState(
    StudentList.filter((s) =>
      s.class_ && detail.class_
        ? s.class_ === detail.class_
          ? true
          : false
        : false
    )
  );

  useEffect(() => {
    setMember(
      StudentList.filter((s) =>
        s.class_ && detail.class_
          ? s.class_ === detail.class_
            ? true
            : false
          : false
      )
    );
  }, [StudentList, ClassList]);
  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Thông tin buổi học
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin buổi học</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>ID:</h6>
                  <p>{detail.id}</p>
                </div>
                <div>
                  <h6>Tên lớp:</h6>
                  <p>
                    {detail.class_ &&
                    ClassList.find((c) => c.id === detail.class_)
                      ? ClassList.find((c) => c.id === detail.class_).name
                      : "Không"}
                  </p>
                </div>
                <div>
                  <h6>Tại phòng:</h6>
                  <p>
                    {detail.room && RoomList.find((r) => r.id === detail.room)
                      ? RoomList.find((r) => r.id === detail.room).name
                      : "Không"}
                  </p>
                </div>
                <div>
                  <h6>Giáo viên phụ trách:</h6>
                  <p>
                    {detail.class_ &&
                    ClassList.find((c) => c.id === detail.class_)
                      ? ClassList.find((c) => c.id === detail.class_).teacher
                      : "Không"}
                  </p>
                </div>
                <div>
                  <h6>Giám thị:</h6>
                  <p>
                    {detail.class_ &&
                    ClassList.find((c) => c.id === detail.class_)
                      ? ClassList.find((c) => c.id === detail.class_).inspector
                      : "Không"}
                  </p>
                </div>
                <div>
                  <h6>Vào ngày:</h6>
                  <p>{detail.date}</p>
                </div>
                <div>
                  <h6>Thời gian bắt đầu:</h6>
                  <p>{detail.starttime}</p>
                </div>
                <div>
                  <h6>Thời gian kết thúc:</h6>
                  <p>{detail.endtime}</p>
                </div>
                <div>
                  <h6>Mô tả:</h6>
                  <p>{detail.description ? detail.description : "Không"}</p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Danh sách
                  
                học sinh
              </Accordion.Header>
              <Accordion.Body>
                <div className="table-container">
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
                          Họ Tên
                        </th>
                        <th scope="col" colSpan="2">
                          Lớp{" "}
                        </th>
                        <th scope="col" colSpan="3">
                          {" "}
                          Tùy chỉnh
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {member.map((item, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row" colSpan="1">
                              {index + 1}
                            </th>
                            <td colSpan="2">{item.id}</td>
                            <td colSpan="2">
                              {item.name ? item.name : "Không"}
                            </td>
                            <td colSpan="2">
                              {item.class_ &&
                              ClassList.find((c) => c.id === item.class_) ? (
                                ClassList.find((c) => c.id === item.class_).name //hihi
                              ) : (
                                <p style={{ color: "red" }}>Chưa có</p>
                              )}
                            </td>

                            <td colSpan="3">
                              {/* //hihi */}
                              <StudentDetailButton detail={item} />
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

function StudentDetail({ detail }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { TeacherList, ClassList } = useContext(DataContext);
  const teacher = TeacherList.find((i) => i.id === detail);

  const handleDeleteOneTeachedClass = (e) => {
    ClassList.find((c) => c.id === e.target.id).teacher = null;
  };
  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Giáo viên
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Giáo viên {teacher ? teacher.name : ""}</Modal.Title>
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
                  <h6>Danh sách lớp chủ nhiệm:</h6>
                  {ClassList.map((item) => {
                    return (
                      item.teacher === detail && (
                        <div className="editors_item" key={item}>
                          <div className="editors_item_content">
                            {item.name}
                          </div>
                        </div>
                      )
                    );
                  })}
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
export default StudentWorkSpace;
