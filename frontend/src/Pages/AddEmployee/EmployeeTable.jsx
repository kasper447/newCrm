import React, { useState, useEffect } from "react";
import "./EmployeeTable.css";
import { LuSearch } from "react-icons/lu";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFilePdf, FaFilter, FaLocationArrow } from "react-icons/fa";
import { TbUserEdit } from "react-icons/tb";
import { FcNumericalSorting12, FcNumericalSorting21 } from "react-icons/fc";
import BASE_URL from "../config/config";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { GrFormPrevious } from "react-icons/gr";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Pagination from "../../Utils/Pagination";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const AdminEmployeeTable = (props) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isIdFilterActive, setIsIdFilterActive] = useState(false);
  const [isIdSortAscending, setIsIdSortAscending] = useState(true);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [activeProfile, setActiveProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { darkMode } = useTheme();

  const isFilterApplied = selectedFilter !== '';

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEmployeeData(response.data);
          setLoading(false);
          setRowData([]);

          response.data.forEach((data) => {
            let temp = {
              data,
              Email: data["Email"],
              Password: data["Password"],
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
              RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
              FirstName: data["FirstName"],
              MiddleName: data["MiddleName"],
              LastName: data["LastName"],
              DOB: data["DOB"].slice(0, 10),
              ContactNo: data["ContactNo"],
              empID: data["empID"],
              DepartmentName: data["department"][0]
                ? data["department"][0]["DepartmentName"]
                : "",
              PositionName: data["position"][0]
                ? data["position"][0]["PositionName"]
                : "",
              DateOfJoining: data["DateOfJoining"].slice(0, 10),
              status: data["status"],
              loginStatus: data["loginStatus"],
            };

            setRowData((prevData) => [...prevData, temp]);
          });
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onEmployeeDelete = (e) => {
    if (window.confirm("Are you sure to delete this record? ")) {
      axios
        .delete(`${BASE_URL}/api/employee/${e}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then(() => {
          loadEmployeeData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const exportToPDF = () => {
    window.confirm("Are you sure to download Employee record? ");
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    doc.setFontSize(18);
    doc.text("Employee Details", 297 / 2, 15, "center");
    const headers = [
      "Emp Id",
      "Email",
      "Account Access",
      "First Name",
      "Last Name",
      "DOB",
      "ContactNo",
      "Role",
      "Position",
      "Department",
      "D.O.J",
    ];
    const data = rowData.map((row) => [
      row.empID,
      row.Email,
      row.Account,
      row.FirstName,
      row.LastName,
      row.DOB,
      row.ContactNo,
      row.RoleName,
      row.PositionName,
      row.DepartmentName,
      row.DateOfJoining,
      row.status,
      "",
    ]);
    doc.setFontSize(12);
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
    });

    doc.save("employee_data.pdf ");
  };

  const renderInfoButton = (params) => {
    if (params.data && params.data.data) {
      return (
        <div>
          <FontAwesomeIcon
            icon={faInfoCircle}
            onClick={() => props.onEmpInfo(params.data.data)}
          />
        </div>
      );
    }
    return null;
  };

  const renderButton = (params) => {
    if (params.data && params.data.data && params.data.data["_id"]) {
      return (
        <FontAwesomeIcon
          icon={faTrash}
          onClick={() => onEmployeeDelete(params.data.data["_id"])}
        />
      );
    }
    return null;
  };

  const renderEditButton = (params) => {
    if (params.data && params.data.data) {
      return (
        <FontAwesomeIcon
          icon={faEdit}
          onClick={() => props.onEditEmployee(params.data.data)}
        />
      );
    }
    return null;
  };

  const getBackgroundColor = (accountType) => {
    switch (accountType) {
      case "Admin":
        return "#1D267D";
      case "HR":
        return "#1D267D";
      case "Employee":
        return "#1D267D";
      case "Manager":
        return "#1D267D";
      default:
        return "#1D267D";
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleToggleIdSort = () => {
    setIsIdSortAscending(!isIdSortAscending);
  };

  const sortById = (a, b) => {
    const idA = a.empID.toLowerCase();
    const idB = b.empID.toLowerCase();

    if (isIdSortAscending) {
      return idA.localeCompare(idB);
    } else {
      return idB.localeCompare(idA);
    }
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const calculateUpcomingBirthdays = () => {
    const today = new Date();
    const upcomingBirthdaysData = rowData.filter((employee) => {
      const dob = new Date(employee.DOB);
      dob.setFullYear(today.getFullYear());

      const timeDiff = dob - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    });

    setUpcomingBirthdays(upcomingBirthdaysData);
  };

  useEffect(() => {
    calculateUpcomingBirthdays();
  }, [rowData]);

  let filteredData = rowData.filter((item) => {
    const isMatchingId = isIdFilterActive
      ? item.empID.toLowerCase() === searchInput.toLowerCase()
      : true;

    const isMatchingFirstName = item.FirstName.toLowerCase().includes(
      searchInput.toLowerCase()
    );

    const isMatchingFilter =
      selectedFilter === "" || item.Account === selectedFilter;

    return isMatchingId && isMatchingFirstName && isMatchingFilter;
  });

  filteredData = filteredData.sort(sortById);

  const allCount = filteredData.filter((data) => data.Account === "").length;
  const adminCount = filteredData.filter(
    (data) => data.Account === "Admin"
  ).length;
  const hrCount = filteredData.filter((data) => data.Account === "HR").length;
  const managerCount = filteredData.filter(
    (data) => data.Account === "Manager"
  ).length;
  const employeeCount = filteredData.filter(
    (data) => data.Account === "Employee"
  ).length;

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="py-0">
      <div
        style={{
          position: "sticky",
          top: "0",
          zIndex: "3",
          background: darkMode
            ? "var(--secondaryDashMenuColor)"
            : "var(--secondaryDashColorDark)",
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
        className="my-auto py-2 shadow-sm"
      >
        <div className="row m-auto row-gap-4 px-0 my-2">
          <div className="col-12 col-sm-12 col-md-3 d-flex px-1 px-md-2">
            <h5 className="my-auto text-capitalize d-flex gap-0">
              Employees
              <span className="my-auto fs-6 mx-2">
                ({filteredData.length})
              </span>
            </h5>
          </div>
          <div className="col-6 col-md-5 d-flex p-0 px-1 position-relative">
            <input
              style={{
                height: "100%",
                width: "100%",
                paddingLeft: "30px",
              }}
              className="form-control rounded-0 border border-muted border rounded-0 rounded-sm-5"
              type="text"
              placeholder="Search by name"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <LuSearch
              style={{
                position: "absolute",
                top: "30%",
                left: "9px",
                height: "17px",
                width: "17px",
                color: "black",
              }}
            />
          </div>
          <div className="col-6 col-md-4 d-flex align-items-center justify-content-end gap-1">
            <button
              onClick={exportToPDF}
              className="btn  bg-white shadow-sm fw-bold rounded-0"
            >
              <FaFilePdf className="fs-6 align-items-center text-danger" />
            </button>
            <div className="bg-white" style={{ position: "relative" }}>
              <span
                onMouseEnter={() => setActiveProfile("name")}
                onMouseLeave={() => setActiveProfile(null)}
                className={`btn rounded-0 shadow-sm ${isFilterApplied ? 'bg-primary text-white' : 'text-primary'}`}
              >
                <FaFilter />
                <div
                  style={{
                    position: "absolute",
                    zIndex: "1",
                    right: "0",
                    top: "95%",
                    width: "150px",
                    display: activeProfile === "name" ? "flex" : "none",
                    backgroundColor: "rgba(256,256,256,.95)",
                  }}
                  className="px-2 shadow flex-column py-2 shadow rounded-1 text-dark border"
                >
                  <div
                    onClick={() => setSelectedFilter('')}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    All <span>{rowData.length}</span>
                  </div>
                  <div
                    onClick={() => setSelectedFilter('Admin')}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    Admin <span>{adminCount}</span>
                  </div>
                  <div
                    onClick={() => setSelectedFilter('HR')}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    HR <span>{hrCount}</span>
                  </div>
                  <div
                    onClick={() => setSelectedFilter('Manager')}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    Manager <span>{managerCount}</span>
                  </div>
                  <div
                    onClick={() => setSelectedFilter('Employee')}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-nowrap justify-content-between"
                  >
                    Employee <span>{employeeCount}</span>
                  </div>
                  {isFilterApplied && (
                    <div
                      onClick={() => setSelectedFilter('')}
                      style={{ cursor: "pointer" }}
                      className="d-flex btn btn-primary my-1 text-center py-1 rounded-0 shadow-sm flex-nowrap justify-content-center"
                    >
                      Clear Filter
                    </div>
                  )}
                </div>
              </span>
            </div>
            <button
              onClick={handleToggleIdSort}
              className="btn  bg-white shadow-sm fs-6 fw-bold rounded-0"
            >
              {isIdSortAscending ? (
                <FcNumericalSorting21 />
              ) : (
                <FcNumericalSorting12 />
              )}
            </button>
            <button
              className="d-flex  btn justify-center bg-success shadow-sm rounded-0 text-white align-center gap-2"
              onClick={props.onAddEmployee}
            >
              + <span className="d-none d-lg-flex">Add Employee</span>
            </button>
          </div>
        </div>
      </div>
      <div id="clear-both" />
      {!loading ? (
        <div>
          <div
            style={{ minHeight: "68vh", maxHeight: "68vh", overflow: 'auto', position: 'relative' }}
            className="table-responsive p-2 mb-3"
          >
            <table className="table" style={{ fontSize: ".9rem", minHeight: "20vh", maxHeight: "20vh", overflow: 'auto' }}>
              <thead>
                <tr >
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px',
                      left: '-10px',
                      zIndex: '1'
                    }}
                    scope="col"
                  >
                    Name
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                    ID
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                    Position
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                    Account
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                    Email
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                    Contact No
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                    Login Status
                  </th>
                  <th
                    style={{
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      border: "none",
                      whiteSpace: "pre",
                      position: 'sticky',
                      top: '-10px'
                    }}
                    scope="col"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((items, index) => (
                  <tr key={index}>
                    <td
                      className="border-0"
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        position: 'sticky',
                        left: '0'
                      }}
                    >
                      <div
                        style={{
                          height: "35px",
                          width: "35px",
                          overflow: "hidden",
                          borderRadius: "50%",
                        }}
                        className="profile-image bg-white  mx-auto border-0"
                      >
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          className=" border-0"
                          src={
                            items?.data?.profile?.image_url
                              ? items?.data?.profile?.image_url
                              : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                          }
                          alt=""
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        textTransform: "capitalize",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                        position: 'sticky',
                        left: '-10px'
                      }}
                      className="border-0"
                    >
                      {items.FirstName} {items.LastName}
                    </td>
                    <td
                      className="border-0"
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                      }}
                    >
                      {items.empID}
                    </td>
                    <td
                      className="border-0"
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                      }}
                    >
                      {items.PositionName}
                    </td>
                    <td
                      className="border-0"
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                      }}
                    >
                      {items.Account}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                      }}
                      className={
                        items.status === "active"
                          ? "text-success border-0 text-capitalize"
                          : "text-danger border-0 text-capitalize"
                      }
                    >
                      {items.status}
                    </td>
                    <td
                      className="border-0"
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                      }}
                    >
                      {items.Email}
                    </td>
                    <td
                      className="border-0"
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                      }}
                    >
                      {items.ContactNo}
                    </td>
                    <td
                      className="border-0"
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                      }}
                    >
                      {items.loginStatus}
                    </td>
                    <td
                      className="border-0"
                      style={{
                        verticalAlign: "middle",
                        background: items.status === "Inactive" ? "rgba(194, 11, 11, 0.1" : darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
                        color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
                        whiteSpace: "pre",
                      }}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip
                            style={{ overflow: "hidden" }}
                            className="border border-2 p-0 rounded-5 "
                            id="button-tooltip"
                          >
                            Info Profile
                          </Tooltip>
                        }
                      >
                        <button
                          aria-label="Info"
                          style={{ color: darkMode ? "black" : "white" }}
                          onClick={() => props.onEmpInfo(items.data)}
                          className="btn btn-sm"
                        >
                          <FaLocationArrow />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip
                            style={{ overflow: "hidden" }}
                            className="border border-2 p-0 rounded-5 "
                            id="button-tooltip"
                          >
                            Edit Profile
                          </Tooltip>
                        }
                      >
                        <button
                          style={{ color: darkMode ? "black" : "white" }}
                          onClick={() => props.onEditEmployee(items.data)}
                          className="btn btn-sm"
                        >
                          <TbUserEdit />
                        </button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <Pagination
            currentPage={currentPage}
            pageNumbers={pageNumbers}
            handlePaginationPrev={handlePaginationPrev}
            handlePaginationNext={handlePaginationNext}
            setCurrentPage={setCurrentPage}
            filteredDataLength={filteredData.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader
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

export default AdminEmployeeTable;
