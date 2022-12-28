import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Welcome from "./view/Welcome";

import AdminDashboard from "./view/admin/AdminDashboard";
import AdminWorkSpace from "./view/admin/AdminWorkSpace";
import AdminMain from "./view/admin/AdminMain";

import InspectorWorkSpace from "./view/inspector/InspectorWorkSpace";
import InspectorDashBoard from "./view/inspector/InspectorDashBoard";
import InspectorMain from "./view/inspector/InspectorMain";
import InspectorAccount from "./view/inspector/InspectorAccount";

import TeacherMain from "./view/teacher/TeacherMain";
import TeacherDashBoard from "./view/teacher/TeacherDashBoard";
import TeacherWorkSpace from "./view/teacher/TeacherWorkSpace";
import TeacherAccount from "./view/teacher/TeacherAccount";

import StudentMain from "./view/student/StudentMain";
import StudentDashBoard from "./view/student/StudentDashBoard";
import StudentWorkSpace from "./view/student/StudentWorkSpace";
import StudentAccount from "./view/student/StudentAccount";
import AdminAccount from './view/admin/AdminAccount';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          
          <Route path="/admin" element={<AdminMain />}>
            <Route path="/admin/manage" element={<AdminWorkSpace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/account" element={<AdminAccount />} />

          </Route>
          
          <Route path="/inspector" element={<InspectorMain />}>
            <Route path="/inspector/home" element={<InspectorDashBoard />} />
            <Route path="/inspector/thisday" element={<InspectorWorkSpace />} />
            <Route path="/inspector/account" element={<InspectorAccount />} />
          </Route>

          <Route path="/teacher" element={<TeacherMain />}>
            <Route path="/teacher/home" element={<TeacherDashBoard />} />
            <Route path="/teacher/thisday" element={<TeacherWorkSpace />} />
            <Route path="/teacher/account" element={<TeacherAccount />} />
          </Route>          
          <Route path="/student" element={<StudentMain />}>
          <Route path="/student/home" element={<StudentDashBoard />} />
            <Route path="/student/thisday" element={<StudentWorkSpace />} />
            <Route path="/student/account" element={<StudentAccount />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
