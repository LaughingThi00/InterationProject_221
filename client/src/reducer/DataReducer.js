

export const reducerUserList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;
    case "ADD_ONE":
      const User_AO = [...state, action.user];
      return User_AO;

    case "DELETE_ONE":
      state = state.filter((r) => r._id !== action.userId);
      return state;

    case "UPDATE_ONE":
      const User_UO = state.map((r) => {
        if (r._id === action.user._id) {
          r.username = action.user.username ? action.user.username : r.username;
          r.password = action.user.password ? action.user.password : r.password;
          r.recovery_mail = action.user.recovery_mail
            ? action.user.recovery_mail
            : r.recovery_mail;
          r.active_day = action.user.active_day
            ? action.user.active_day
            : r.active_day;
        }
        return r;
      });
      return User_UO;
    
   
    default:
      return state;
  }
};

export const reducerAdminList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;
    case "ADD_ONE":
      return [...state, action.admin];

    case "DELETE_ONE":
      state = state.filter((r) => r.id !== action.admin_id);
      return state;

    case "UPDATE_ONE":
      const Admin_UO = state.map((r) => {
        if (r.id === action.admin.id) {
          r.name = action.admin.name ? action.admin.name : r.name;
          r.gender = action.admin.gender ? action.admin.gender : r.gender;
          r.birth = action.admin.birth ? action.admin.birth : r.birth;
          r.phone = action.admin.phone ? action.admin.phone : r.phone;
          r.email = action.admin.email ? action.admin.email : r.email;
          r.description = action.admin.description
            ? action.admin.description
            : r.description;
        }
        return r;
      });
      return Admin_UO;

    default:
      return state;
  }
};

export const reducerInspectorList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;
    case "ADD_ONE":
      const Inspector_AO = [...state, action.inspector];
      return Inspector_AO;

    case "DELETE_ONE":
      return state.filter((r) => r.id !== action.inspector_id);
      

    case "UPDATE_ONE":
      const Inspector_UO = state.map((r) => {
        if (r.id === action.inspector.id) {
          r.name = action.inspector.name ? action.inspector.name : r.name;
          r.gender = action.inspector.gender
            ? action.inspector.gender
            : r.gender;
          r.birth = action.inspector.birth ? action.inspector.birth : r.birth;
          r.phone = action.inspector.phone ? action.inspector.phone : r.phone;
          r.email = action.inspector.email ? action.inspector.email : r.email;
          r.description = action.inspector.description
            ? action.inspector.description
            : r.description;
        }
        return r;
      });
      return Inspector_UO;

    default:
      return state;
  }
};

export const reducerTeacherList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;
    case "ADD_ONE":
      const Teacher_AO = [...state, action.teacher];
      return Teacher_AO;

    case "DELETE_ONE":
      state = state.filter((r) => r.id !== action.teacher_id);
      return state;

    case "UPDATE_ONE":
      const Teacher_UO = state.map((r) => {
        if (r.id === action.teacher.id) {
          r.name = action.teacher.name ? action.teacher.name : r.name;
          r.gender = action.teacher.gender ? action.teacher.gender : r.gender;
          r.birth = action.teacher.birth ? action.teacher.birth : r.birth;
          r.phone = action.teacher.phone ? action.teacher.phone : r.phone;
          r.email = action.teacher.email ? action.teacher.email : r.email;
          r.description = action.teacher.description
            ? action.teacher.description
            : r.description;
        }
        return r;
      });
      return Teacher_UO;

    default:
      return state;
  }
};

export const reducerStudentList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;

    case "ADD_ONE":
      const Student_AO = [...state, action.student];
      return Student_AO;

    case "UPDATE":
      const student_update = state.map((s) => {
        if (s.id === action.item.id) {
          s.name = action.item.name ? action.item.name : s.name;
          s.email = action.item.email ? action.item.email : s.email;
          s.gender = action.item.gender ? action.item.gender : s.gender;
          s.birth = action.item.birth ? action.item.birth : s.birth;
          s.phone = action.item.phone ? action.item.phone : s.phone;
          s.description = action.item.description
            ? action.item.description
            : s.description;
          s.class_ = action.item.class_ ? action.item.class_ : s.class_;
        }
        return s;
      });

      return student_update;

    case "UPDATE_ADD_STUDENT_IN":
      const student_uasi = state.map((std) => {
        if (std.id === action.student_id)
          std.class_ = action.class_id;
        return std;
      });
      return student_uasi;

    case "UPDATE_DELETE_ALL_STUDENT_IN":
      const student_udasi = state.map((s) => {
        if (s.class_)
          if (s.class_ === action.id) {
            s.class_ = null;
          }
        return s;
      });
      return student_udasi;

    case "UPDATE_DELETE_STUDENT_IN":
      state.find((k) => k.id === action.id).class_ = null;
      return state;

    case "DELETE_ONE":
      state=state.filter((s) => s.id !== action.id);
      return state;
    
      default:
      return state;
  }
};

