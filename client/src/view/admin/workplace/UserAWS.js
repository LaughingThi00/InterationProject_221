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
  useEffect(()=>{setList(UserList)},[UserList])
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
                Lo???i
              </th>
              <th colSpan="2" scope="col">
                Ng??y t???o
              </th>
              <th colSpan="2" scope="col">
                {" "}
                T??y ch???nh
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
                      "H???c sinh"
                    ) : TeacherList.find((itm) => itm.userId === item._id) ? (
                      "Gi??o vi??n"
                    ) : InspectorList.find((itm) => itm.userId === item._id) ? (
                      "Gi??m th???"
                    ) : AdminList.find((itm) => itm.userId === item._id) ? (
                      "Qu???n tr??? vi??n"
                    ) : (
                      <p className="red-text"> Kh??ng x??c ?????nh</p>
                    )}
                  </td>
                  <td colSpan="2">
                    {item.active_day ? item.active_day : "Kh??ng"}
                  </td>

                  <td colSpan="2">
                    <UserDetail detail={item._id} />

                    <Button
                      variant="danger"
                      onClick={handleDeleteUser}
                      value={item._id}
                    >
                      X??a
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
          S???p x???p (t???o g???n nh???t)
        </Button>
        <Button variant="warning" onClick={sortByTimeOldest}>
          S???p x???p (t???o l??u nh???t)
        </Button>
      </div>
      <div style={{ textAlign: "center" }}>
        <Form onSubmit={(e)=>{ e.preventDefault(); filtByActor(ActorFilter)}}>
              <Form.Label>Ch???n lo???i ng?????i d??ng</Form.Label>
              <Form.Select style={{display: 'inline-block', width:'30%',margin:'0 10px'}}
                onClick={(e)=>{setActorFilter(e.target.value)}}
                placeholder="T??n l???p"
              >
                <option key="0" value="">
                  T???t c???
                </option>
               
                    <option key="1" value="ADMIN">
                      Qu???n tr??? vi??n
                    </option>
                    <option key="2" value="INSPECTOR">
                      Gi??m th???
                    </option>
                    <option key="3" value="TEACHER">
                      Gi??o vi??n
                    </option>
                    <option key="4" value="STUDENT">
                    H???c vi??n
                    </option>
                  
              </Form.Select>

            <Button variant="info" type="submit" style={{marginTop:'5px'}}>
              L???c 
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
        Chi ti???t
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
              <Accordion.Header>Th??ng tin chung</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>ID:</h6>
                  <p>
                    {user ? (user._id ? user._id : "Ch??a c??") : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>Username:</h6>
                  <p>
                    {user
                      ? user.username
                        ? user.username
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>M???t kh???u:</h6>
                  <p className="red-text">Kh??ng ???????c xem</p>
                </div>

                <div>
                  <h6>Ng??y k??ch ho???t</h6>
                  <p>
                    {user
                      ? user.active_day
                        ? user.active_day
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>Mail ph???c h???i:</h6>
                  <p>
                    {user
                      ? user.recovery_mail
                        ? user.recovery_mail
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <UpdateUser detail={detail} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Th??ng tin t??i kho???n</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h6>Lo???i:</h6>
                  <p>
                    {account
                      ? account.id.slice(0, 3) === "ADM"
                        ? "QU???N TR??? VI??N"
                        : account.id.slice(0, 3) === "INS"
                        ? "GI??M TH???"
                        : account.id.slice(0, 3) === "TEA"
                        ? "GI??O VI??N"
                        : account.id.slice(0, 3) === "STU"
                        ? "H???C SINH"
                        : "Kh??ng x??c ?????nh"
                      : "Kh??ng c??"}
                  </p>
                </div>

                <div>
                  <h6>H??? t??n:</h6>
                  <p>
                    {account
                      ? account.name
                        ? account.name
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>Gi???i t??nh:</h6>
                  <p>
                    {account
                      ? account.gender
                        ? account.gender
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>

                <div>
                  <h6>Ng??y sinh:</h6>
                  <p>
                    {account
                      ? account.birth
                        ? account.birth
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>
                <div>
                  <h6>S??? ??i???n tho???i:</h6>
                  <p>
                    {account
                      ? account.phone
                        ? account.phone
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>
                <div>
                  <h6>Email:</h6>
                  <p>
                    {account
                      ? account.email
                        ? account.email
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>
                <div>
                  <h6>M?? t???:</h6>
                  <p>
                    {account
                      ? account.description
                        ? account.description
                        : "Ch??a c??"
                      : "Ch??a x??c ?????nh"}
                  </p>
                </div>
                <UpdateUser detail={detail} />
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
        Ch???nh s???a
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>C???p nh???t th??ng tin user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}

          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>M???t kh???u m???i</Form.Label>
              <Form.Control
                name="password"
                onChange={handleChange}
                onClick={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mail ph???c h???i m???i</Form.Label>
              <Form.Control
                name="recovery_mail"
                onChange={handleChange}
                onClick={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              S???a
            </Button>
          </Form>
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
