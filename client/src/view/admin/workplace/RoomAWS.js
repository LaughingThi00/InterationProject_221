import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Accordion, Form } from "react-bootstrap";
import { DataContext } from "../../../context/DataContext";

export function RoomAWS() {
  const { RoomList, deleteRoom } = useContext(DataContext);

  const handleDeleteRoom = (e) => {
    deleteRoom(e.target.value);
  };




  return (
    <>
      <div className="table-fixed table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Mã</th>
              <th scope="col">Tên phòng</th>
              <th scope="col"> Tùy chỉnh</th>
            </tr>
          </thead>

          <tbody>
            {RoomList.map((room, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{room.id}</td>
                  <td>{room.name ? room.name : "Không"}</td>

                  <td>
                    <RoomDetail detail={room.id} />

                    <Button
                      variant="danger"
                      onClick={handleDeleteRoom}
                      value={room.id}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <AddRoom />
      </div>
    </>
  );
}

export function AddRoom() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { RoomList, addRoom } = useContext(DataContext);
  //=========================== OBJECT =========================

  const [One, setOne] = useState({
    id: "",
    name: "",
    type: "CASUAL",
    state: "GOOD",
    description: "",
  });

  const statelist = [
    "MỚI XÂY",
    "XUỐNG CẤP",
    "BÌNH THƯỜNG",
    "ĐANG TU SỬA",
    "ĐÃ SẬP",
  ];
  const typelist = ["VIP", "HIGH-QUALIFIED", "INTERMEDIATE", "CASUAL"];

  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleChange = (e) => {
    setOne({ ...One, [e.target.name]: e.target.value });
  };

  //=========================== HANDLE SUBMIT FUNCTION =========================
  const handleAdd = (e) => {
    e.preventDefault();
    if (e.target.value === "") return;

      if(RoomList.find(r=>r.name===One.name)){
        alert('Tên phòng trùng!')
        return;
      }
      
    addRoom({ ...One, id: `ROM${Math.floor(10000 * Math.random())}` });
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
          <Modal.Title>Thông tin phòng mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}

          <Form onSubmit={handleAdd}>
            <Form.Group className="mb-3">
              <Form.Label>Tên phòng</Form.Label>
              <Form.Control
                placeholder="Nguyễn Thị Phòng Học..."
                name="name"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Loại phòng</Form.Label>
              <Form.Select name="type" onClick={handleChange} required>
                <option key="0" value="">
                  Chọn...
                </option>
                {typelist.map((type, index) => {
                  return (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tình trạng</Form.Label>
              <Form.Select name="type" onClick={handleChange} required>
                <option key="0" value="">
                  Chọn...
                </option>
                {statelist.map((state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                name="description"
                onChange={handleChange}
                placeholder="Mô tả ngắn gọn..."
              />
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

export function RoomDetail({detail}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {RoomList,ScheduleList,ClassList}=useContext(DataContext);
  const room=RoomList.find(r=>r.id===detail);
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
          <Modal.Title>Phòng {room ? room.name: ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL INFO ========================= */}
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
              <div>
                <h6>ID:</h6>
                <p>{room? room.id? room.id:'Chưa có': 'Chưa xác định'}</p>
                </div>
                <div>
                <h6>Tên phòng:</h6>
                <p>{room? room.name? room.name:'Chưa có': 'Chưa xác định'}</p>
                </div>
                <div>
                <h6>Loại:</h6>
                <p>{room? room.type? room.type:'Chưa biết': 'Chưa xác định'}</p>
                </div>
                <div>
                <h6>Tình trạng:</h6>
                <p>{room? room.state? room.state:'Chưa cập nhật': 'Chưa xác định'}</p>
                </div>
                <div>
                <h6>Mô tả:</h6>
                <p>{room? room.description? room.description:'Chưa có': 'Chưa xác định'}</p>
                </div>
                <UpdateRoom detail={detail} />
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Lịch sử dụng
              </Accordion.Header>
              <Accordion.Body>

              <div className="table-fixed table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" colSpan='1'>#</th>
              <th scope="col" colSpan='2'>Buổi học</th>
              <th scope="col" colSpan='2'>Lớp</th>
              <th scope="col" colSpan='1'>Tải</th>
              <th scope="col" colSpan='2'>Vào ngày</th>
              <th scope="col" colSpan='2'> Bắt đầu</th>
              <th scope="col" colSpan='2'> Kết thúc</th>

            </tr>
          </thead>

          <tbody>
            {ScheduleList.map((schedule, index) => {
               return (
                schedule.room===detail&& <tr key={index}>
                  <th colSpan='1' scope="row">{index + 1}</th>
                  <td colSpan='2'>{schedule.id}</td>
                  <td colSpan='2'>{ClassList.find(c=>c.id===schedule.class_) ?ClassList.find(c=>c.id===schedule.class_).name: 'Không'}</td>
                  <td colSpan='1'>{ClassList.find(c=>c.id===schedule.class_)?ClassList.find(c=>c.id===schedule.class_).num:'Không'}</td>
                  <td colSpan='2'>{schedule.date}</td>
                  <td colSpan='2'>{schedule.starttime}</td>
                  <td colSpan='2'>{schedule.endtime}</td>
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

export function UpdateRoom({detail}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {RoomList,updateRoom}=useContext(DataContext);
  const room=RoomList.find(r=>r.id===detail);


   //=========================== OBJECT =========================

   const [One, setOne] = useState({
    id: detail,
    name: null,
    type: null,
    state: null,
    description: null,
  });

  const statelist = [
    "MỚI XÂY",
    "TỐT",
    "XUỐNG CẤP",
    "BÌNH THƯỜNG",
    "ĐANG TU SỬA",
    "ĐÃ SẬP",
  ];
  const typelist = ["VIP", "HIGH-QUALIFIED", "INTERMEDIATE", "CASUAL"];

    //=========================== HANDLE CHANGE FUNCTION =========================

  const handleChange = (e) => {
    setOne({ ...One, [e.target.name]: e.target.value });
  };

  //=========================== HANDLE SUBMIT FUNCTION =========================
  const handleUpdate = (e) => {
    e.preventDefault();
    if (e.target.value === "") return;

  
    updateRoom(One);
  };

  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Chỉnh sửa
      </Button>

      <Modal
      style={{border:'5px solid gray'}}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa phòng {room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL INFO ========================= */}
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin chung</Accordion.Header>
              <Accordion.Body>
              <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Tên phòng</Form.Label>
              <Form.Control
                placeholder="Nguyễn Thị Phòng Học..."
                name="name"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Loại phòng</Form.Label>
              <Form.Select name="type" onClick={handleChange} >
                <option key="0" value="">
                  Chọn...
                </option>
                {typelist.map((type, index) => {
                  return (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tình trạng</Form.Label>
              <Form.Select name="state" onClick={handleChange} >
                <option key="0" value="">
                  Chọn...
                </option>
                {statelist.map((state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                name="description"
                onChange={handleChange}
                placeholder="Mô tả ngắn gọn..."
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Lưu thay đổi
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
  );}

export function DeleteRoom() {
  return <div>RoomAWS</div>;
}
