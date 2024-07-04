import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdMenuOpen, MdTaskAlt } from "react-icons/md";
import {
  FaCalendarCheck,
  FaMale,
  FaTasks,
  FaUniversity,
  FaUserCircle
} from "react-icons/fa";
import { TbDeviceIpadMinus } from "react-icons/tb";
import { FaBriefcase, FaFolderOpen, FaUser } from "react-icons/fa6";
import {
  BsCalendar2,
  BsCalendar2CheckFill,
  BsDeviceHddFill,
  BsFillCalendarEventFill
} from "react-icons/bs";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { RiTaskFill } from "react-icons/ri";

const Sidebar = (props) => {
  const [extended, setExtended] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { darkMode } = useTheme();

  const ExtendClick = () => {
    setExtended(!extended);
  };
  const allLinks = [
    {
      icon: <FaUser />,
      name: "Dashboard",
      navLinks: [{ to: "/employee/dashboard", label: "Dashboard" }]
    },
    {
      icon: <FaUserCircle />,
      name: "Profile",
      navLinks: [
        {
          to: "/employee/" + props.data["_id"] + "/personal-info",
          label: "Profile"
        }
      ]
    },

    {
      icon: <FaUniversity />,
      name: "Info",
      navLinks: [
        {
          to: "/employee/" + props.data["_id"] + "/family-info",
          label: "Dependents"
        },
        {
          to: "/employee/" + props.data["_id"] + "/education",
          label: "Education"
        },
        {
          to: "/employee/" + props.data["_id"] + "/work-experience",
          label: "WorkExp"
        }
      ]
    },
    {
      icon: <BsCalendar2CheckFill />,
      name: "Attendance",
      navLinks: [
        {
          to: "/employee/" + props.data["_id"] + "/attendance",
          label: "Create Attendance"
        }
        // {
        //   to: "/employee/" + props.data["_id"] + "/attendanceList",
        //   label: "View Attendance"
        // },
        // {
        //   to: "/employee/" + props.data["_id"] + "/selfAtteend",
        //   label: "self Attendance"
        // }
      ]
    },
    {
      icon: <BsFillCalendarEventFill />,
      name: "Leave",
      navLinks: [
        {
          to: "/employee/leaveApplication",
          label: "Apply Leave"
        },
        {
          to: "/employee/leaveBalance",
          label: "Leave Balance"
        }
      ]
    },
    {
      icon: <FaTasks />,
      name: "Task",
      navLinks: [
        { to: "/employee/newTask", label: " New Task" },
        { to: "/employee/activeTask", label: "Active Task" },
        { to: "/employee/taskcomplete", label: "Completed Task" },
        { to: "/employee/taskreject", label: "Rejected Task" }
      ]
    },
    {
      icon: <FaFolderOpen />,
      name: "Documents",
      navLinks: [
        {
          to: "/employee/Document",
          label: "Document"
        }
      ]
    }
  ];
  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
        overflow: "inherit",
        width: "fit-content",
        borderRight: "1px solid rgba(90, 88, 88, 0.1)",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)"
      }}
      className="d-none d-sm-flex flex-column gap-2 p-2"
    >
      <h3
        style={{ borderBottom: "3px solid green" }}
        className="text-success justify-content-between py-2 d-flex gap-2"
      >
        <p
          style={{ display: !extended ? "none" : "block" }}
          className="my-auto fs-4"
        >
          EMP
        </p>{" "}
        <span
          onClick={ExtendClick}
          style={{
            border: "none",
            outline: "none",
            cursor: "pointer",
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            transform: `rotate(${!extended ? "180deg" : "0deg"})`
          }}
          className="my-auto p-0 fs-4"
        >
          <MdMenuOpen />
        </span>
      </h3>

      {allLinks.map(({ icon, name, navLinks }) => (
        <div
          key={name}
          onMouseEnter={() => setActiveCategory(name)}
          onMouseLeave={() => setActiveCategory(null)}
          className="position-relative"
        >
          {navLinks.length > 1 ? (
            <span
              style={{
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
                height: "3rem",
                outline: "none",
                border: "none"
              }}
              className="p-0 text-start gap-2 justify-between w-100 d-flex justify-content-between"
            >
              <div
                style={{ width: "fit-content" }}
                className="d-flex gap-2 my-auto"
              >
                <p
                  style={{
                    height: "30px",
                    width: "30px",
                    alignItems: "center",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)"
                  }}
                  className="m-auto d-flex rounded-5 justify-content-center fs-5"
                >
                  {icon}
                </p>
                <p
                  style={{ display: !extended ? "none" : "block" }}
                  className="my-auto"
                >
                  {name}
                </p>
              </div>
              <span
                style={{
                  transform: `rotate(${
                    activeCategory === name ? "135deg" : "0deg"
                  })`,
                  transition: "1s ease",
                  display: !extended ? "none" : "block"
                }}
                className="my-auto fs-4"
              >
                +
              </span>
            </span>
          ) : (
            <OverlayTrigger
              placement="right"
              overlay={
                !extended ? (
                  <Tooltip id={`tooltip-${name}`}>{name}</Tooltip>
                ) : (
                  <span></span>
                )
              }
            >
              <NavLink to={navLinks[0].to} className="text-decoration-none">
                <span
                  style={{
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    height: "3rem",
                    outline: "none",
                    border: "none"
                  }}
                  className="p-0 text-start gap-2 justify-between w-100 d-flex justify-content-between"
                >
                  <div
                    style={{ width: "fit-content" }}
                    className="d-flex gap-2 my-auto"
                  >
                    <p
                      style={{
                        height: "30px",
                        width: "30px",
                        alignItems: "center",
                        color: darkMode
                          ? "var(--primaryDashColorDark)"
                          : "var(--primaryDashMenuColor)"
                      }}
                      className="m-auto d-flex rounded-5 justify-content-center fs-5"
                    >
                      {icon}
                    </p>
                    <p
                      style={{ display: !extended ? "none" : "block" }}
                      className="my-auto"
                    >
                      {name}
                    </p>
                  </div>
                </span>
              </NavLink>
            </OverlayTrigger>
          )}

          {navLinks.length > 1 && (
            <div
              style={{
                ...dropdownStyle,
                display: activeCategory === name ? "flex" : "none",
                backgroundColor: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                width: "fit-content"
              }}
              className="flex-column position-absolute top-0 start-100 py-2 px-1 gap-2 mt-2 shadow-sm"
            >
              <p
                style={{
                  display: extended ? "none" : "block",
                  color: darkMode ? "green" : "orange"
                }}
                className="m-0 py-0 pl-1 fw-bold"
              >
                {name}
              </p>
              {navLinks.map((link) => (
                <NavLink
                  className="text-decoration-none pl-1"
                  key={link.to}
                  to={link.to}
                >
                  <div
                    style={{
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)"
                    }}
                    className="text-decoration-none flex-nowrap text-start gap-3 d-flex justify-content-between "
                  >
                    <div className="d-flex gap-1 flex-nowrap">
                      <p style={{ whiteSpace: "pre" }} className="m-auto">
                        {link.label}
                      </p>
                    </div>
                    <span className="my-auto ">›</span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const dropdownStyle = {
  width: "250px",
  zIndex: "5",
  borderLeft: "1px solid white"
};

export default Sidebar;
