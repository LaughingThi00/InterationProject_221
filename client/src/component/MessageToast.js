import React, { useState } from 'react';

import Toast from 'react-bootstrap/Toast';

export function MessageToast(toast) {
    const {isShow, actionMessage,isSuccess}=toast;
  const [show, setShow] = useState(isShow);

  return (
        <Toast bg={isSuccess? 'success':'danger'} onClose={() => setShow(false)} show={show} delay={2000} autohide
        style={{position: 'fixed',top:'50px',right:'50px'}}
        >
          <Toast.Header>
         
            <strong className="me-auto"> </strong>
            <small>0 giây trước</small>
          </Toast.Header>
          <Toast.Body>Tác vụ {actionMessage} {isSuccess? 'thành công!':'thất bại. Vui lòng thử lại sau!'} </Toast.Body>
        </Toast>
      
  );
}