export const reducerClassList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;
    case "ADD": //Add a new class to ClassList with new object
      const class_add = [
        ...state,
        action.item
      ];
      return class_add;

    case "DELETE": //Delete a specific class in ClassList with id
      const class_d = state.filter((s) => s.id !== action.id);
      return class_d;

    case "UPDATE": //Class: Update a specific class by replacing it with new object
      const class_update = state.map((s) => {
        if (s.id === action.item.id) {
          s.name = action.item.name ? action.item.name : s.name;
          s.teacher = action.item.teacher ? action.item.teacher : s.teacher;
          s.inspector = action.item.inspector
            ? action.item.inspector
            : s.inspector;
          s.description = action.item.description
            ? action.item.description
            : s.description;
        }
        return s;
      });
      return class_update;

    // case "UPDATE_ADD_STUDENT": //Class: Update a class you have just added a student to, increases num by 1
    //   if (action.item) {
    //     ++state.find((e) => e.id === action.item).num;
    //   }
    //   return state;
      
    // case "UPDATE_DELETE_STUDENT_IN": //Class: Update a class you have just removed a student in, decreases num by 1
    //   if (action.item) {
    //     if (state.find((e) => e.id === action.item))
    //       --state.find((e) => e.id === action.item).num;
    //   }
    //   return state;

    default:
      return state;
  }
};

export const reducerRoomList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;
    case "ADD_ONE":
      const room_AO = [...state, action.room];
      return room_AO;

    case "DELETE_ONE":
      state = state.filter((r) => r.id !== action.room_id);
      return state;

    case "UPDATE_ONE":
      const room_UO = state.map((r) => {
        if (r.id === action.room.id) {
          r.name = action.room.name ? action.room.name : r.name;
          r.type = action.room.type ? action.room.type : r.type;
          r.state = action.room.state ? action.room.state : r.state;
          r.description = action.room.description
            ? action.room.description
            : r.description;
        }
        return r;
      });
      return room_UO;

    default:
      return state;
  }
};

export const reducerScheduleList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;
    case "ADD_ONE":
      const schedule_AO = [...state, action.item];
      return schedule_AO;

    case "DELETE_ONE":
      state = state.filter((s) => s.id !== action.id);
      return state;

    case "UPDATE_ONE":
      const schedule_UO = state.map((r) => {
        if (r.id === action.schedule.id) {
          r.date = action.schedule.date ? action.schedule.date : r.date;
          r.starttime = action.schedule.starttime
            ? action.schedule.starttime
            : r.starttime;
          r.endtime = action.schedule.endtime
            ? action.schedule.endtime
            : r.endtime;
          r.class_ = action.schedule.class_ ? action.schedule.class_ : r.class_;
          r.room = action.schedule.room ? action.schedule.room : r.room;
          r.description = action.schedule.description
            ? action.schedule.description
            : r.description;
        }
        return r;
      });
      return schedule_UO;

    default:
      return state;
  }
};

export const reducerAttendanceList = (state, action) => {
  switch (action.type) {
    case "LOAD_ALL":
      return action.list;
    case "ADD_ONE":
      const att_AO = [...state, action.item];
      return att_AO;

    case "DELETE_ONE":
      state = state.filter((s) => s.id !== action.id);
      return state;

    case "UPDATE_ONE":
      const Attendance_UO = state.map((a) => {
        if (a.id === action.attendance.id) {
          a.datetime_update = action.attendance.datetime_update
            ? action.attendance.datetime_update
            : a.datetime_update;
          a.debt_schedule = action.attendance.debt_schedule
            ? action.attendance.debt_schedule
            : a.debt_schedule;
          a.id_last_editor = action.attendance.id_last_editor
            ? action.attendance.id_last_editor
            : a.id_last_editor;
          a.id_schedule = action.attendance.id_schedule
            ? action.attendance.id_schedule
            : a.id_schedule;
          a.id_target = action.attendance.id_target
            ? action.attendance.id_target
            : a.id_target;
          a.isSelfCheck = action.attendance.isSelfCheck
            ? action.attendance.isSelfCheck
            : a.isSelfCheck;
          a.prenum = action.attendance.prenum
            ? action.attendance.prenum
            : a.prenum;
          a.type = action.attendance.type ? action.attendance.type : a.type;
          a.notice = action.attendance.notice
            ? action.attendance.notice
            : a.notice;
        }
        return a;
      });
      return Attendance_UO;

    default:
      return state;
  }
};
