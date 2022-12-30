import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Accordion, Form } from "react-bootstrap";
import { DataContext } from "../../../context/DataContext";
import { AuthContext } from './../../../context/AuthContext';


export function AttendanceAWS() {
  // *TODO: Display specific Conponents

  return (
    <>
      <AttendanceTable />
 
    </>
  );
}
export function AttendanceTable() {
  // *TODO: Display all Attendance

  const { ClassList, ScheduleList, AttendanceList, deleteAttendance } =
  useContext(DataContext);

  
  useEffect(()=>{ //Xóa TKB=>Mất điểm danh
    AttendanceList.forEach(a=>{
      if(!ScheduleList.find(s=>s.id===a.id_schedule)) 
      deleteAttendance(a.id)
      return a;
    })
  },[ScheduleList,deleteAttendance])
  const [list, setList] = useState(AttendanceList);
  const [ClassFilter,setClassFilter]=useState('');
  const [TypeFilter,setTypeFilter]=useState('');
  useEffect(()=>{setList(AttendanceList)},[AttendanceList])

  const TypeList = [
    { key: "LATED", value: "Vào trễ" },
    { key: "PRESENT", value: "Có mặt" },
    { key: "SOONLEAVED", value: "Về sớm" },
    { key: "A-ABSENTED", value: "Vắng có phép" },
    { key: "B-ABSENTED", value: "Vắng không phép" },
    { key: "UNCHECKED", value: "Chưa điểm danh" },
    { key: "ALTER_TEACH", value: "Dạy thay" },
    { key: "ALTER_INSPECT", value: "Kiểm tra đầu giờ thay" },
    { key: "PRECHECK", value: "Kiểm tra 15 phút đầu giờ" },
  ];
  const sortByTimeLastest = () => {
    setList([
      ...AttendanceList.sort((a, b) => {
        let a1=ScheduleList.find(item=>item.id===a.id_schedule).date.split('/');
        let b1=ScheduleList.find(item=>item.id===b.id_schedule).date.split('/');
        return (
          new Date(+a1[2], a1[1] - 1, +a1[0]).getTime() - new Date(+b1[2], b1[1] - 1, +b1[0]).getTime()
        );
      }).reverse(),
    ]);
  };

  const sortByTimeOldest = () => {
    setList([
      ...AttendanceList.sort((a, b) => {
        let a1=ScheduleList.find(item=>item.id===a.id_schedule).date.split('/');
        let b1=ScheduleList.find(item=>item.id===b.id_schedule).date.split('/');
        return (
          - new Date(+a1[2], a1[1] - 1, +a1[0]).getTime() + new Date(+b1[2], b1[1] - 1, +b1[0]).getTime()
        );
      },).reverse(),
    ]);
  };

  const filtByClass = (act) => {
  if(!act) return;
  if(act==="*") setList(AttendanceList)
  else
setList([
      ...AttendanceList.filter(item=>ScheduleList.find(itm=>itm.id===item.id_schedule).class_===act)
    ]);
  };

  const filtByType = (typ) => {
    if(typ===''|!typ) return;
    if(typ==="*") setList(AttendanceList)
    else
  setList([
        ...list.filter(item=>item.type===typ)
      ]);
    };

  return (
    <>
      <div className="table-fixed table-container table-attendance">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" colSpan="1">
                #
              </th>
              <th scope="col" colSpan="2">
                Ngày
              </th>
              <th scope="col" colSpan="2">
                Lớp
              </th>
              <th scope="col" colSpan="2">
                Đối tượng
              </th>
              <th scope="col" colSpan="2">
                Trạng thái
              </th>
              <th scope="col" colSpan="2">
                {" "}
                Tùy chỉnh
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => {
              let isStudent =
                item.id_target.substring(0, 3) === "STU"
                  ? true
                  : false;
              return (
                <tr key={index} className={item.type}>
                  <th scope="row" colSpan="1">
                    {index + 1}
                  </th>
                  <td colSpan="2">
                    {
                    ScheduleList.find((s) => s.id === item.id_schedule)? ScheduleList.find((s) => s.id === item.id_schedule).date: "Không"
                    }
                  </td>
                  <td colSpan="2">
                    {
        ScheduleList.find((s) => s.id === item.id_schedule)?ClassList.find((c) => c.id === ScheduleList.find((s) => s.id === item.id_schedule).class_)
        ? ClassList.find((c) => c.id === ScheduleList.find((s) => s.id === item.id_schedule).class_).name 
        :"Không dữ liệu": "Không xác định"
                    }
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
                  <td colSpan="2">{item.type}</td>
                  <td colSpan="2">
                    <AttendanceDetail attendance={item} />
                    <Button
                      variant="danger"
                      value={item.id}
                      onClick={e=>
                        deleteAttendance(e.target.value)
                      }
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{color:'black',fontWeight:'bold',margin:'10px'}} >Tổng số: {list.length}</div>
        <AddOneAttendanceByAdmin />
        <AddClassAttendanceByAdmin />
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
                <option key="0" value="*">
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
              Lọc lớp
            </Button>
          </Form>
      </div>

      <div style={{ textAlign: "center" }}>
        <Form onSubmit={(e)=>{ e.preventDefault(); filtByType(TypeFilter)}}>
              <Form.Label>Chọn loại</Form.Label>
              <Form.Select style={{display: 'inline-block', width:'30%',margin:'0 10px'}}
                onClick={(e)=>{setTypeFilter(e.target.value)}}
                placeholder="Tên lớp"
              >
                <option key="0" value="*">
                  Tất cả
                </option>
                {/* <option key="0" value="0">
                  Chưa có
                </option> */}
                {TypeList.map((item,index) => {
                  return (
                    <option key={index} value={item.key}>
                      {item.value}
                    </option>
                  );
                })}
              </Form.Select>

            <Button variant="info" type="submit" style={{marginTop:'5px'}}>
              Lọc loại
            </Button>
          </Form>
      </div>
    </>
  );
}
export function AttendanceDetail({ attendance }) {

  // *TODO: Display detail Attendance
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { ScheduleList, ClassList, AttendanceList,StudentList,InspectorList,TeacherList } = useContext(DataContext);

 
  const [ThisSchedule,setThisSchedule] =useState(ScheduleList.find(
    (s) => s.id === attendance.id_schedule));
  
  useEffect(()=>{setThisSchedule(ScheduleList.find(
    (s) => s.id === attendance.id_schedule))},[ScheduleList])

  const [ThisClass,setThisClass] =useState(ThisSchedule?ClassList.find((c) => c.id === ThisSchedule.class_):null);
  
  useEffect(()=>{setThisClass(ThisSchedule?ClassList.find((c) => c.id === ThisSchedule.class_):null)},[ScheduleList])

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
          <Modal.Title>Chi tiết điểm danh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL INFO ========================= */}
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>ID:</h6>
                  <p>{attendance.id}</p>
                </div>

                <div>
                  <h6>Lớp:</h6>
                  <p>{ThisClass ? ThisClass.name : "Không dữ liệu"}</p>
                </div>

                <div>
                  <h6>Ngày:</h6>
                  <p> {ThisSchedule?ThisSchedule.date:"Không dữ liệu"}</p>
                </div>

                <div>
                  <h6>Bù cho ngày:</h6>
                  <p>
                    {" "}
                    {ThisSchedule
                      ? ThisSchedule.debt_schedule
                        ? ThisSchedule.debt_schedule
                        : "Không bù"
                      : "Không"}
                  </p>
                </div>

                <div>
                  <h6>Đối tượng:</h6>
                  <p>{attendance.id_target}</p>
                </div>

                <div>
                  <h6>Họ tên:</h6>

                  {attendance.id_target.substring(0,3)==="STU"? 
                (StudentList.find(s=>s.id===attendance.id_target)?StudentList.find(s=>s.id===attendance.id_target).name: null):
                attendance.id_target.substring(0,3)==="TEA" ?
                (TeacherList.find(t=>t.id===attendance.id_target)? TeacherList.find(t=>t.id===attendance.id_target).name: null) :
                (InspectorList.find(t=>t.id===attendance.id_target) ? InspectorList.find(t=>t.id===attendance.id_target).name : null)
                }
                </div>

                <div>
                  <h6>Tình trạng:</h6>
                  <p>{attendance.type}</p>
                </div>

                <div>
                  <h6>Quyền tự điểm danh:</h6>
                  {attendance.isSelfCheck === true ? <div className="green-text">Có</div> 
                  : <div className="red-text">Không</div>}
                </div>

                <div>
                  <h6>Người chỉnh sửa cuối cùng:</h6>
                  <p>{attendance.id_last_editor}</p>
                </div>

                <div>
                  <h6>Thời gian chỉnh sửa cuối cùng:</h6>
                  <p>{attendance.datetime_update}</p>
                </div>

                <div>
                  <h6>Ghi chú:</h6>
                  <p>{attendance.notice}</p>
                </div>
                <CompleteOneAttendanceToday attendance={attendance.id} />
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

export function UpdateOneAttendance(attendance) {

  // *TODO: For 3W. Update all properties of Detail Attendance
  //Attendance: Chỉnh sửa nếu có sai sót
  return (
    <>
      <h1 style={{ color: "purple" }}>Chỉnh sửa cái điểm danh</h1>
      <br></br>
    </>
  );
}

export function AddOneAttendanceByAdmin() {
  const {
    account,
  }=useContext(AuthContext);
  //*TODO: For admin add a custom Attendance, if HAVE DEBTDAY=> update transit_ Schedule. remove debday=>remove transit_ in Schedule
  //Attendance: Tạo sẵn điểm danh để render ra UI của từng HS. Input Expected:

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    ClassList,
    StudentList,
    TeacherList,
    InspectorList,
    ScheduleList,

    AttendanceList,
    addOneAttendance,
    deleteAttendance,
  } = useContext(DataContext);

  useEffect(()=>{
    AttendanceList.forEach(
      a=>{
        if(!ScheduleList.find(s=>s.id===a.id_schedule))
         deleteAttendance(a.id)
return a;
        }
        
        )
    },[ScheduleList])

  const [One, setOne] = useState({
    id: null, //auto
    id_schedule: null, //  ||auto from input
    id_last_editor: null, //auto 
    isSelfCheck: false,
    id_target: null,
    type: "UNCHECKED",
    debt_schedule: null,
    datetime_update: null, //auto from Date.now().toDateTimeString()
    notice: null,
    prenum: null, //for type:'PRECHECK'
  });

  const TypeList = [
    { key: "LATED", value: "Vào trễ" },
    { key: "PRESENT", value: "Có mặt" },
    { key: "SOONLEAVED", value: "Về sớm" },
    { key: "A-ABSENTED", value: "Vắng có phép" },
    { key: "B-ABSENTED", value: "Vắng không phép" },
    { key: "UNCHECKED", value: "Chưa điểm danh" },
    { key: "ALTER_TEACH", value: "Dạy thay" },
    { key: "ALTER_INSPECT", value: "Kiểm tra đầu giờ thay" },
    { key: "PRECHECK", value: "Kiểm tra 15 phút đầu giờ" },
  ];

  const handleChange = (e) => {
    if (e.target.value === "") return;
    if (e.target.name === "isSelfCheck") {
      setOne({ ...One, isSelfCheck: e.target.value==="true"? true:false });
    } else {
      setOne({ ...One, [e.target.name]: e.target.value });
      
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      AttendanceList.find(
        (a) =>
          a.id_target === One.id_target && a.id_schedule === One.id_schedule
      )
    ) {
      alert("Đã có một điểm danh cho đối tượng này vào buổi đăng ký!");
      return;
    } else
      addOneAttendance({
        ...One,
        id: `ATT${Math.floor(100000 * Math.random())}`,
        datetime_update: Date().toLocaleString(),
        id_last_editor: account.id,
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
          <Modal.Title>Thêm một điểm danh tùy chỉnh</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Cho phép tự điểm danh?
                </Form.Label>
                <Form.Control
                  name="isSelfCheck"
                  onClick={handleChange}
                  as="select"
                  required
                >
                  <option key="" value="">
                    Chọn...{" "}
                  </option>

                  <option key="1" value={true}>
                    Có
                  </option>
                  <option key="2" value={false}>
                    Không
                  </option>
                </Form.Control>
                <br></br>
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Đối tượng điểm danh:
                </Form.Label>
                <Form.Control
                  name="id_target"
                  onClick={handleChange}
                  // onChange={handleChange}
                  as="select"
                  required
                >
                  <option key="" value="">
                    Chọn đối tượng mà điểm danh này nhắm tới...
                  </option>

                  {InspectorList.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name} &nbsp;{item.id}
                      </option>
                    );
                  })}
                  {TeacherList.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}&nbsp;{item.id}
                      </option>
                    );
                  })}
                  {StudentList.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}&nbsp;{item.id}
                      </option>
                    );
                  })}
                </Form.Control>
                <br></br>
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Chọn buổi học hôm nay:
                </Form.Label>
                <Form.Control
                  name="id_schedule"
                  onClick={handleChange}
                  as="select"

                  // required
                >
                  <option key="" value="">
                    Chọn...
                  </option>
                  // ! Logic để hiện ra buổi của lớp chính khóa, min, max time
                  ````````````````````````````````````````````````````````````
                  {ScheduleList.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.id} &nbsp;Lớp:&nbsp;
                        {ClassList.find((c) => c.id === item.class_)?ClassList.find((c) => c.id === item.class_).name:"Không"}
                        &nbsp;&nbsp; Ngày:{item.date}
                      </option>
                    );
                  })}
                </Form.Control>
                <br></br>

                <Form.Label>
                  Bù cho buổi (*Dành cho những HỌC SINH học bù):
                </Form.Label>
                <Form.Control
                  name="debt_schedule"
                  onClick={handleChange}
                  as="select"
                >
                  <option key="" value="">
                    Chọn...
                  </option>
                  // ! Logic để hiện ra buổi của lớp chính khóa, min, max time
                  {ScheduleList.map((item, index) => {
                    const condition =
                      One.id_target &&
                      StudentList.find(
                        (s) => s.id === One.id_target && s.class_ === item.class_
                      )
                        ? true
                        : false;

                    return (
                      condition && (
                        <option key={index} value={item.id}>
                          {item.id} &nbsp;Lớp:&nbsp;
                          {ClassList.find((c) => c.id === item.class_).name}
                          &nbsp;&nbsp; Ngày:{item.date}
                        </option>
                      )
                    );
                  })}
                </Form.Control>
                <br></br>
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Tình trạng:
                </Form.Label>
                <Form.Control
                  name="type"
                  onClick={handleChange}
                  as="select"

                  // required
                >
                  <option key="" value="">
                    Chọn tình trạng điểm danh...
                  </option>
                  // ! Logic để hiện ra buổi của lớp chính khóa, min, max time
                  ````````````````````````````````````````````````````````````
                  {TypeList.map((item, index) => {
                    return (
                      <option key={index} value={item.key}>
                        {item.value}
                      </option>
                    );
                  })}
                </Form.Control>
                <br></br>
                <Form.Group>
                  <Form.Label>
                    Số lượng học sinh vào 15 phút đầu giờ (Dành cho GIÁM THỊ):
                  </Form.Label>
                  <Form.Control
                    name="prenum"
                    onChange={handleChange}
                    type="number"
                    className="numFormControl"
                  />
                </Form.Group>

                <Form.Label>Ghi chú:</Form.Label>
                <Form.Control
                  placeholder="Đầu giờ buổi hôm nay như thế nào?"
                  name="notice"
                  as="textarea"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="primary" variant="info">
                {" "}
                Thêm
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

