import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { Accordion, Button, ProgressBar } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import {
  AddClassAttendanceToday,
  AddOneAttendanceToday,
  AddPermissionAllToday,
} from "../admin/workplace/AttendanceAWS";
import { RemovePermissionAllToday } from "./../admin/workplace/AttendanceAWS";
import { AttendanceDetail } from "./../admin/workplace/AttendanceAWS";
import { CompleteOneAttendanceToday } from "./../admin/workplace/AttendanceAWS";
import { StudentDetailButton } from "../admin/workplace/StudentAWS";
import { compareDateString } from "./TeacherDashBoard";
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from "react-router-dom";

const TeacherWorkSpace = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {
    isAuthenticated,
    account,
    actor,
  }=useContext(AuthContext);
  const {
    ClassList,
    ScheduleList,
    RoomList,
    AttendanceList,
    StudentList,
    TeacherList,
    InspectorList,
    deleteAttendance,
  } = useContext(DataContext);

  //for table, detail

  const now = new Date();
  const datenow = now.toLocaleDateString('en-GB');
  const classnow = ClassList.find((c) => c.teacher === account.id)
    ? ClassList.find((c) => c.teacher === account.id).id
    : null;
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
  

const PlusWorkDay = AttendanceList.find(item=>item.id_target===account.id&&item.type==="ALTER_TEACH");
let PlusSchedule= PlusWorkDay? ScheduleList.find(item=>item.id===PlusWorkDay.id_schedule):null;
 
