import React, { useContext, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { DataContext } from './../context/DataContext';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
function DashChart() {
const {UserList,AdminList,InspectorList,TeacherList,StudentList,ClassList,ScheduleList,AttendanceList} = useContext(DataContext)



//* ====================================== COMPUTATION FIELD =================================================================
const [ClassFilter,setClassFilter]=useState('');
const [FiltedAttendanceList,setFiltedAttendanceList]=useState(AttendanceList);
const filtByClass = (act) => {
    if(act===''|!act) return;
  setFiltedAttendanceList([
        ...AttendanceList.filter(item=>ScheduleList(itm=>itm.id===item.id_schedule&&itm.class_===act))
      ]);
    };
let pieAtt={lated:0,present:0,soonleaved:0,a_absented:0,b_absented:0,unchecked:0,alter_teach:0,alter_inspect:0,precheck:0}


FiltedAttendanceList.forEach(item => {
    switch (item.type) {
            case "LATED":
                ++pieAtt.lated;
                break;
            case "PRESENT":
                ++pieAtt.present;
                break;
            case "SOONLEAVED":
                ++pieAtt.soonleaved;
                break;
            case "A-ABSENTED":
                ++pieAtt.a_absented;
                break;
            case "B-ABSENTED":
                ++pieAtt.b_absented;
                break;
            case "UNCHECKED":
                ++pieAtt.unchecked;
                break;
            case "ALTER_TEACH":
                ++pieAtt.alter_teach;
                break;
            case "ALTER_INSPECT":
                ++pieAtt.alter_inspect;
                break;
            case "PRECHECK":
                item.prenum?  ++pieAtt.precheck :  ++pieAtt.unchecked;
                break;

        default:
            break;
    }
});











  return (
    <>
    <div style={{display:'flex',justifyContent:'space-evenly'}}>
 <Bar style={{maxWidth:'70%',height:'auto'}}
    data={{
      labels: [
        "Quản trị viên",
        "Giám thị",
        "Giáo viên",
        "Học sinh",
      ],
      datasets: [
        {
          label: `Số tài khoản (Tổng:${UserList.length}) `,
          backgroundColor: [
            "#3e95cd",
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
          ],
          data: [AdminList.length, InspectorList.length, TeacherList.length, StudentList.length]
        }
      ]
    }}
    options={{
      legend: { display: false },
      title: {
        display: true,
        text: "Predicted world population (millions) in 2050"
      }
    }}
  />
    </div>
     <h3 style={{textAlign:'center'}}>Số tài khoản trên hệ thống</h3>




<br></br>
<br></br>



<div style={{display:'flex',justifyContent:'space-evenly'}}>
 <Doughnut
//   style={{maxWidth:'50vw!important',height:'auto'}}
    data={{


      labels: [
        "Có mặt",
        "Vào trễ",
        "Về sớm",
        "Vắng có phép",
        "Vắng không phép",
        "Chưa điểm danh",
        "Dạy thay",
        "Kiểm tra đầu giờ thay",
        "Kiểm tra 15 phút đầu giờ",
      ],
      datasets: [
        {
          label: `Số tài khoản (Tổng:${FiltedAttendanceList.length}) `,
          backgroundColor: [
            "#3cba9f",
            '#B55A30',
            '#D2386C',
            "#e8c3b9",
            '#FF6F61',
            '#939597',
            "#3e95cd",
            '#9A8B4F',
            "#8e5ea2",
        
            
          ],
          data: [
            pieAtt.lated,pieAtt.present,pieAtt.soonleaved,pieAtt.a_absented,pieAtt.b_absented,pieAtt.unchecked,pieAtt.alter_teach,pieAtt.alter_inspect,pieAtt.precheck
          ]
        }
      ]
    }}
    options={{
      legend: { display: false },
      title: {
        display: true,
        text: "Predicted world population (millions) in 2050"
      }
    }}
  />
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
              Lọc lớp
            </Button>
          </Form>
      </div>
    </div>
     <h3 style={{textAlign:'center'}}>Thành phần điểm danh</h3>

















     </>

  )
}

export default DashChart
