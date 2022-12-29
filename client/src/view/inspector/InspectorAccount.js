import React, { useContext } from 'react'
import { Accordion } from 'react-bootstrap';
import { getLocal } from '../../reducer/DataReducer';
import { DataContext } from './../../context/DataContext';
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const InspectorAccount = () => {
  const {
    isAuthenticated,
    account,
    actor,
  }=useContext(AuthContext);
  const { InspectorList, ClassList } = useContext(DataContext);
  const inspector = InspectorList.find((i) => i.id === account.id);

  if(actor!=="INSPECTOR") return (<Navigate replace to='/' />)

return (
<>
<div className="content">

<h1>Tài khoản của tôi</h1>
          {/* =========================== GENERAL INFO ========================= */}
   <div className='DivAccount'>

   <div>
                  <h6>ID:</h6>
                  <p>
                    {inspector
                      ? inspector.id
                        ? inspector.id
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Tên:</h6>
                  <p>
                    {inspector
                      ? inspector.name
                        ? inspector.name
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Giới tính:</h6>
                  <p>
                    {inspector
                      ? inspector.gender
                        ? inspector.gender
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Tháng sinh:</h6>
                  <p>
                    {inspector
                      ? inspector.birth
                        ? inspector.birth
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Số điện thoại:</h6>
                  <p>
                    {inspector
                      ? inspector.phone
                        ? inspector.phone
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Email:</h6>
                  <p>
                    {inspector
                      ? inspector.email
                        ? inspector.email
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Mô tả:</h6>
                  <p>
                    {inspector
                      ? inspector.description
                        ? inspector.description
                        : "Chưa có"
                      : "Chưa xác định"}
                  </p>
                </div>

                <div>
                  <h6>Danh sách lớp trực:</h6>
                  {ClassList.map((item) => {
                    return (
                      item.inspector===account.id&&<div className="editors_item" key={item}>
                        <div className="editors_item_content">
                          {item.name}
                        </div>

                
                      </div>
                    );
                  })}
                </div>
   </div>
   </div>
    
             
</>  )
}

export default InspectorAccount