import React, { useContext, useState } from "react";
import  { Link, Navigate } from "react-router-dom";
import Welcomeimg from "./img/welcome.png";
import Doremon from "./img/Doraemon.png";
import { Modal, Form, Button } from "react-bootstrap";
import { AuthContext } from "./../context/AuthContext";

function LoginButton() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { loginUser, actor } = useContext(AuthContext);

  //=========================== OBJECT =========================

  const [One, setOne] = useState({
    username: null,
    password: null,
  });

  //=========================== HANDLE CHANGE FUNCTION =========================

  const handleChange = (e) => {
    setOne({ ...One, [e.target.name]: e.target.value });
  };

  //=========================== HANDLE SUBMIT FUNCTION =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    const LoginResult = await loginUser(One);
   
  };
  switch (actor) {
        case "STUDENT":
          return <Navigate replace to='/student/home' />
        case "TEACHER":
          return <Navigate replace to='/teacher/home' />
        case "INSPECTOR":
          return <Navigate replace to='/inspector/home' />
        case "ADMIN":
          return (<Navigate replace to='/admin/dashboard' />)

        default:
       
      }
  return (
    <>
      <button onClick={handleShow}>Đăng nhập</button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* =========================== GENERAL FORM ========================= */}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu </Form.Label>
              <Form.Control
                name="password"
                type="password"
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Đăng nhập
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const Welcome = () => {


  return (
    <>
      <div className="Welcome-Header">
        <Link to="/">
          <img src={Doremon} className="Icon" />
        </Link>

        <LoginButton className="LoginButton" />
      </div>

      <div className="Welcome-Content">
        <img className="MainImg" src={Welcomeimg} alt="" />

        <div className="IntroText">
          <h1>DOREMON ENGLISH</h1>
          <h3>
            Nền tảng quản lý trung tâm Anh ngữ tốt nhất Việt Nam. Đầy đủ các
            tính năng: Quản lý dữ liệu, điểm danh tập trung, Dashboard, ...
          </h3>
        </div>

        <div className="ConText">
          
          <h1>1.Some introduction about us</h1>
          <h1>2.Main functions</h1>
          <h1>3.Main context</h1>
        </div>
      </div>
    </>
  );
};

export default Welcome;