export function AddClassAttendanceByAdmin() {
  const {
    account,
  }=useContext(AuthContext);
  //*TODO: For admin add a class Attendance. NO DEBTDAY, because if this classes for debt, before it => teacher ask admin in Message to cancel a id_canceled_schedule and if admin OK, create a new schedule.

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    ClassList,
    StudentList,
    TeacherList,
    InspectorList,
    ScheduleList,

    AttendanceList,
    addOneAttendance,
  } = useContext(DataContext);

  const [One, setOne] = useState({
    id: null, //auto
    id_schedule: null, //  ||auto from input
    id_last_editor: null, //auto 
    isSelfCheck: false,
    id_target: null,
    type: "UNCHECKED",
    debt_schedule: null,
    datetime_update: null, //auto from Date.now().toDateTimeString()
    notice: null,
    prenum: null, //for type:'PRECHECK'
  });

  const TypeList = [
    { key: "LATED", value: "Vào trễ" },
    { key: "PRESENT", value: "Có mặt" },
    { key: "SOONLEAVED", value: "Về sớm" },
    { key: "A-ABSENTED", value: "Vắng có phép" },
    { key: "B-ABSENTED", value: "Vắng không phép" },
    { key: "UNCHECKED", value: "Chưa điểm danh" },
    { key: "ALTER_TEACH", value: "Dạy thay" },
    { key: "ALTER_INSPECT", value: "Kiểm tra đầu giờ thay" },
    { key: "PRECHECK", value: "Kiểm tra 15 phút đầu giờ" },
  ];

  const handleChange = (e) => {
    if (e.target.value === "") return;
    if (e.target.name === "isSelfCheck") {
      setOne({ ...One, isSelfCheck: e.target.value==="true"? true:false });
    } else {
      setOne({ ...One, [e.target.name]: e.target.value });
     
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (One.id_schedule) {
      const ThisSchedule = ScheduleList.find((s) => s.id === One.id_schedule);
      const ThisClass = ClassList.find((c) => c.id === ThisSchedule.class_);

      StudentList.forEach((s) => {
        if (s.class_ === ThisSchedule.class_) {
          addOneAttendance({
            ...One,
            id: `ATT${Math.floor(100000 * Math.random())}`,
            id_target: s.id,
            datetime_update: Date().toLocaleString(),
            id_last_editor: account.id,
          });
        }
        return s;
      });
      if (ThisClass.teacher) {
        addOneAttendance({
          ...One,
          id: `ATT${Math.floor(100000 * Math.random())}`,
          id_target: ThisClass.teacher,
          datetime_update: Date().toLocaleString(),
          id_last_editor: account.id,
        });
      }
      if (ThisClass.inspector) {
        addOneAttendance({
          ...One,
          id: `ATT${Math.floor(100000 * Math.random())}`,
          id_target: ThisClass.inspector,
          type: "PRECHECK",
          datetime_update: Date().toLocaleString(),
          id_last_editor: account.id,
        });
      }
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Tạo điểm danh cho buổi học
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm điểm danh cho một buổi học</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Form onSubmit={handleSubmit}>
              <h3 style={{ textAlign: "center" }}>Danh sách điểm danh chung</h3>
              <Form.Group className="mb-3">
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Cho phép học sinh tự điểm
                  danh?
                </Form.Label>
                <Form.Control
                  name="isSelfCheck"
                  onClick={handleChange}
                  as="select"
                  required
                >
                  <option key="" value="">
                    Chọn...{" "}
                  </option>

                  <option key="1" value={true}>
                    Có
                  </option>
                  <option key="2" value={false}>
                    Không
                  </option>
                </Form.Control>
                <br></br>

                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Chọn buổi học cần tạo điểm
                  danh:
                </Form.Label>
                <Form.Control
                  name="id_schedule"
                  onClick={handleChange}
                  as="select"

                  // required
                >
                  <option key="" value="">
                    Chọn...
                  </option>
                  // ! Logic để hiện ra buổi của lớp chính khóa, min, max time
                  ````````````````````````````````````````````````````````````
                  {ScheduleList.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.id} &nbsp;Lớp:&nbsp;
                        {ClassList.find((c) => c.id === item.class_)?ClassList.find((c) => c.id === item.class_).name:"Không"}
                        &nbsp;&nbsp; Ngày:{item.date}
                      </option>
                    );
                  })}
                </Form.Control>
                <br></br>

                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Tình trạng:
                </Form.Label>
                <Form.Control name="type" onClick={handleChange} as="select">
                  <option key="" value="">
                    Mặc định là "Chưa điểm danh"...
                  </option>
                  // ! Logic để hiện ra buổi của lớp chính khóa, min, max time
                  ````````````````````````````````````````````````````````````
                  {TypeList.map((item, index) => {
                    return (
                      <option key={index} value={item.key}>
                        {item.value}
                      </option>
                    );
                  })}
                </Form.Control>
                <br></br>
                <Form.Label>Ghi chú:</Form.Label>
                <Form.Control
                  placeholder="Có lưu ý gì cho lớp này khi điểm danh không?"
                  name="notice"
                  as="textarea"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="info">
                {" "}
                Khởi tạo
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

