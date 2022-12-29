import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Accordion, Form } from "react-bootstrap";
import { DataContext } from "../../../context/DataContext";
import { AddClassAttendanceToday } from "./AttendanceAWS";
import { AddStudentButton, StudentDetailButton } from "./StudentAWS";

export function ScheduleAWS() {
  //Schedule table + Modal add Schedule for a class
  /* =========================== Dữ liệu chung ========================= */

  const {
    ClassList,
    ScheduleList,
    RoomList,
    addOneSchedule,
    deleteOneSchedule,
    AttendanceList,
    deleteAttendance
  } = useContext(DataContext);
  useEffect(() => {
    ScheduleList.forEach((sc) => {
      if (!RoomList.find(r=>r.id===sc.room)) { //Xóa phòng mất TKB

        deleteOneSchedule(sc.id);

        return;
      }
      if (!sc.class_) { //Lớp null mất TKB

        deleteOneSchedule(sc.id);

        return;
      }

      if (!ClassList.find(c=>c.id===sc.class_)) { //Xóa lớp mất TKB

        deleteOneSchedule(sc.id);


        return;
      }

      sc.class_ = ClassList.find((c) => c.id === sc.class_)
        ? ClassList.find((c) => c.id === sc.class_).id
        : null;
    return sc;
      });
  }, [ClassList,RoomList]);

  useEffect(()=>{ //Xóa TKB=>Mất điểm danh
    AttendanceList.forEach(a=>{
      if(!ScheduleList.find(s=>s.id===a.id_schedule)) 
      deleteAttendance(a.id)
    })
  },[ScheduleList])

  const daylist = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [DatesList, setDatesList] = useState([]);

  /* =========================== Hàm cho add one schedule ========================= */

  /*Data */

  const [OneSchedule, setOneSchedule] = useState({
    id: `SCH${Math.floor(10000 * Math.random())}`,
    class_: null,
    room: null,
    date: null,
    starttime: "",
    endtime: "",
    description: "",
  });

  /*Function */

  const handleChange = (e) => {

 
    if (e.target.value === "") return;
    switch (e.target.name) {
      case "class_":
        setOneSchedule({
          ...OneSchedule,
          class_: ClassList.find((c) => c.id === e.target.value).id,
        });
        break;
      case "room":
        setOneSchedule({
          ...OneSchedule,
          room: RoomList.find((c) => c.id === e.target.value).id,
        });
        break;
      case "date":
        const k = new Date(e.target.value);
        setOneSchedule({
          ...OneSchedule,
          date: k.toLocaleDateString('en-GB'),
        });
        break;

      default:
        setOneSchedule({ ...OneSchedule, [e.target.name]: e.target.value });
    }
  };

  const handleSubmitOneSchedule = (e) => {
    
    e.preventDefault();

    if (
      OneSchedule.class_ === null ||
      OneSchedule.starttime === "" ||
      OneSchedule.endtime === "" ||
      OneSchedule.date === null
    ) {
      alert(`Thiếu những thông tin bắt buộc!
      Một thời khóa biểu cần có đủ: Lớp, Phòng,Ngày, Giờ bắt đầu và kết thúc.
      `);
      return;
    } else if (
      ScheduleList.find(
        (x) =>
          x.class_ === OneSchedule.class_ &&
          x.starttime === OneSchedule.starttime &&
          x.endtime === OneSchedule.endtime &&
          x.date === OneSchedule.date
      )
    ) {
      alert(`TKB của lớp tạo ra đã có buổi này!`);
      return;
    } else if (
      ScheduleList.find(
        (x) =>
          x.room === OneSchedule.room &&
          x.date === OneSchedule.date&&
          (
          (x.starttime >= OneSchedule.starttime && x.starttime <= OneSchedule.endtime)||
          (x.starttime <= OneSchedule.starttime && x.endtime >= OneSchedule.starttime))
          
      )
    ) {
      alert(`Đã có TKB sửa dụng phòng học này vào giữa khung giờ bạn đăng ký!`);
      return;
    }

    addOneSchedule(OneSchedule);
    setOneSchedule({
      id: `SCH${Math.floor(10000 * Math.random())}`,
      class_: null,
      room: null,
      date: null,
      starttime: "",
      endtime: "",
      description: "",
    });
  };

  /* =========================== Cho add group schedule ========================= */

  /*Data */
  const [InfoSchedule, setInfoSchedule] = useState({
    description: "",
    startday: null,
    endday: null,
    dates: [],
    class_: null,
  });

  /*Function */

  const handleChangeInfo = (e) => {
    if (e.target.name === "room") {
      if (!InfoSchedule.dates.find((k) => k.w_day === e.target.id)) {
        InfoSchedule.dates.push({
          w_day: e.target.id,
          W_room: RoomList.find((k) => k.id === e.target.value).id,
        });
      } else {
        InfoSchedule.dates.map((k) => {
          if (k.w_day === e.target.id) {
            Object.assign(k, { w_room: e.target.value });
          }
          return k;
        });
      }
    } else if (
      e.target.name === "w_starttime" ||
      e.target.name === "w_endtime"
    ) {
      if (!InfoSchedule.dates.find((k) => k.w_day === e.target.id)) {
        InfoSchedule.dates.push({
          w_day: e.target.id,
          [e.target.name]: e.target.value,
        });
      } else {
        InfoSchedule.dates.map((k) => {
          if (k.w_day === e.target.id) {
            return Object.assign(k, { [e.target.name]: e.target.value });
          }
          return k;
        });
      }
    } else
      setInfoSchedule({ ...InfoSchedule, [e.target.name]: e.target.value });
  };
  const handleChangeInfoDay = (e) => {
    if (!daylist.includes(e.target.value)) return;
    if (!DatesList.find((k) => k === e.target.value)) {
      setDatesList([...DatesList, e.target.value]);
    }
  };
  const handleSubmitGroupSchedule = (e) => {
    e.preventDefault();
    const start = new Date(InfoSchedule.startday);
    const end = new Date(InfoSchedule.endday);
    var loop = new Date(start);
    while (loop <= end) {
      let oneDay = {
        id: `SCH${Math.floor(10000 * Math.random())}`,
        // class_: ClassList.find((k) => k.id === InfoSchedule.class_).id,
        class_: InfoSchedule.class_,
        room: null,
        date: null,
        starttime: "",
        endtime: "",
        description: InfoSchedule.description,
      };
      let thisday = InfoSchedule.dates.find(
        (d) => d.w_day === daylist[loop.getDay()]
      );
      if (thisday) {
        if (!thisday.w_starttime || !thisday.w_endtime || !thisday.w_room) {
          alert("Thiếu thông tin phòng học hoặc thời gian!");
          return;
        } else if (
          ScheduleList.find(
            (x) =>
              x.class_ === InfoSchedule.class_ &&
              x.starttime === thisday.w_starttime &&
              x.endtime === thisday.w_endtime &&
              x.date === loop.toLocaleDateString('en-GB')
          )
        ) {
          alert(`TKB của lớp tạo ra đã có buổi này!`);
          return;
        } else if (
          ScheduleList.find(
            (x) =>
            x.room === thisday.w_room &&
          x.date === loop.toLocaleDateString('en-GB')&&
          (
          (x.starttime >= thisday.w_starttime && x.starttime <= thisday.w_starttime)||
          (x.starttime <= thisday.w_starttime && x.endtime >= thisday.w_starttime))

              
          )
        ) {
          alert(`Đã có TKB sửa dụng phòng học này vào khung giờ bạn đăng ký!
          (Phòng: ${thisday.w_room} từ ${thisday.w_starttime} đến ${thisday.w_starttime} vào ngày ${thisday.w_day})
          `);
          return;
        } else {
          oneDay.room = RoomList.find((r) => r.id === thisday.w_room).id;
          oneDay.date = loop.toLocaleDateString('en-GB');
          oneDay.starttime = thisday.w_starttime;
          oneDay.endtime = thisday.w_endtime;
          addOneSchedule(oneDay);
        }
      }

      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  };
  /* =========================== Hàm dùng chung ========================= */
  const handleDeleteDate = (e) => {
    setDatesList(DatesList.filter((k) => k !== e.target.value));
  };
  const handleDeleteOneSchedule = (e) => {

    deleteOneSchedule(e.target.value);
  };

  /* =========================== Rerender update ========================= */
  useEffect(() => {
    InfoSchedule.dates = InfoSchedule.dates.filter((k) =>
      DatesList.find((d) => d === k.w_day)
    );
  }, [DatesList]);

  /* =========================== Modal ========================= */

  const [showAddModal, setShowAddModal] = useState(false);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  /* =/\=/\=/\=/\=/\=/\=/\ =/\=/\=/\=/\=/\=/\=/\ RETURN  =/\=/\=/\=/\=/\=/\=/\ =/\=/\=/\=/\=/\=/\=/\ */


  const [list, setList] = useState(ScheduleList);
  const [ClassFilter,setClassFilter]=useState('');

  const sortByTimeLastest = () => {
    setList([
      ...ScheduleList.sort((a, b) => {
        let a1=a.date.split('/');
        let b1=b.date.split('/');
        return (
          new Date(+a1[2], a1[1] - 1, +a1[0]).getTime() - new Date(+b1[2], b1[1] - 1, +b1[0]).getTime()
        );
      }).reverse(),
    ]);
  };

  const sortByTimeOldest = () => {
    setList([
      ...ScheduleList.sort((a, b) => {
        let a1=a.date.split('/');
        let b1=b.date.split('/');
        return (
          - new Date(+a1[2], a1[1] - 1, +a1[0]).getTime() + new Date(+b1[2], b1[1] - 1, +b1[0]).getTime()
        );
      },).reverse(),
    ]);
  };

  const filtByClass = (act) => {
  if(act===''|!act) return;
setList([
      ...ScheduleList.filter(item=>item.class_===act)
    ]);
  };

  return (
    <>

      <div></div>
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
            {list.map((item, index) => {
              return (
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
                    ?RoomList.find((r) => r.id === item.room)
                      ? RoomList.find((r) => r.id === item.room).name
                      : "Phòng đã bị xóa": "Không"}
                  </td>
                  <td colSpan="2">
                    <ScheduleDetailButton detail={item} />
                    <Button
                      variant="danger"
                      value={item.id}
                      onClick={handleDeleteOneSchedule}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Button variant="primary" onClick={handleShowAddModal}>
          Thêm
        </Button>
    
      </div>
      <div style={{ textAlign: "center" }}>
        <Button variant="warning" onClick={sortByTimeLastest}>
          Sắp xếp (Ngày gần nhất)
        </Button>
        <Button variant="warning" onClick={sortByTimeOldest}>
          Sắp xếp (Ngày lâu nhất)
        </Button>
      </div>

      <div style={{ textAlign: "center" }}>
        
        <Form onSubmit={(e)=>{ e.preventDefault(); filtByClass(ClassFilter)}}>
              <Form.Label>Chọn lớp</Form.Label>
              <Form.Select style={{display: 'inline-block', width:'30%',margin:'0 10px'}}
                onClick={(e)=>{setClassFilter(e.target.value)}}
                placeholder="Tên lớp"
              >
                <option key="0" value="">
                  Tất cả
                </option>
                {/* <option key="0" value="0">
                  Chưa có
                </option> */}
                {ClassList.map((classItem, index) => {
                  return (
                    <option key={index} value={classItem.id}>
                      {classItem.name}
                    </option>
                  );
                })}
              </Form.Select>

            <Button variant="info" type="submit" style={{marginTop:'5px'}}>
              Lọc
            </Button>
          </Form>
      </div>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showAddModal}
        onHide={handleCloseAddModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo Thời khóa biểu</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Tạo một buổi học mới</Accordion.Header>
              <Accordion.Body>
                {/* =========================== SCHEDULE SINGLE FORM ========================= */}

                <Form onSubmit={handleSubmitOneSchedule}>
                  <h6 style={{ textAlign: "center" }}>Thông tin buổi học</h6>
                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả </Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      onChange={handleChange}
                      required
                      placeholder="Bạn có lưu ý gì cho buổi học này?"
                    />
                    <br></br>
                    <Form.Label>Giờ bắt đầu</Form.Label>
                    <Form.Control
                      name="starttime"
                      type="time"
                      onChange={handleChange}
                      required
                    />
                    
                    <br></br>
                    <Form.Label>Giờ kết thúc</Form.Label>
                    <Form.Control
                      name="endtime"
                      type="time"
                      onChange={handleChange}
                      required
                    />
                    <br></br>
                    <Form.Label>Chọn ngày </Form.Label>
                    <Form.Control
                      name="date"
                      type="date"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Chọn lớp</Form.Label>
                    <Form.Select
                      name="class_"
                      onClick={handleChange}
                      onChange={handleChange}
                      required
                    >
                      <option key="" value="">
                        Chọn...
                      </option>
                      {ClassList.map((cls, index) => {
                        return (
                          <option key={index} value={cls.id}>
                            {cls.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                  <br></br>
                  <Form.Group>
                    <Form.Label>Chọn phòng</Form.Label>
                    <Form.Select
                      name="room"
                      onClick={handleChange}
                      onChange={handleChange}
                      required
                    >
                      <option key="" value="">
                        Chọn...
                      </option>
                      {RoomList.map((rm, index) => {
                        return (
                          <option key={index} value={rm.id}>
                            {rm.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                  <br></br>

                  <Button type="submit"> Thêm buổi học</Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Tạo lịch học</Accordion.Header>
              <Accordion.Body>
                {/* =========================== SCHEDULE GROUP FORM ========================= */}
                <Form onSubmit={handleSubmitGroupSchedule}>
                  <h6 style={{ textAlign: "center" }}>Thông tin lịch học</h6>

                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả chung </Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={InfoSchedule.description}
                      onChange={handleChangeInfo}
                      required
                      placeholder="VD: Lịch học cho lớp Siu Quậy, tối thứ 3, 5, 7 mỗi tuần"
                    />
                    <br></br>
                    <Form.Label>Ngày bắt đầu:</Form.Label>
                    <Form.Control
                      name="startday"
                      type="date"
                      onChange={handleChangeInfo}
                      required
                    />
                    <br></br>
                    <Form.Label>Ngày kết thúc:</Form.Label>
                    <Form.Control
                      name="endday"
                      type="date"
                      onChange={handleChangeInfo}
                      required
                    />

                    <br></br>
                    <Form.Label>Chọn lớp</Form.Label>
                    <Form.Select
                      name="class_"
                      // value={InfoSchedule.class_}
                      onClick={handleChangeInfo}
                      onChange={handleChangeInfo}
                      required
                    >
                      <option key="" value={null}>
                        Chọn...
                      </option>
                      {ClassList.map((cls, index) => {
                        return (
                          <option key={index} value={cls.id}>
                            {cls.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <br></br>
                    <h6 style={{ textAlign: "center" }}>Các buổi trong tuần</h6>

                    <Form.Select
                      name="class_"
                      type="text"
                      onClick={handleChangeInfoDay}
                      onChange={handleChangeInfoDay}

                      required
                      as="control"
                    >
                      <option key="" value="">
                        Chọn...
                      </option>
                      {daylist.map((day, index) => {
                        return (
                          <option key={index} value={day}>
                            {day}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <br></br>
                    <div className="table-fixed table-container">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col" colSpan="1">
                              #
                            </th>
                            <th scope="col" colSpan="2">
                              Thứ
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
                            <th scope="col" colSpan="1">
                              Tùy chỉnh
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {DatesList.map((day, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row" colSpan="1">
                                  {index + 1}
                                </th>
                                <td colSpan="2">{day}</td>
                                <td colSpan="2">
                                  <input
                                    type="time"
                                    name="w_starttime"
                                    id={day}
                                    onChange={handleChangeInfo}
                                  />
                                </td>
                                <td colSpan="2">
                                  <input
                                    type="time"
                                    name="w_endtime"
                                    id={day}
                                    onChange={handleChangeInfo}
                                  />
                                </td>

                                <td colSpan="2">
                                  <Form.Select
                                    name="room"
                                    onClick={handleChangeInfo}
                                    onChange={handleChangeInfo}
                                    id={day}
                                    required
                                  >
                                    <option key="" value="">
                                      Chọn...
                                    </option>
                                    {RoomList.map((rm, index) => {
                                      return (
                                        <option key={index} value={rm.id}>
                                          {rm.name}
                                        </option>
                                      );
                                    })}
                                  </Form.Select>
                                </td>

                                <td colSpan="1">
                                  <Button
                                    name="day"
                                    value={day}
                                    variant="danger"
                                    onClick={handleDeleteDate}
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
                  </Form.Group>
                  <br></br>
                  <Button type="submit"> Thêm lịch</Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function ScheduleDetailButton({ detail }) {
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

                <Button variant="warning">Chỉnh sửa</Button>
                <AddClassAttendanceToday schedule={detail.id} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Danh sách
                thành viên
              </Accordion.Header>
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
                              <Button
                                variant="danger"
                                // onClick={deleteStudent}
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
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Thông tin thêm</Accordion.Header>
              <Accordion.Body>
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
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
