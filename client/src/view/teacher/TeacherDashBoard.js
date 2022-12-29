import React, { useContext, useState } from "react";
import { ScheduleDetailButton } from "../admin/workplace/ScheduleAWS";
import { DataContext } from "./../../context/DataContext";
import { Accordion, AccordionButton, Button, Modal, ProgressBar } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from './../../context/AuthContext';

export default function TeacherDashBoard() {
  const {
    ClassList,
    ScheduleList,
    RoomList,
    
  } = useContext(DataContext);
  const {
    isAuthenticated,
    account,
    actor,
  }=useContext(AuthContext);
  const now = new Date();
  const datenow = now.toLocaleDateString('en-GB');
  const classnow = ClassList.find((c) => c.teacher === account.id)
    ? ClassList.find((c) => c.teacher === account.id).id
    : null;
  const [schedulenow, setScheduleNow] = useState([]);
  useState(() => {
    setScheduleNow([]);
  }, [account]);
  if(actor!=="TEACHER") return (<Navigate  to='/' />)

  return (
    <>
      <h1>Lịch dạy của tôi</h1>
      <h2>
        Hôm nay ({datenow}) bạn có {schedulenow.length} ca dạy.{" "}
        {schedulenow.length !== 0 ? (
          <Link to="/teacher/thisday">Tham gia ngay!</Link>
        ) : (
          "Hãy nghỉ ngơi!"
        )}
      </h2>

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
                Lớp
              </th>
              <th scope="col" colSpan="2">
                Ngày
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
              if (compareDateString(datenow, item.date) === 0) {
                if (!schedulenow.includes(item))
                  setScheduleNow([...schedulenow, item]);
              }
              return (
                ClassList.find((c) => c.id === item.class_).teacher ===
                  account.id && (
                  <tr key={index}>
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
                        ? RoomList.find((r) => r.id === item.room)
                          ? RoomList.find((r) => r.id === item.room).name
                          : "Phòng đã bị xóa"
                        : "Không"}
                    </td>
                    <td colSpan="3">
                      <ScheduleDetailButton detail={item} />
                      {compareDateString(datenow, item.date) === 1 ? (
                        <HistorySchedule schedule={item.id} />
                      ) : compareDateString(datenow, item.date) === -1 ? (
                        <Button variant="dark" value={item.id}>
                          Xem trước{" "}
                        </Button>
                      ) : (
                        <TeacherJoinButton schedule={item} />
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
    </>
  );
}

export function compareDateString(start, end) {
  //*TODO: type string: DD/MM/YYYY
  //....................0123456789
  let a = start.split("/").map((item) => Number(item));
  let b = end.split("/").map((item) => Number(item));

  if (a[2] > b[2]) return 1;
  else if (a[2] < b[2]) return -1;
  else if (a[1] > b[1]) return 1;
  else if (a[1] < b[1]) return -1;
  else if (a[0] > b[0]) return 1;
  else if (a[0] < b[0]) return -1;
  else return 0;
}

export function TeacherJoinButton({ schedule }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/teacher/thisday", schedule);
  };
  return (
    <Button variant="success" onClick={handleClick}>
      Tham gia{" "}
    </Button>
  );
}

export function HistorySchedule({ schedule }) {
  // schedule: id schedule
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    AttendanceList,
    ScheduleList,
    ClassList,
    InspectorList,
    TeacherList,
  } = useContext(DataContext);

  const Schedule = schedule
    ? ScheduleList.find((s) => s.id === schedule)
    : null;
  const Class = schedule
    ? ClassList.find((c) => c.id === Schedule.class_)
    : null;

  let Statistic = {
    total: Schedule ? Class.num : 0,
    unchecked: 0,
    lated: 0,
    present: 0,
    transit: 0,
    soonleave: 0,
    a_absent: 0,
    b_absent: 0,
    isAlterTeach: false,
    isAlterInspect: false,
    isPrechecked: false,
    isTeacherPresent: false,
  };

  let TeacherAtt = null,
    InspectorAtt = null;
  AttendanceList.forEach((att) => {
    if (att.id_schedule === schedule)
      if (att.id_target.substring(0, 3) === "STU") {
        if (!att.debt_schedule)
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
            case "SOONLEAVED":
              ++Statistic.soonleave;
              break;
            case "A-ABSENTED":
              ++Statistic.a_absent;
              break;
            case "B-ABSENTED":
              ++Statistic.b_absent;
              break;
            case "UNCHECKED":
              ++Statistic.unchecked;
              break;
            default:
              break;
          }
        else ++Statistic.transit;
      } else if (att.id_target.substring(0, 3) === "TEA") {
        if (att.type === "ALTER_TEACH") Statistic.isAlterTeach = true;
        if (att.type !== "UNCHECKED") Statistic.isTeacherPresent = true;
        TeacherAtt = att;
      } else {
        if (att.type === "ALTER_INSPECT") Statistic.isAlterInspect = true;
        if (att.prenum) Statistic.isPrechecked = true;
        InspectorAtt = att;
      }
  });
  let ssnow =
    (100 * (Statistic.soonleave + Statistic.present + Statistic.lated)) /
    Statistic.total;

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
        Xem lại
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Lịch sử buổi học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  Lấp đầy (chính quy):
                  <br></br>
                  <br></br>
                  <ProgressBar animated now={ssnow} label={`${ssnow}%`} />
                  <br></br>
                  Học sinh:
                  <br></br>
                  -Tổng số hôm nay: {Statistic.transit + Statistic.total}
                  <br></br>
                  -Đi học bù: {Statistic.transit}/
                  {Statistic.transit + Statistic.total}
                  <br></br> <br></br>
                  -Học chính khóa: {Statistic.total}
                  <br></br>
                  -Chưa điểm danh: {Statistic.unchecked}/{Statistic.total}
                  <br></br>
                  -Có mặt: {Statistic.present}/{Statistic.total}
                  <br></br>
                  -Vào trễ: {Statistic.lated}/{Statistic.total}
                  <br></br>
                  -Về sớm: {Statistic.soonleave}/{Statistic.total}
                  <br></br>
                  -Vắng có phép: {Statistic.a_absent}/{Statistic.total}
                  <br></br>
                  -Vắng không phép: {Statistic.b_absent}/{Statistic.total}
                  <br></br>
                  -Có giáo viên dạy thay:{" "}
                  {Statistic.isAlterTeach ? "Có" : "Không"}
                  <br></br>
                  -Giám thị trực thay:{" "}
                  {Statistic.isAlterInspect ? "Có" : "Không"}
                  <br></br>
                  <br></br>
                  Giáo viên đã điểm danh:{" "}
                  {Statistic.isTeacherPresent ? (
                    <div className="green-text">Rồi</div>
                  ) : (
                    <div className="red-text">Chưa</div>
                  )}
                  <br></br>
                  Giám thị đã kiểm tra đầu giờ:{" "}
                  {Statistic.isPrechecked ? (
                    <div className="green-text">Rồi</div>
                  ) : (
                    <div className="red-text">Chưa</div>
                  )}
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Kiểm tra đầu giờ</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>Sĩ số đầu giờ:</h6>
                  <p>{InspectorAtt ? InspectorAtt.prenum : "Không dữ liệu"}</p>
                </div>

                <div>
                  <h6>Giám thị trực:</h6>
                  <p>
                    {InspectorAtt
                      ? InspectorList.find(
                          (i) => i.id === InspectorAtt.id_target
                        ).name
                      : "Không dữ liệu"}
                  </p>
                </div>

                <div>
                  <h6>Nhận xét của giám thị đầu giờ:</h6>
                  <p>{InspectorAtt ? InspectorAtt.notice : "Không dữ liệu"}</p>
                </div>

                <div>
                  <h6>Giáo viên đứng lớp:</h6>
                  <p>
                    {TeacherAtt
                      ? TeacherList.find((t) => t.id === TeacherAtt.id_target)
                          .name
                      : "Không dữ liệu"}
                  </p>
                </div>

                <div>
                  <h6>Nhận xét của giáo viên cuối giờ:</h6>
                  <p>{TeacherAtt ? TeacherAtt.notice : "Không dữ liệu"}</p>
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