export function AddClassAttendanceToday({schedule}) {
  const {
    account,
  }=useContext(AuthContext);
  //*TODO: Input: schedule. For 3W add a custom Attendance. Normal student: normal. Transit_student: auto have debtday schedule: transit{student:'',debt_schedule:''}.
  //Attendance: Create a list of Attendance for a class (formal schedule). By: Admin, Teacher, Inspector. Input: id creator

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    ClassList,
    StudentList,
    ScheduleList,
    addOneAttendance,
  } = useContext(DataContext);

  const [One, setOne] = useState({
    id: null, //auto
    id_schedule: schedule, //  ||auto from input
    id_last_editor: null, //auto 
    isSelfCheck: false,
    id_target: null,
    type: "UNCHECKED",
    debt_schedule: null,
    datetime_update: null, //auto from Date.now().toDateTimeString()
    notice: null,
    prenum: null, //for type:'PRECHECK'
  });

  const TypeList = [
    { key: "LATED", value: "Vào trễ" },
    { key: "PRESENT", value: "Có mặt" },
    { key: "SOONLEAVED", value: "Về sớm" },
    { key: "A-ABSENTED", value: "Vắng có phép" },
    { key: "B-ABSENTED", value: "Vắng không phép" },
    { key: "UNCHECKED", value: "Chưa điểm danh" },
    { key: "ALTER_TEACH", value: "Dạy thay" },
    { key: "ALTER_INSPECT", value: "Kiểm tra đầu giờ thay" },
    { key: "PRECHECK", value: "Kiểm tra 15 phút đầu giờ" },
  ];

  const handleChange = (e) => {
    if (e.target.value === "") return;
    if (e.target.name === "isSelfCheck") {
      setOne({ ...One, isSelfCheck: e.target.value==="true"? true:false });
    } else {
      setOne({ ...One, [e.target.name]: e.target.value });
      
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (One.id_schedule) {

      const ThisSchedule = ScheduleList.find((s) => s.id === One.id_schedule);

      const ThisClass = ClassList.find((c) => c.id === ThisSchedule.class_);

      StudentList.forEach((s) => {
        if (s.class_ === ThisSchedule.class_) {
          addOneAttendance({
            ...One,
            id: `ATT${Math.floor(100000 * Math.random())}`,
            id_target: s.id,
            datetime_update: Date().toLocaleString(),
            id_last_editor: account.id,
          });
        }
        return s;
      });
      if (ThisClass.teacher) {
        addOneAttendance({
          ...One,
          id: `ATT${Math.floor(100000 * Math.random())}`,
          id_target: ThisClass.teacher,
          datetime_update: Date().toLocaleString(),
          id_last_editor: account.id,
        });
      }
      if (ThisClass.inspector) {
        addOneAttendance({
          ...One,
          id: `ATT${Math.floor(100000 * Math.random())}`,
          id_target: ThisClass.inspector,
          type: "PRECHECK",
          datetime_update: Date().toLocaleString(),
          id_last_editor: account.id,
        });
      }
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Khởi tạo
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm điểm danh cho buổi học hiện tại</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Form onSubmit={handleSubmit}>
              <h3 style={{ textAlign: "center" }}>
                Tạo điểm danh cho lớp học hôm nay
              </h3>
              <Form.Group className="mb-3">
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Cho phép học sinh tự điểm
                  danh?
                </Form.Label>
                <Form.Control
                  name="isSelfCheck"
                  onClick={handleChange}
                  as="select"
                  required
                >
                  <option key="" value="">
                    Chọn...{" "}
                  </option>

                  <option key="1" value={true}>
                    Có
                  </option>
                  <option key="2" value={false}>
                    Không
                  </option>
                </Form.Control>
                <br></br>

                <Form.Label> Tình trạng:</Form.Label>
                <Form.Control name="type" onClick={handleChange} as="select">
                  <option key="" value="">
                    Mặc định là "Chưa điểm danh"...
                  </option>
                  // ! Logic để hiện ra buổi của lớp chính khóa, min, max time
                  ````````````````````````````````````````````````````````````
                  {TypeList.map((item, index) => {
                    return (
                      <option key={index} value={item.key}>
                        {item.value}
                      </option>
                    );
                  })}
                </Form.Control>
                <br></br>
                <Form.Label>Ghi chú:</Form.Label>
                <Form.Control
                  placeholder="Có lưu ý gì cho lớp này khi điểm danh không?"
                  name="notice"
                  as="textarea"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="info">
                {" "}
                Khởi tạo
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

export function AddOneAttendanceToday({schedule}) {
  const {
    account,
  }=useContext(AuthContext);
  //*TODO: For 3W add a custom Attendance. Normal student: normal. Transit_student: auto have debtday schedule: transit{student:'',debt_schedule:''}.

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    ClassList,
    StudentList,
    TeacherList,
    InspectorList,
    ScheduleList,

    AttendanceList,
    addOneAttendance,
  } = useContext(DataContext);

  const [One, setOne] = useState({
    id: null, //auto
    id_schedule: schedule, //  ||auto from input
    id_last_editor: null, //auto from 
    isSelfCheck: false,
    id_target: null,
    type: "UNCHECKED",
    debt_schedule: null,
    datetime_update: null, //auto from Date.now().toDateTimeString()
    notice: null,
    prenum: null, //for type:'PRECHECK'
  });

  const TypeList = [
    { key: "LATED", value: "Vào trễ" },
    { key: "PRESENT", value: "Có mặt" },
    { key: "SOONLEAVED", value: "Về sớm" },
    { key: "A-ABSENTED", value: "Vắng có phép" },
    { key: "B-ABSENTED", value: "Vắng không phép" },
    { key: "UNCHECKED", value: "Chưa điểm danh" },
    { key: "ALTER_TEACH", value: "Dạy thay" },
    { key: "ALTER_INSPECT", value: "Kiểm tra đầu giờ thay" },
    { key: "PRECHECK", value: "Kiểm tra 15 phút đầu giờ" },
  ];

  const handleChange = (e) => {
    if (e.target.value === "") return;
    if (e.target.name === "isSelfCheck") {
      setOne({ ...One, isSelfCheck: e.target.value==="true"? true:false });
    } else {
      setOne({ ...One, [e.target.name]: e.target.value });
     
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      AttendanceList.find(
        (a) =>
          a.id_target === One.id_target && a.id_schedule === One.id_schedule
      )
    ) {
      alert("Đã có một điểm danh cho đối tượng này vào buổi đăng ký!");
      return;
    } else
      addOneAttendance({
        ...One,
        id: `ATT${Math.floor(100000 * Math.random())}`,
        datetime_update: Date().toLocaleString(),
        id_last_editor:account.id,
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
          <Modal.Title>Thêm một điểm danh tùy chỉnh</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Cho phép tự điểm danh?
                </Form.Label>
                <Form.Control
                  name="isSelfCheck"
                  onClick={handleChange}
                  as="select"
                  required
                >
                  <option key="" value="">
                    Chọn...{" "}
                  </option>

                  <option key="1" value={true}>
                    Có
                  </option>
                  <option key="2" value={false}>
                    Không
                  </option>
                </Form.Control>
                <br></br>
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Đối tượng điểm danh:
                </Form.Label>
                <Form.Control
                  name="id_target"
                  onClick={handleChange}
                  // onChange={handleChange}
                  as="select"
                  required
                >
                  <option key="" value="">
                    Chọn đối tượng mà điểm danh này nhắm tới...
                  </option>

                  {InspectorList.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name} &nbsp;{item.id}
                      </option>
                    );
                  })}
                  {TeacherList.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}&nbsp;{item.id}
                      </option>
                    );
                  })}
                  {StudentList.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}&nbsp;{item.id}
                      </option>
                    );
                  })}
                </Form.Control>
                <br></br>

                <Form.Label>
                  Bù cho buổi (*Dành cho những HỌC SINH học bù):
                </Form.Label>
                <Form.Control
                  name="debt_schedule"
                  onClick={handleChange}
                  as="select"
                >
                  <option key="" value="">
                    Chọn...
                  </option>
                  // ! Logic để hiện ra buổi của lớp chính khóa, min, max time
                  {ScheduleList.map((item, index) => {
                    const condition =
                      One.id_target &&
                      StudentList.find(
                        (s) => s.id === One.id_target && s.class_ === item.class_
                      )
                        ? true
                        : false;

                    return (
                      condition && (
                        <option key={index} value={item.id}>
                          {item.id} &nbsp;Lớp:&nbsp;
                          {ClassList.find((c) => c.id === item.class_).name}
                          &nbsp;&nbsp; Ngày:{item.date}
                        </option>
                      )
                    );
                  })}
                </Form.Control>
                <br></br>
                <Form.Label>
                  {" "}
                  <div className="redstar">*</div>Tình trạng:
                </Form.Label>
                <Form.Control
                  name="type"
                  onClick={handleChange}
                  as="select"

                  // required
                >
                  <option key="" value="">
                    Chọn tình trạng điểm danh...
                  </option>
                  // ! Logic để hiện ra buổi của lớp chính khóa, min, max time
                  ````````````````````````````````````````````````````````````
                  {TypeList.map((item, index) => {
                    return (
                      <option key={index} value={item.key}>
                        {item.value}
                      </option>
                    );
                  })}
                </Form.Control>
                <br></br>
                <Form.Group>
                  <Form.Label>
                    Số lượng học sinh vào 15 phút đầu giờ (Dành cho GIÁM THỊ):
                  </Form.Label>
                  <Form.Control
                    name="prenum"
                    onChange={handleChange}
                    type="number"
                    className="numFormControl"
                  />
                </Form.Group>

                <Form.Label>Ghi chú:</Form.Label>
                <Form.Control
                  placeholder="Đầu giờ buổi hôm nay như thế nào?"
                  name="notice"
                  as="textarea"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="primary">
                {" "}
