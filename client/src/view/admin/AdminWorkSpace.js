import React from "react";
import { ScheduleAWS } from "./workplace/ScheduleAWS";
import { ClassAWS } from "./workplace/ClassAWS";
import { StudentAWS } from "./workplace/StudentAWS";
import { AttendanceAWS } from "./workplace/AttendanceAWS";
import { RoomAWS } from "./workplace/RoomAWS";
import { InspectorAWS } from "./workplace/InspectorAWS";
import { TeacherAWS } from "./workplace/TeacherAWS";
import { Accordion } from "react-bootstrap";
import { AdminAWS } from "./workplace/AdminAWS";
import { UserAWS } from "./workplace/UserAWS";
import { useContext } from "react";
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from "react-router-dom";


const AdminWorkSpace = () => {

  const {
    actor,
  }=useContext(AuthContext);
  if(actor!=="ADMIN") {
    console.log("Bi day tu AdminWorkSpace:",actor)

    return (<Navigate replace to='/' />)
  }
  return (
    <>
     
      <Accordion defaultActiveKey={['0']} alwaysOpen>
      <Accordion.Item eventKey="0">
          <Accordion.Header>Quản lý User</Accordion.Header>
          <Accordion.Body>
            <UserAWS />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Quản lý Admin</Accordion.Header>
          <Accordion.Body>
            <AdminAWS />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Quản lý Giám Thị</Accordion.Header>
          <Accordion.Body>
            <InspectorAWS />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Quản lý Giáo Viên</Accordion.Header>
          <Accordion.Body>
            <TeacherAWS />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Quản lý Học Sinh</Accordion.Header>
          <Accordion.Body>
            <StudentAWS />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Quản lý Lớp</Accordion.Header>
          <Accordion.Body>
            <ClassAWS />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>Quản lý Phòng Học</Accordion.Header>
          <Accordion.Body>
            <RoomAWS />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Quản lý Thời Khóa Biểu</Accordion.Header>
          <Accordion.Body>
            <ScheduleAWS />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="8">
          <Accordion.Header>Quản lý Điểm Danh</Accordion.Header>
          <Accordion.Body>
            <AttendanceAWS />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </>
  );
};


export default AdminWorkSpace;
