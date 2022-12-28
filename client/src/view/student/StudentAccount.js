import React, { useContext } from 'react'
import { DataContext } from './../../context/DataContext';
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const StudentAccount = () => {
  const { StudentList } = useContext(DataContext);
  const {
    isAuthenticated,
    account,
    actor,
  }=useContext(AuthContext);
  const student = StudentList.find((i) => i.id === account.id);

  if(actor!=="STUDENT") return (<Navigate replace to='/' />)

return (
<>
<h1>Tài khoản của tôi</h1>
          {/* =========================== GENERAL INFO ========================= */}
   <div className='DivAccount'>

   <div>
                  <h6>ID:</h6>
                  <p>
                    {student
                      ? student.id
                        ? student.id
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Tên:</h6>
                  <p>
                    {student
                      ? student.name
                        ? student.name
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Giới tính:</h6>
                  <p>
                    {student
                      ? student.gender
                        ? student.gender
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Tháng sinh:</h6>
                  <p>
                    {student
                      ? student.birth
                        ? student.birth
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Số điện thoại:</h6>
                  <p>
                    {student
                      ? student.phone
                        ? student.phone
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Email:</h6>
                  <p>
                    {student
                      ? student.email
                        ? student.email
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Mô tả:</h6>
                  <p>
                    {student
                      ? student.description
                        ? student.description
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Lớp học:</h6>
                  <p>
                    {student
                      ? student.class_
                        ? student.class_
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

              
   </div>
           
             
</>  )
}

export default StudentAccount