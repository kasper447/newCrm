import React from "react";

import UpcomingBirthdays from "../../../Pages/AddEmployee/UpcomingBirthdays";
import HrCharts from "../Chart/TaskChart";
import DepartmentChart from "../Chart/DepartmentChart";
import HolidayList from "../../../Pages/LeaveCalendar/HolidayList";
import NoticeBadge from "../../../img/NoticeBadge.svg";
import NoticeBoard from "../Notification/NoticeBoard";
import TaskChart from "./Chart/TaskChart";
import LeaveCount from "./CountData/LeavesCount";
import EmplolyeeCount from "./CountData/EmployeeCount";
import TodatAttendance from "../../../Pages/Chart/DailyAttendChart";
import { MdCreateNewFolder } from "react-icons/md";
import "./ManagerDash.css";

const ManagerDash = () => {
  return (
    <div className="hrdashgrid-container container-fluid py-3">
      <div className="hrdashgrid dash-1">
        <EmplolyeeCount />
      </div>
      <div className="hrdashgrid dash-3">
        <LeaveCount />
      </div>
      <div className="hrdashgrid dash-7 px-3">
        <TodatAttendance />
      </div>
      <div className="hrdashgrid dash-5 px-3">
        <DepartmentChart />
      </div>
      <div className="hrdashgrid dash-4 px-3">
        <TaskChart />
      </div>
      <div className="hrdashgrid dash-2">
        <NoticeBoard />
      </div>
      <div className="hrdashgrid dash-6">
        <HolidayList
          title={"Holiday List"}
          newFolderLink={"/hr/holiday"}
          holidayIcons={<MdCreateNewFolder />}
        />
      </div>
      <div className="hrdashgrid dash-8">
        <UpcomingBirthdays />
      </div>
    </div>
    // <div className="hrdashgrid-container container-fluid py-3">
    //   <div className="hrdashgrid dash-1"></div>
    //   <div className="hrdashgrid dash-3"></div>
    //   <div className="hrdashgrid dash-7 px-3">
    //     <TaskChart />
    //   </div>
    //   <div className="hrdashgrid dash-5 px-3">
    //     {" "}
    //     <DepartmentChart />
    //   </div>
    //   <div className="hrdashgrid dash-4 px-3"> </div>
    //   <div className="hrdashgrid dash-2">
    //     <NoticeBoard />
    //   </div>
    //   <div className="hrdashgrid dash-6">
    //     {" "}
    //     <HolidayList title={"Holiday List"} />
    //   </div>
    //   <div className="hrdashgrid dash-8">
    //     <UpcomingBirthdays />
    //   </div>
    // </div>
  );
};

export default ManagerDash;
