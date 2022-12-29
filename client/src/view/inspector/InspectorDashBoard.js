import React, { useContext, useState } from "react";
import { ScheduleDetailButton } from "../admin/workplace/ScheduleAWS";
import { DataContext } from "./../../context/DataContext";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { HistorySchedule } from "../teacher/TeacherDashBoard";
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from "react-router-dom";

export default function InspectorDashBoard() {

  const {
    ClassList,
    ScheduleList,
    RoomList
  } = useContext(DataContext);

  const {
    isAuthenticated,
    account,
    actor,
  }=useContext(AuthContext);

  const now = new Date();
  const datenow = now.toLocaleDateString('en-GB');
  const [schedulenow, setScheduleNow] = useState([]);
  useState(() => {
    setScheduleNow([]);
  }, [account]);
  if(actor!=="INSPECTOR") return (<Navigate  to='/' />)

  return (
    <>

      <h1>Lịch trực của tôi</h1>
      <h2>
        Hôm nay ({datenow}) bạn có {schedulenow.length} ca trực. {schedulenow.length!==0 ? <Link to="/inspector/thisday">Tham gia ngay!</Link> : "Hãy nghỉ ngơi!"}
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
              if (
                
                compareDateString(datenow, item.date) === 0
              ) {
                if (!schedulenow.includes(item))
                if(ClassList.find((c) => c.id === item.class_).inspector ===
                account.id)
                  setScheduleNow([...schedulenow, item]);
              }
              return (
                ClassList.find(c=>c.id===item.class_).inspector===account.id&& (
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
                        <InspectorJoinButton schedule={item} />
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

export function InspectorJoinButton({ schedule }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/inspector/thisday", schedule);
  };
  return (
    <Button variant="success" onClick={handleClick}>
      Tham gia{" "}
    </Button>
  );
}
