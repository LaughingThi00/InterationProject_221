import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import {

  reducerClassList,
  reducerScheduleList,
  reducerStudentList,
  reducerAttendanceList,
  reducerRoomList,
  reducerAdminList,
  reducerInspectorList,
  reducerTeacherList,
  reducerUserList,
} from "./../reducer/DataReducer";
import { apiUrl,clientUrl } from "../component/constant";

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  // !======================================================FOR CONTEXT========================================================//
  const [UserList, dispatchUserList] = useReducer(reducerUserList, []);

  const [AdminList, dispatchAdminList] = useReducer(reducerAdminList, []);
  const [InspectorList, dispatchInspectorList] = useReducer(
    reducerInspectorList,
    []
  );
  const [TeacherList, dispatchTeacherList] = useReducer(reducerTeacherList, []);
  const [StudentList, dispatchStudentList] = useReducer(reducerStudentList, []);
  const [ClassList, dispatchClassList] = useReducer(reducerClassList, []);
  const [RoomList, dispatchRoomList] = useReducer(reducerRoomList, []);
  const [ScheduleList, dispatchScheduleList] = useReducer(
    reducerScheduleList,
    []
  );
  const [AttendanceList, dispatchAttendanceList] = useReducer(
    reducerAttendanceList,
    []
  );

  // !======================================================Function USER========================================================//

  //Admin: Get all Users.
  const getUsers = async () => {
    try {
      const process = await axios.get(`${apiUrl}/user`);
      if (process.data.success) {
        dispatchUserList({ type: "LOAD_ALL", list: process.data.users });
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  //User: Add a new User. Input: User object
  const addUser = async (user) => {
    try {
      const process = await axios.post(`${apiUrl}/user`, user);
      if (process.data.success) {
        dispatchUserList({
          type: "ADD_ONE",
          user:process.data.newUser
        });
        return process.data;
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };

  //User: Delete a specific User. Input: User id
  const deleteUser = async (userId) => {
    try {
      const process = await axios.delete(
        `${apiUrl}/user/${userId}`
      );
      if (process.data.success) {
        let a=AdminList.find(item=>item.userId===userId)
        let b=InspectorList.find(item=>item.userId===userId)
        let c=TeacherList.find(item=>item.userId===userId)
        let d=StudentList.find(item=>item.userId===userId)
        if(a){ deleteAdmin(a.id) 
          console.log(a)}
        if(b) deleteInspector(b.id)
        if(c) deleteTeacher(c.id)
        if(d) deleteStudent(d.id)

        dispatchUserList({
          type: "DELETE_ONE",
          userId,
        });
      }
      return process.data;
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };


  //User: Update a specific User. Input: User object after updated
  const updateUser = async (user) => {
    try {
      const process = await axios.put(
        `${apiUrl}/user/${user._id}`,
        user
      );
      if (process.data.success) {
        dispatchUserList({
          type: "UPDATE_ONE",
          user:process.data.UpdatedUser,
        });
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }

    
  };

  // !======================================================Function ADMIN========================================================//

  //Admin: Get all Admins.
  const getAdmins = async () => {
    try {
      const process = await axios.get(`${apiUrl}/admin`);
      if (process.data.success) {
        dispatchAdminList({ type: "LOAD_ALL", list: process.data.admins });
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  //Admin: Add a new Admin. Input: Admin object
  const addAdmin = async (admin) => {
    let User = {
      username: `USR${Math.floor(10000 * Math.random())}`,
      password: `1`,
      recovery_mail: null,
      active_day: Date().toLocaleString().slice(0, 24),
    };

    try {
      const processUser = await addUser(User);
      if (processUser) {
        admin = { ...admin, userId: processUser.newUser._id };

        const processAdmin = await axios.post(
          `${apiUrl}/admin`,
          admin
        );
        if (processAdmin.data.success) {
          dispatchAdminList({
            type: "ADD_ONE",
            admin,
          });
        }
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };


  //Admin: Update a specific Admin. Input: Admin object after updated
  const updateAdmin = async (admin) => {
    try {
      const process = await axios.put(
        `${apiUrl}/admin/${admin.id}`,
        admin
      );
      if (process.data.success) {
        dispatchAdminList({
          type: "UPDATE_ONE",
          admin,
        });
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };
  //Admin: Delete a specific Admin. Input: Admin id
  const deleteAdmin = async (admin_id) => {
   try {

        const processAdmin = await axios.delete(
          `${apiUrl}/admin/${admin_id}`
        );
        if (processAdmin.data.success) {

          dispatchAdminList({
            type: "DELETE_ONE",
            admin_id,
          });
          getUsers();
      }
    } catch (error) {
      console.log("Error: ", error.message);
      console.log("Error: ", error);

      return false;
    }
};
  // !======================================================Function INSPECTOR========================================================//
  //Inspector: Get all Inspector.
  const getInspectors = async () => {
    try {
      const process = await axios.get(`${apiUrl}/inspector`);
      if (process.data.success) {
        dispatchInspectorList({
          type: "LOAD_ALL",
          list: process.data.inspectors,
        });
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  //Inspector: Add a new Inspector. Input: Inspector object
  const addInspector = async (inspector) => {
    let User = {
      username: `USR${Math.floor(10000 * Math.random())}`,
      password: `1`,
      recovery_mail: null,
      active_day: Date().toLocaleString().slice(0, 24),
    };

    try {
      const processUser = await addUser(User);
      if (processUser) {
        inspector = { ...inspector, userId: processUser.newUser._id };

        const processInspector = await axios.post(
          `${apiUrl}/inspector`,
          inspector
        );
        if (processInspector.data.success) {
          dispatchInspectorList({
            type: "ADD_ONE",
            inspector,
          });
        }
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };
  //Inspector: Delete a specific Inspector. Input: Inspector id
  const deleteInspector = async (inspector_id) => {
    try {
          const processInspector = await axios.delete(
            `${apiUrl}/inspector/${inspector_id}`
          );
          if (processInspector.data.success) {

            dispatchInspectorList({
              type: "DELETE_ONE",
              inspector_id,
            });
            getUsers();
          }
        
      } catch (error) {
        console.log("Error: ", error.message);
        return false;
      }
  };

  //Inspector: Update a specific Inspector. Input: Inspector object after updated
  const updateInspector = async (inspector) => {
    try {
      const process = await axios.put(
        `${apiUrl}/inspector/${inspector.id}`,
        inspector
      );
      if (process.data.success) {
        dispatchInspectorList({
          type: "UPDATE_ONE",
          inspector,
        });
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };

  // !======================================================Function TEACHER========================================================//
  //Teacher: Add a new Teacher. Input: Teacher object
  //Teacher: Get all Teacher.
  const getTeachers = async () => {
    try {
      const process = await axios.get(`${apiUrl}/teacher`);
      if (process.data.success) {
        dispatchTeacherList({ type: "LOAD_ALL", list: process.data.teachers });
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  //Teacher: Add a new Teacher. Input: Teacher object
  const addTeacher = async (teacher) => {
    let User = {
      username: `USR${Math.floor(10000 * Math.random())}`,
      password: `1`,
      recovery_mail: null,
      active_day: Date().toLocaleString().slice(0, 24),
    };

    try {
      const processUser = await addUser(User);
      if (processUser) {
        teacher = { ...teacher, userId: processUser.newUser._id };

        const processTeacher = await axios.post(
          `${apiUrl}/teacher`,
          teacher
        );
        if (processTeacher.data.success) {
          dispatchTeacherList({
            type: "ADD_ONE",
            teacher,
          });
        }
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };
  //Teacher: Delete a specific Teacher. Input: Teacher id
  const deleteTeacher = async (teacher_id) => {
    try {
          const processTeacher = await axios.delete(
            `${apiUrl}/teacher/${teacher_id}`
          );
          if (processTeacher.data.success) {

            dispatchTeacherList({
              type: "DELETE_ONE",
              teacher_id,
            });
            getUsers();

          }
        
      } catch (error) {
        console.log("Error: ", error.message);
        return false;
      }
  };

  //Teacher: Update a specific Teacher. Input: Teacher object after updated
  const updateTeacher = async (teacher) => {
    try {
      const process = await axios.put(
        `${apiUrl}/teacher/${teacher.id}`,
        teacher
      );
      if (process.data.success) {
        dispatchTeacherList({
          type: "UPDATE_ONE",
          teacher,
        });
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };

  // !======================================================Function STUDENT========================================================//
  //Student: Get all Student.
  const getStudents = async () => {
    try {
      const process = await axios.get(`${apiUrl}/student`);
      if (process.data.success) {
        dispatchStudentList({ type: "LOAD_ALL", list: process.data.students });
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  //Student: Add a new student to System, update num of his class.
  const addStudent = async (student) => {
    let User = {
      username: `USR${Math.floor(10000 * Math.random())}`,
      password: `1`,
      recovery_mail: null,
      active_day: Date().toLocaleString().slice(0, 24),
    };

    try {
      const processUser = await addUser(User);
      if (processUser.success) {
        student = { ...student, userId: processUser.newUser._id };

        const processStudent = await axios.post(
          `${apiUrl}/student`,
          student
        );
        if (processStudent.data.success) {
          dispatchStudentList({
            type: "ADD_ONE",
            student,
          });

          if (student.class_)
            dispatchClassList({
              type: "UPDATE_ADD_STUDENT",
              item: student.class_,
            });
        }
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return false;
    }
  };

  //Student: Add a new student to System, update num of his class.
  const updateStudent = async (data) => {
    const predata = StudentList.find((s) => s.id === data.id)
if(!predata) {
  console.log(`Student not found!`)
  return;}
    try {
  const process = await axios.put(
    `${apiUrl}/student/update/${data.id}`,
    data
  );
  if (process.data.success) {
    dispatchStudentList({
      type: "UPDATE",
      item: data,
    })


    if (predata.class_ !== data.class_) {
      dispatchClassList({
        type: "UPDATE_ADD_STUDENT",
        item: data.class_,
      });
      dispatchClassList({
        type: "UPDATE_DELETE_STUDENT_IN",
        item: predata.class_,
      });
    }

  }

} catch (error) {
  console.log("Error: ", error.message);
}
   

  };

  //Student: Delete a student in System. Input: e (an event): Delete student in StudentList,
  const deleteStudent = async (student_id) => {
    let student = StudentList.find((a) => a.id === student_id);
    if (!student) {
      return};
    
      try {

          const processStudent = await axios.delete(
            `${apiUrl}/student/${student_id}`
          );
          if (processStudent.data.success) {
            dispatchStudentList({
              type: "DELETE_ONE",
              id:student_id,
            });
            if (student.class_)
              dispatchClassList({
                type: "UPDATE_DELETE_STUDENT_IN",
                item: student.class_,
              });
              getUsers();
          }
        
      } catch (error) {
        console.log("Error: ", error.message);
        return false;
      }
  };
  // !======================================================Function CLASS========================================================//
  //Class: Get all Class.
  const getClasses = async () => {
    try {
      const process = await axios.get(`${apiUrl}/class`);
      if (process.data.success) {
        dispatchClassList({ type: "LOAD_ALL", list: process.data.classes });
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  //Class: Delete a class with input: id
  const deleteClass = async (class_id) => {

    try {
      const process=await axios.delete(`${apiUrl}/class/${class_id}`);
      if(process.data.success){
        dispatchClassList({
          type: "DELETE",
          id: class_id,
        });

      const studentProcess=  await axios.put(`${apiUrl}/student/removeclass/${class_id}`)
      if(studentProcess.data.success){
        dispatchStudentList({
          //reset class property of all student in that class into NULL
          type: "UPDATE_DELETE_ALL_STUDENT_IN",
          id: class_id,
        });
      }
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }

    ScheduleList.forEach((s) => {
      if (s.class === class_id) {

        deleteOneSchedule(s.id);
      }
    });
  };

  //Class: Add a new class with input: {data}
  const addClass = async (data) => {
    try {
      console.log(data)
      const process=await axios.post(`${apiUrl}/class`,data)
      if(process.data.success){
        dispatchClassList({
          type: "ADD",
          item: data,
        });
      }
    } catch (error) {
      console.log(error)
    }
   
  };

  //Class: Update a new class with input: {data} (replacing)
  const updateClass = async (data) => {
 try {
  const process=await axios.put(`${apiUrl}/class/update/${data.id}`,data)
  if(process.data.success){
    dispatchClassList({
      type: "UPDATE",
      item: data,
    });
  }
 } catch (error) {
  console.log(error)
  console.log(error)
 }
  
  };

  //Class: When adding a new student into a class, update class property of that student{}, update num property of classes{}
  const addStudentIn = async (class_id, student_id) => {
   try {
    console.log(class_id, student_id)
    const stu = StudentList.find((s) => s.id === student_id);
    if (stu) {
      //   if (ClassList.find((s) => s.id === stu.class_)) {
          
      //     const classRemoveProcess= await axios.put(`${apiUrl}/class/decrease/${stu.class_}`)
      //     if(classRemoveProcess.data.sucess)
      //     dispatchClassList({
      //       type: "UPDATE_DELETE_STUDENT_IN",
      //       item: stu.class_,
      //     });
      //   }
      // }
      // if(stu.class_!==class_id){
      //   const classAddProcess= await axios.put(`${apiUrl}/class/increase/${class_id}`)
      //     if(classAddProcess.data.sucess)
      //     dispatchClassList({
      //       type: "UPDATE_ADD_STUDENT",
      //       item: class_id,
      //     });
      // }
      const studentUpdateProcess= await axios.put(`${apiUrl}/student/update/${student_id}`,{class_:class_id})
          if(studentUpdateProcess.data.sucess)
          dispatchStudentList({
            type: "UPDATE_ADD_STUDENT_IN",
            class_id,
            student_id,
          });
          }
   } catch (error) {
    console.log(error)
    console.log(error)
   }
   
  };

  //Class+Student: When delete a student out of a class, update his class property into NULL, set class num decreases by 1
  const deleteOneStudentIn = async (class_id, stu_id) => {

    try {
      const studentRemoveProcess= await axios.put(`${apiUrl}/student/removeclass/${stu_id}`)
      if(studentRemoveProcess.data.sucess)
      dispatchStudentList({
        //update class property of deleted student into NULL
        type: "UPDATE_DELETE_STUDENT_IN",
        id: stu_id,
      });
  
      // const classRemoveProcess= await axios.put(`${apiUrl}/class/decrease/${class_id}`)
      // if(classRemoveProcess.data.sucess)
      // dispatchClassList({
      //   type: "UPDATE_DELETE_STUDENT_IN",
      //   item: class_id,
      // });
    } catch (error) {
      console.log(error)
      console.log(error)
    }
  

  };

  // !======================================================Function ROOM========================================================//
   //Room: Get all Room.
   const getRooms = async () => {
    try {
      const process = await axios.get(`${apiUrl}/room`);
      if (process.data.success) {
        dispatchRoomList({ type: "LOAD_ALL", list: process.data.rooms });
      }
    } catch (error) {
      console.log(error);
      console.log(error)
    }
  };
  
  //Room: Add a new room. Input: room object
  const addRoom = async (room) => {
    try {
      console.log(room)
      const process=await axios.post(`${apiUrl}/room`,room)
      if(process.data.success){
        dispatchRoomList({
          type: "ADD_ONE",
          room,
        });
      }
    } catch (error) {
      console.log(error)
      console.log(error)
    }
   
  };

  //Room: Update a specific room. Input: room object after updated
  const updateRoom = async (room) => {
    try {
      const process = await axios.put(
        `${apiUrl}/room/${room.id}`,
        room
      );
      if (process.data.success) {
        dispatchRoomList({
          type: "UPDATE_ONE",
          room,
        });
      }
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  };

  //Room: Delete a specific room. Input: room id
  const deleteRoom = async (room_id) => {
    try {
      const process = await axios.delete(
        `${apiUrl}/room/${room_id}`
      );
      if (process.data.success) {
        dispatchRoomList({
          type: "DELETE_ONE",
          room_id,
        });
      }
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  };
  
  // !======================================================Function SCHEDULE========================================================//
   //Schedule: Get all Schedule.
   const getSchedules = async () => {
    try {
      const process = await axios.get(`${apiUrl}/schedule`);
      if (process.data.success) {
        dispatchScheduleList({ type: "LOAD_ALL", list: process.data.schedules });
      }
    } catch (error) {
      console.log(error);
      console.log(error)
    }
  };

  //Schedule: Add a new day schedule
 const addOneSchedule = async (schedule) => {
    try {

      const process=await axios.post(`${apiUrl}/schedule`,schedule)
      if(process.data.success){
        dispatchScheduleList({
          type: "ADD_ONE",
          item: process.data.schedule,
        });
      }
    } catch (error) {
      console.log(error)
      console.log(error)
    }
   
  };

    //Schedule: Update a specific schedule. Input: schedule object after updated
    const updateSchedule = async (schedule) => {
      try {
        const process = await axios.put(
          `${apiUrl}/schedule/${schedule.id}`,
          schedule
        );
        if (process.data.success) {
          dispatchScheduleList({
            type: "UPDATE_ONE",
            schedule,
          });
        }
      } catch (error) {
        console.log(error);
        console.log(error);
      }
    };
    
  //Schedule: Delete a schedule
  const deleteOneSchedule = async (id_schedule) => {

    try {
      const process = await axios.delete(
        `${apiUrl}/schedule/${id_schedule}`
      );
      if (process.data.success) {
        dispatchScheduleList({
          type: "DELETE_ONE",
          id:id_schedule,
        });
        AttendanceList.forEach((a) => {
          if (a.id_schedule === id_schedule) {
            deleteAttendance(a.id);
          }
        });

        AttendanceList.forEach(a=>{
          if(a.id_schedule===id_schedule) 
          deleteAttendance(a.id)
        })
      }
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  };


  // !======================================================Function ATTENDANCE========================================================//
    //Attendance: Get all Attendance.
    const getAttendances = async () => {
      try {
        const process = await axios.get(`${apiUrl}/attendance`);
        if (process.data.success) {
          dispatchAttendanceList({ type: "LOAD_ALL", list: process.data.attendances });
        }
      } catch (error) {
        console.log(error);
        console.log(error)
      }
    };
  
  //Attendance: Add a new Attendance. Input: Attendance object
  const addOneAttendance = async (attendance) => {
    if (
      AttendanceList.find(
        (a) =>
          a.id_target === attendance.id_target &&
          a.id_schedule === attendance.id_schedule
      )
    ) {
      console.log(
        "Đối tượng đã có điểm danh tại thời khóa biểu này. Vui lòng không tạo lại!"
      );
    } else
      {
        try {
          const process=await axios.post(`${apiUrl}/attendance`,attendance)
          if(process.data.success){
            dispatchAttendanceList({
              type: "ADD_ONE",
              item: attendance,
            });
          }
        } catch (error) {
          console.log(error)
          console.log(error)
        }
      }
  };  

  //Attendance: Delete a specific Attendance. Input: Attendance id
  const deleteAttendance = async (attendance) => {
    try {
      const process = await axios.delete(
        `${apiUrl}/attendance/${attendance}`
      );
      if (process.data.success) {
        dispatchAttendanceList({
          type: "DELETE_ONE",
          id:attendance,
        });
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Attendance: Update a specific Attendance. Input: Attendance object after updated
  const updateAttendance = async (attendance) => {
    try {
      const process = await axios.put(
        `${apiUrl}/attendance/${attendance.id}`,
        attendance
      );
      if (process.data.success) {
        dispatchAttendanceList({
          type: "UPDATE_ONE",
          attendance,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    getAdmins();
    getInspectors();
    getTeachers();
    getClasses();
    getRooms();
    getSchedules();
    getAttendances();
  }, []);


  useEffect(()=>{
    getStudents();
  },[
    // ()=>addStudentIn(),()=>deleteOneStudentIn()
  ])

  // *======================================================// Context data, function provider//========================================================//
  const GeneralData = {
    ClassList,
    deleteClass,
    addClass,
    updateClass,
    addStudentIn,
    deleteOneStudentIn,

    StudentList,
    deleteStudent,
    addStudent,
    updateStudent,

    ScheduleList,
    addOneSchedule,
    deleteOneSchedule,

    RoomList,
    addRoom,
    deleteRoom,
    updateRoom,

    InspectorList,
    addInspector,
    deleteInspector,
    updateInspector,

    TeacherList,
    addTeacher,
    deleteTeacher,
    updateTeacher,

    AdminList,
    addAdmin,
    deleteAdmin,
    updateAdmin,

    AttendanceList,
    addOneAttendance,
    updateAttendance,
    deleteAttendance,

    UserList,
    addUser,
    updateUser,
    deleteUser,
  };

  return (
    <DataContext.Provider value={GeneralData}>{children}</DataContext.Provider>
  );
};

export default DataContextProvider;