if(actor!=="TEACHER") return (<Navigate  to='/' />)

  return (
    <>
    <h1>TI???T D???Y H??M NAY</h1>
      {schedulenow.map((item, index) => {
        return (
          <h2 key={index}>
            Ca {index===0? "?????u ti??n": `th??? ${index+1}`} di???n ra v??o {item.starttime}, k???t th??c l??c{" "}
            {item.endtime} ??? ph??ng{" "}
            {RoomList.find((r) => r.id === item.room).name}.
          </h2>
        );
      })}
      {PlusWorkDay&&
       <> 
          <h2 >
            H??m nay, b???n ???????c ch??? ?????nh 1 ca d???y b?? thu???c l???p  {PlusSchedule.class_?ClassList.find(itm=>itm.id===PlusSchedule.class_).name: 'Kh??ng x??c ?????nh'} di???n ra v??o {PlusSchedule.starttime}, k???t th??c l??c{" "}
            {PlusSchedule.endtime} ??? ph??ng{" "}
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
                L???p
              </th>
              <th scope="col" colSpan="2">
                B???t ?????u
              </th>
              <th scope="col" colSpan="2">
                K???t th??c
              </th>
              <th scope="col" colSpan="2">
                Ph??ng
              </th>
              <th scope="col" colSpan="3">
                {" "}
                T??y ch???nh
              </th>
            </tr>
          </thead>
          <tbody>
            {ScheduleList.map((item, index) => {
             if (
                
              compareDateString(datenow, item.date) === 0
            ) {
              if (!schedulenow.includes(item))
              if(ClassList.find((c) => c.id === item.class_).teacher ===
                account.id)
                setScheduleNow([...schedulenow, item]);
            }
            return (
              ClassList.find(c=>c.id===item.class_).teacher===account.id&&
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
                          : "Ph??ng ???? b??? x??a"
                        : "Kh??ng"}
                    </td>
                    <td colSpan="3">
                      <ScheduleDetailButton detail={item} />
                      {compareDateString(datenow, item.date) === 1 ? (
                        <Button variant="warning" value={item.id}>
                          Xem l???i{" "}
                        </Button>
                      ) : compareDateString(datenow, item.date) === -1 ? (
                        <Button variant="dark" value={item.id}>
                          Xem tr?????c{" "}
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
          <Modal.Title>L???p h???c h??m nay</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Accordion defaultActiveKey={["0"]} alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Th???ng k??</Accordion.Header>
                <Accordion.Body>
                  <div>
                    L???p ?????y hi???n t???i (ch??nh quy):
                    <br></br>
                    <br></br>

                    <ProgressBar animated now={ssnow} label={`${ssnow}%`} />
                    <br></br>
                    H???c sinh:
                    <br></br>
                    -T???ng s??? h??m nay: {Statistic.transit+Statistic.total}
                    <br></br>
                    -??i h???c b??: {Statistic.transit}/{Statistic.transit+Statistic.total}
                    <br></br>                    <br></br>

                    -H???c ch??nh kh??a: {Statistic.total}
                    <br></br>
                    -Ch??a ??i???m danh: {Statistic.unchecked}/{Statistic.total}
                    <br></br>
                    -V??o tr???: {Statistic.lated}/{Statistic.total}
                    <br></br>
                    -C?? m???t: {Statistic.present}/{Statistic.total}
                    <br></br>
                    <br></br>

                    Gi??o vi??n ???? ??i???m danh: {Statistic.isTeacherPresent? <div className="green-text">R???i</div>:<div className="red-text">Ch??a</div>}
                    <br></br>
                    Gi??m th??? ???? ki???m tra ?????u gi???: {Statistic.isPrechecked? <div className="green-text">R???i</div>:<div className="red-text">Ch??a</div>}
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
                  <TeacherDetail detail={ThisSchedule ? Class.teacher : null} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>T??nh h??nh l???p</Accordion.Header>
                <Accordion.Body>
                  <div className="table-container table-attendance">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col" colSpan="1">
                            #
                          </th>
                          <th scope="col" colSpan="2">
                            Ng??y
                          </th>
                          <th scope="col" colSpan="2">
                            L???p
                          </th>
                          <th scope="col" colSpan="2">
                            ?????i t?????ng
                          </th>
                          <th scope="col" colSpan="2">
                            H??? t??n
                          </th>
                          <th scope="col" colSpan="2">
                            Tr???ng th??i
                          </th>
                          <th scope="col" colSpan="3">
                            {" "}
                            T??y ch???nh
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {AttendanceList.map((item, index) => {
                          //chonay
                          let isStudent =
                            item.id_target.substring(0, 3) === "STU"
                              ? true
                              : false;

                          let thisclass = ClassList.find(itm=>itm.id===ScheduleList.find(it=>it.id===item.id_schedule).class_)
                          return (
                            item.id_schedule === ThisSchedule && (
                              <tr key={index} className={item.type}>
                                <th scope="row" colSpan="1">
                                  {++idx}
                                </th>
                                <td colSpan="2">
                                  {
                                    ScheduleList.find(
                                      (s) => s.id === item.id_schedule
                                    ).date
                                  }
                                </td>
                                <td colSpan="2">
                                  {thisclass ? thisclass.name : "Kh??ng"}
                                </td>
                                <td colSpan="2">
                                  {!isStudent ? (
                                    <div
                                      style={{
                                        fontWeight: "bolder",
                                        margin: "0",
                                        padding: "0",
                                      }}
                                    >
                                      {item.id_target}
                                    </div>
                                  ) : (
                                    item.id_target
                                  )}
                                </td>
                               <td colSpan="2"> {item.id_target.substring(0,3)==="STU"? 
                StudentList.find(s=>s.id===item.id_target).name:
                item.id_target.substring(0,3)==="TEA" ?
                TeacherList.find(t=>t.id===item.id_target).name:
                InspectorList.find(t=>t.id===item.id_target).name
                } </td>
                                <td colSpan="2">{item.type}</td>
                                <td colSpan="3">
                                 
                                  <AttendanceDetail attendance={item} />
                                  {item.id_target.substring(0,3)!=='INS'&&<Button
                                    variant="danger"
                                    value={item.id}
                                    onClick={(e) =>
                                    deleteAttendance(e.target.value)}>X??a</Button>}
                                    {item.id_target.substring(0,3)!=='INS'      &&
                                  <CompleteOneAttendanceToday  attendance={item.id} />}

                                </td>
                              </tr>
                            )
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
          <br></br>
        </Modal.Body>
        <Modal.Footer>
          <div className="GroupButonInspectorClass">
            <AddClassAttendanceToday schedule={ThisSchedule} />{" "}
            <AddOneAttendanceToday schedule={ThisSchedule} />
            <AddPermissionAllToday schedule={ThisSchedule} />{" "}
            <RemovePermissionAllToday schedule={ThisSchedule} />
          </div>
          <Button variant="dark" onClick={handleClose}>
            R???i l???p
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
        Th??ng tin l???p
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>L???p {detail.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL INFO ========================= */}
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Th??ng tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>T??n l???p:</h6>
                  <p>{detail ? detail.name : "Kh??ng"}</p>
                </div>
                <div>
                  <h6>Gi??o vi??n ch??? nhi???m:</h6>
                  <p>
                    {detail.teacher
                      ? TeacherList.find((t) => t.id === detail.teacher)
                        ? TeacherList.find((t) => t.id === detail.teacher).name
                        : "Kh??ng"
                      : "Kh??ng"}
                  </p>
                </div>
                <div>
                  <h6>Gi??m th???:</h6>
                  <p>
                    {detail.inspector
                      ? InspectorList.find((isp) => isp.id === detail.inspector)
                        ? InspectorList.find(
                            (isp) => isp.id === detail.inspector
                          ).name
                        : "Kh??ng"
                      : "Kh??ng"}
                  </p>
                </div>

                <div>
                  <h6>M?? t???:</h6>
                  <p>{detail.description ? detail.description : "Kh??ng"}</p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Danh s??ch {detail.num} h???c sinh{" "}
              </Accordion.Header>
              <Accordion.Body>
                <StudentInClass detail={detail} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ????ng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function StudentInClass({ detail }) {
  const { StudentList } = useContext(DataContext);

  const student = StudentList.filter((d) =>
    d.class_ === detail.id
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
                T??n
              </th>

              <th scope="col" colSpan="1">
                {" "}
                T??y ch???nh
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
 
  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Th??ng tin bu???i h???c
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Th??ng tin bu???i h???c</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Th??ng tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>ID:</h6>
                  <p>{detail.id}</p>
                </div>
                <div>
                  <h6>T??n l???p:</h6>
                  <p>
                    {detail.class_ &&
                    ClassList.find((c) => c.id === detail.class_)
                      ? ClassList.find((c) => c.id === detail.class_).name
                      : "Kh??ng"}
                  </p>
                </div>
                <div>
                  <h6>T???i ph??ng:</h6>
                  <p>
                    {detail.room && RoomList.find((r) => r.id === detail.room)
                      ? RoomList.find((r) => r.id === detail.room).name
                      : "Kh??ng"}
                  </p>
                </div>
                <div>
                  <h6>Gi??o vi??n ph??? tr??ch:</h6>
                  <p>
                    {detail.class_ &&
                    ClassList.find((c) => c.id === detail.class_)
                      ? ClassList.find((c) => c.id === detail.class_).teacher
                      : "Kh??ng"}
                  </p>
                </div>
                <div>
                  <h6>Gi??m th???:</h6>
                  <p>
                    {detail.class_ &&
                    ClassList.find((c) => c.id === detail.class_)
                      ? ClassList.find((c) => c.id === detail.class_).inspector
                      : "Kh??ng"}
                  </p>
                </div>
                <div>
                  <h6>V??o ng??y:</h6>
                  <p>{detail.date}</p>
                </div>
                <div>
                  <h6>Th???i gian b???t ?????u:</h6>
                  <p>{detail.starttime}</p>
                </div>
                <div>
                  <h6>Th???i gian k???t th??c:</h6>
                  <p>{detail.endtime}</p>
                </div>
                <div>
                  <h6>M?? t???:</h6>
                  <p>{detail.description ? detail.description : "Kh??ng"}</p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Danh s??ch
                h???c sinh
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
                          H??? T??n
                        </th>
                        <th scope="col" colSpan="2">
                          L???p{" "}
                        </th>
                        <th scope="col" colSpan="3">
                          {" "}
                          T??y ch???nh
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                    {StudentList.map((item, index) => {
                        return (
                          item.class_===detail.class_&&<tr key={index}>
                            <th scope="row" colSpan="1">
                              {index + 1}
                            </th>
                            <td colSpan="2">{item.id}</td>
                            <td colSpan="2">
                              {item.name ? item.name : "Kh??ng"}
                            </td>
                            <td colSpan="2">
                              {item.class_ &&
                              ClassList.find((c) => c.id === item.class_) ? (
                                ClassList.find((c) => c.id === item.class_).name //hihi
                              ) : (
                                <p style={{ color: "red" }}>Ch??a c??</p>
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
            ????ng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function TeacherDetail({ detail }) {
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
        Gi??o vi??n
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Gi??o vi??n {teacher ? teacher.name : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL INFO ========================= */}
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Th??ng tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>ID:</h6>
                  <p>
                    {teacher
                      ? teacher.id
                        ? teacher.id
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>T??n:</h6>
                  <p>
                    {teacher
                      ? teacher.name
                        ? teacher.name
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>Gi???i t??nh:</h6>
                  <p>
                    {teacher
                      ? teacher.gender
                        ? teacher.gender
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>Th??ng sinh:</h6>
                  <p>
                    {teacher
                      ? teacher.birth
                        ? teacher.birth
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>S??? ??i???n tho???i:</h6>
                  <p>
                    {teacher
                      ? teacher.phone
                        ? teacher.phone
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>Email:</h6>
                  <p>
                    {teacher
                      ? teacher.email
                        ? teacher.email
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>M?? t???:</h6>
                  <p>
                    {teacher
                      ? teacher.description
                        ? teacher.description
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>Danh s??ch l???p ch??? nhi???m:</h6>
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
            ????ng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default TeacherWorkSpace;