Thêm              </Button>
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

export function CompleteOneAttendanceToday({attendance}) {
  const {
    account
  }=useContext(AuthContext);
  // *TODO: For Student. set type and notice.
  //Attendance: HS/GT/GV điểm danh cho 1 HS=>Thực chất là chỉnh sửa 1 điểm danh, với những thuộc tính có sẵn, input: detail{}

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    ClassList,
    StudentList,
    TeacherList,
    InspectorList,
    ScheduleList,
    AttendanceList,
    addOneAttendance,
    updateAttendance,
    deleteAttendance,
  } = useContext(DataContext);

  const OriginAttendance = AttendanceList.find((a) => a.id === attendance);

  const [One, setOne] = useState({
    id: attendance,
    id_schedule: OriginAttendance.id_schedule,
    id_last_editor: account.id,
    isSelfCheck: OriginAttendance.isSelfCheck,
    id_target: OriginAttendance.id_target,
    type: OriginAttendance.type,
    debt_schedule: OriginAttendance.debt_schedule,
    datetime_update: null, //auto from Date.now().toDateTimeString()
    notice: null,
    prenum: null, //for type:'PRECHECK'
  });

  const TypeList = [
    { key: "LATED", value: "Vào trễ" },
    { key: "PRESENT", value: "Có mặt" },
    { key: "SOONLEAVED", value: "Về sớm" },
    { key: "A-ABSENTED", value: "Vắng có phép" },
    { key: "B-ABSENTED", value: "Vắng không phép" },
    { key: "UNCHECKED", value: "Chưa điểm danh" },
  ];

  const handleChange = (e) => {
    if (e.target.value === "") return;
    else {
      setOne({ ...One, [e.target.name]: e.target.value });
     
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAttendance({
      ...One,
      datetime_update: Date().toLocaleString(),
    });
  }; 

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
        Điểm danh!
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Điểm danh cho hôm nay</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <Form onSubmit={handleSubmit}>
              <h3 style={{ textAlign: "center" }}>Điểm danh cho hôm nay</h3>
              <Form.Group className="mb-3">
                {OriginAttendance.id_target.substring(0, 3) !== "INS" && (
                  <Form.Group>
                    <Form.Label>
                      {" "}
                      <div className="redstar">*</div>Tình trạng:
                    </Form.Label>
                    <Form.Control
                      name="type"
                      onClick={handleChange}
                      as="select"
                    >
                      <option key="" value="">
                        Mặc định là "Chưa điểm danh"...
                      </option>
                      // ! Logic để hiện ra buổi của lớp chính khóa, min, max
                      time
                      ````````````````````````````````````````````````````````````
                      {TypeList.map((item, index) => {
                        return (
                          <option key={index} value={item.key}>
                            {item.value}
                          </option>
                        );
                      })}
                    </Form.Control>
                    <br></br>
                  </Form.Group>
                )}

                {OriginAttendance.id_target.substring(0, 3) === "INS" && (
                  <Form.Group>
                    <Form.Label>
                      Số lượng học sinh vào 15 phút đầu giờ (Dành cho GIÁM THỊ):
                    </Form.Label>
                    <Form.Control
                      name="prenum"
                      onChange={handleChange}
                      type="number"
                      className="numFormControl"
                    />
                  </Form.Group>
                )}

                <Form.Label>Ghi chú:</Form.Label>
                <Form.Control
                  placeholder="Đầu giờ buổi hôm nay như thế nào?"
                  name="notice"
                  as="textarea"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="info">
                {" "}
                Điểm danh!
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

export function AddPermissionAllToday({schedule}) {
 

  const { AttendanceList, updateAttendance } = useContext(DataContext);
  const handleUpdatePermission = () => {
    AttendanceList.forEach((a) => {
      if (a.id_schedule === schedule) {
        let b = a;
        b.isSelfCheck = true;
        updateAttendance(b);
      }
      return a;
    });
  };

  return (
    <Button variant="success" onClick={handleUpdatePermission}>
      Cấp quyền
    </Button>
  );
}

export function RemovePermissionAllToday({schedule}) {
 
    const { AttendanceList, updateAttendance } = useContext(DataContext);

  const handleUpdatePermission = () => {
    AttendanceList.forEach((a) => {
      if (a.id_schedule === schedule) {
        let b = a;
        b.isSelfCheck = false;
        updateAttendance(b);
      }
    });
  };

  return (
    <Button variant="danger" onClick={handleUpdatePermission}>
      Thu hồi
    </Button>
  );
}
