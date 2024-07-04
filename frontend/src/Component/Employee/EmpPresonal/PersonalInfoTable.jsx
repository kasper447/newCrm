import React, { useEffect, useState } from "react";
import "./PersonalInfoTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import "./profilePage.css";
import {
  FaCamera,
  FaFileAudio,
  FaFileImage,
  FaRegFileImage,
  FaRegFilePdf
} from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import FloralAbstract from "./FloralAbstract.jpg";
import { GoDotFill } from "react-icons/go";
import { IoArrowBackCircle, IoEye } from "react-icons/io5";
import Education from "../EmpEducation/Education";
import WorkExperience from "../EmpWorkExp/WorkExperience";
import Document from "../Document/Document.jsx";
import FamilyInfo from "../EmpFamily/FamilyInfo";
import BASE_URL from "../../../Pages/config/config.js";
import InnerDashContainer from "../../InnerDashContainer.jsx";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const PersonalInfoTable = (props) => {
  const location = useLocation().pathname.split("/")[2];

  const [personalInfoData, setPersonalInfoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [showDownloadbtn, setShowDownloadbtn] = useState(null);
  const [visibleDocs, setVisibleDocs] = useState([]);

  const id =
    location === "employee" ? props.data["_id"] : localStorage.getItem("_id");
  const loadPersonalInfoData = () => {
    axios
      .get(`${BASE_URL}/api/personal-info/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        const data = response.data;
        setPersonalInfoData(data);
        setLoading(false);

        const temp = {
          data,
          FirstName: data["FirstName"] || "Not Avaiable",
          MiddleName: data["MiddleName"] || "Not Avaiable",
          LastName: data["LastName"] || "Not Avaiable",
          empID: data["empID"] || "Not Avaiable",
          Gender: data["Gender"] || "Not Avaiable",
          ContactNo: data["ContactNo"] || "Not Avaiable",
          Email: data["Email"] || "Not Avaiable",
          PANcardNo: data["PANcardNo"] || "Not Avaiable",
          DOB: data["DOB"].slice(0, 10) || "Not Avaiable",
          BloodGroup: data["BloodGroup"] || "Not Avaiable",
          EmergencyContactNo: data["EmergencyContactNo"] || "Not Avaiable",
          presonalEmail: data["presonalEmail"] || "Not Avaiable",
          Hobbies: data["Hobbies"] || "Not Avaiable",
          PresentAddress: data["PresentAddress"] || "Not Avaiable",
          PermanetAddress: data["PermanetAddress"] || "Not Avaiable",
          RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
          DateOfJoining: data["DateOfJoining"].slice(0, 10),
          reportManager: data["reportManager"] || "Not Available", // Check if this value exists
          reportHr: data["reportHr"] || "Not Avaiable", // Corrected here
          DepartmentName: data["department"][0]
            ? data["department"][0]["DepartmentName"]
            : "",
          Account:
            data["Account"] === 1
              ? "Admin"
              : data["Account"] === 2
                ? "HR"
                : data["Account"] === 3
                  ? "Employee"
                  : data["Account"] === 4
                    ? "Manager"
                    : "",
          PositionName: data["position"][0]
            ? data["position"][0]["PositionName"]
            : ""
        };

        console.log(temp);
        setRowData([temp]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadPersonalInfoData();
  }, [props.data]);

  const onToggleSection = (section) => {
    setActiveSection(section);
  };

  const onPersonalInfoDelete = (e) => {
    console.log(e);
    if (window.confirm("Are you sure to delete this record? ")) {
      axios
        .delete(`${BASE_URL}/api/personalInfo/${e}`, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then(() => {
          loadPersonalInfoData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const renderEditButton = (params) => {
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditPersonalInfo(params.data.data)}
      />
    );
  };
  const getBackgroundColor = (accountType) => {
    switch (accountType) {
      case "Admin":
        return "#8EAC50";
      case "HR":
        return "#0079FF";
      case "Employee":
        return "purple";
      default:
        return "#FF9B50";
    }
  };

  // task data
  const [tasks, setTasks] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/personal-info/${id}`,
          {
            headers: {
              authorization: localStorage.getItem("token") || ""
            }
          }
        );
        setEmail(response.data.Email);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, []);

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      // If remaining time is negative, consider it as delay
      remainingTime = Math.abs(remainingTime);
      return { delay: true, days: 0, hours: 0, minutes: 0 };
    } else {
      // Calculate remaining days, hours, minutes, and seconds
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      return { delay: false, days, hours, minutes };
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(fetchData, 60000);
    }
  };

  useEffect(() => {
    fetchData();

    return () => clearTimeout();
  }, []);

  // Count of different task statuses for the current employee
  const acceptedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Accepted"
    )
  ).length;

  const rejectedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Rejected"
    )
  ).length;

  const completedTasksCount = tasks.filter(
    (task) =>
      task.status === "Pending" &&
      task.employees.some((emp) => emp.emptaskStatus === "Completed")
  ).length;

  const pendingTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) => taskemp.empemail === email && task.status === "Pending"
    )
  ).length;

  const assignedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Task Assigned"
    )
  ).length;

  const acceptedTasksNotCompletedOnTimeCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Accepted" &&
        calculateRemainingTime(task.endDate).delay
    )
  ).length;

  const completedTasksOnTimeCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Completed" &&
        !calculateRemainingTime(task.endDate).delay
    )
  ).length;

  const lateCompletedAcceptedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Accepted" &&
        calculateRemainingTime(task.endDate).delay
    )
  ).length;

  const lateCompletedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Completed" &&
        calculateRemainingTime(task.endDate).delay
    )
  ).length;

  return (
    <div style={{ height: '95vh', overflow: 'auto' }} className="p-0 m-0 container-fluid">
      <div id="clear-both" />
      {!loading ? (
        <div style={{ position: "relative" }} className="row">
          <div
            style={{
              height: "35rem",
            }}
            className="col-12 row mx-auto justify-content-center gap-3 w-100"
          >
            <Link to="/hr/employee">
              <button
                className="btn fw-bold d-flex gap-3 "
                style={{ background: "white", color: "black" }}
                id="add-button"
              >
                <IoArrowBackCircle className="my-auto fs-5" />{" "}
                <span my-auto>Back</span>
              </button>
            </Link>
            <div
              style={{
                height: "33rem",
                background: `url(${FloralAbstract})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                overflow: "hidden"
              }}
              className="col-12 m-0 p-0 rounded-3 col-lg-3 bg-white shadow"
            >
              {rowData.map((items, index) => {
                return (
                  <div
                    style={{
                      backgroundColor: "rgba(258,258,258,.95)",
                      position: "relative"
                    }}
                    className="d-flex flex-column gap-3 py-2 h-100"
                    key={index}
                  >
                    <div
                      className="d-flex flex-column gap-2"
                      style={{ width: "100%", padding: "1rem 1rem" }}
                    >
                      <div
                        className="mx-auto"
                        style={{
                          height: "120px",
                          width: "120px",
                          border: "6px solid #39A7FF",
                          borderRadius: "50%",
                          position: "relative"
                        }}
                      >
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: "50%",
                            objectFit: "cover"
                          }}
                          src={
                            items?.data?.profile?.image_url
                              ? items?.data?.profile?.image_url
                              : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                          }
                          alt="employee"
                        />
                        <button
                          style={{
                            height: "30px",
                            width: "30px",
                            borderRadius: "50%",
                            border: "3px solid white",
                            position: "absolute",
                            bottom: "0",
                            right: "0"
                          }}
                          className="btn btn-primary text-white d-flex p-1 "
                        >
                          <FaCamera className="m-auto" />
                        </button>
                      </div>
                      <p
                        style={{ position: "absolute", top: "0", left: "0" }}
                        className="btn btn-success px-2 py-0 m-2 rounded-5 fw-bold shadow"
                      >
                        {items.empID}
                      </p>
                      {/* <p className="m-auto fw-bold fs-6">{items.empID}</p> */}
                      <h3 className="text-capitalize my-0 fw-bold text-muted text-center">
                        {items.FirstName} {personalInfoData.LastName}
                      </h3>
                      <p className="text-capitalize my-0 fw-bold text-center">
                        {items.RoleName}
                      </p>
                    </div>
                    <div className="d-flex flex-column justify-content-between gap-2">
                      <div className="p-2 fw-bold mx-3 d-flex bg-white justify-content-between shadow rounded-5">
                        <span
                          style={{ alignItems: "center" }}
                          className="my-auto d-flex gap-2 "
                        >
                          <GoDotFill className="text-primary fs-4" />
                          Total Assigned Task
                        </span>{" "}
                        <span className="fw-bold  text-primary my-auto">
                          {pendingTasksCount}
                        </span>
                      </div>
                      <div className="p-2 fw-bold mx-3 d-flex bg-white justify-content-between shadow rounded-5">
                        <span
                          style={{ alignItems: "center" }}
                          className="my-auto d-flex gap-2 "
                        >
                          <GoDotFill className="text-warning fs-4" />
                          Total Active Task
                        </span>{" "}
                        <span className="fw-bold text-warning my-auto">
                          {acceptedTasksCount}
                        </span>
                      </div>
                      <div className="p-2 fw-bold mx-3 d-flex  bg-white justify-content-between shadow rounded-5">
                        <span
                          style={{ alignItems: "center" }}
                          className="my-auto d-flex gap-2 "
                        >
                          {" "}
                          <GoDotFill className="text-danger fs-4" />
                          Total Rejected Task
                        </span>{" "}
                        <span className="fw-bold my-auto text-danger">
                          {rejectedTasksCount}
                        </span>
                      </div>
                      <div className="p-2 fw-bold  bg-white mx-3 d-flex justify-content-between shadow rounded-5">
                        <span
                          style={{ alignItems: "center" }}
                          className="my-auto d-flex gap-2 "
                        >
                          <GoDotFill className="text-success fs-4" />
                          Total Completed Task
                        </span>{" "}
                        <span className="fw-bold my-auto text-success">
                          {completedTasksCount}
                        </span>
                      </div>
                    </div>
                    <span
                      onClick={() => props.onEditPersonalInfo(items.data)}
                      style={{
                        borderBottom:
                          activeSection === "documentDetails"
                            ? "3px solid blue"
                            : "none",
                        borderRadius: "0",
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        cursor: "pointer"
                      }}
                      className="btn px-3 w-100 fw-bold btn-primary "
                    >
                      Update Details
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              id="personalinfo"
              style={{ height: "33rem", overflow: "hidden" }}
              className="col-12 rounded col-lg-7 p-0 m-0 bg-white shadow"
            >
              <div className="shift-pages w-100 shadow-sm d-flex justify-content-around px-2 mb-1">
                <span
                  onClick={() => onToggleSection("personalInfo")}
                  style={{
                    whiteSpace: "pre",
                    borderBottom:
                      activeSection === "personalInfo"
                        ? "3px solid blue"
                        : "none",
                    borderRadius: "0"
                  }}
                  className="btn py-2 px-0 fw-bold"
                >
                  Personal
                </span>
                <span
                  onClick={() => onToggleSection("companyInfo")}
                  style={{
                    whiteSpace: "pre",
                    borderBottom:
                      activeSection === "companyInfo"
                        ? "3px solid blue"
                        : "none",
                    borderRadius: "0"
                  }}
                  className="btn py-2 px-0 fw-bold"
                >
                  Company
                </span>
                <span
                  onClick={() => onToggleSection("Educationalinfo")}
                  style={{
                    whiteSpace: "pre",
                    borderBottom:
                      activeSection === "Educationalinfo"
                        ? "3px solid blue"
                        : "none",
                    borderRadius: "0"
                  }}
                  className="btn py-2 px-0 fw-bold"
                >
                  Education
                </span>

                <span
                  onClick={() => onToggleSection("Document")}
                  style={{
                    whiteSpace: "pre",
                    borderBottom:
                      activeSection === "Document"
                        ? "3px solid blue"
                        : "none",
                    borderRadius: "0"
                  }}
                  className="btn py-2 px-0 fw-bold"
                >
                  Documents
                </span>

                <span
                  onClick={() => onToggleSection("WorkExperience")}
                  style={{
                    whiteSpace: "pre",
                    borderBottom:
                      activeSection === "WorkExperience"
                        ? "3px solid blue"
                        : "none",
                    borderRadius: "0"
                  }}
                  className="btn py-2 px-0 fw-bold"
                >
                  Work Experience{" "}
                </span>
                <span
                  onClick={() => onToggleSection("otherInfo")}
                  style={{
                    whiteSpace: "pre",
                    borderBottom:
                      activeSection === "otherInfo"
                        ? "3px solid blue"
                        : "none",
                    borderRadius: "0"
                  }}
                  className="btn py-2 px-0 fw-bold"
                >
                  Dependents
                </span>
              </div>
              {activeSection === "personalInfo" && (
                <div className="row">
                  <div
                    className="pb-5"
                    id="companyinfo"
                    style={{
                      overflow: "hidden auto",
                      height: "29rem",
                      scrollbarWidth: "thin"
                    }}
                  >
                    {rowData.map((items, index) => {
                      return (
                        <div className="row justify-content-evenly py-3 row-gap-3">
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm text-capitalize"
                              value={items.FirstName}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm text-capitalize"
                              value={items.LastName}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.ContactNo}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Emergency Contact
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.EmergencyContactNo}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Presonal Email
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.presonalEmail}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Date of Birth
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.DOB.slice(0, 10)}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Blood Group
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.BloodGroup}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              PAN Number
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm text-uppercase"
                              value={items.PANcardNo}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Present Address
                            </label>

                            <textarea
                              type="text"
                              className="form-control rounded-1 shadow-sm text-capitalize"
                              value={items.PresentAddress}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Permanent Address
                            </label>

                            <textarea
                              type="text"
                              className="form-control rounded-1 shadow-sm text-capitalize"
                              value={items.PermanetAddress}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeSection === "companyInfo" && (
                <div className="row">
                  <div
                    style={{
                      overflow: "hidden auto",
                      height: "29rem",
                      scrollbarWidth: "thin"
                    }}
                  >
                    {rowData.map((items, index) => {
                      return (
                        <div className="row justify-content-evenly py-3 row-gap-3">
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Employee ID
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm text-uppercase"
                              value={items.empID}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Work Email
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.Email}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Role
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm text-capitalize"
                              value={items.RoleName}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Position
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm text-capitalize"
                              value={items.PositionName}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Department
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm text-capitalize"
                              value={items.DepartmentName}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Date of Joining
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.DateOfJoining}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Account Access
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.Account}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Reporting Manager
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.reportManager}
                            />
                          </div>
                          <div className="col-12 col-sm-5 d-flex flex-column">
                            <label htmlFor="" className=" fw-bold text-muted">
                              Reporting HR
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-1 shadow-sm"
                              value={items.reportHr}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeSection === "Educationalinfo" && (
                <div className="w-100 container ">
                  <Education />
                </div>
              )}

              {activeSection === "Document" && (
                <div className="w-100 container ">
                  <Document />
                </div>
              )}
              {activeSection === "WorkExperience" && (
                <div className="w-100 container ">
                  <WorkExperience />
                </div>
              )}
              {activeSection === "otherInfo" && (
                <div className="w-100 container ">
                  <FamilyInfo />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader
            css={override}
            sizeUnit={"px"}
            size={50}
            color={"#0000ff"}
            loading={true}
          />
        </div>
      )}
    </div>
  );
};

export default PersonalInfoTable;
