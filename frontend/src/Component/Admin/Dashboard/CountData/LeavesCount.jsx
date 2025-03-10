import React, { useState, useEffect } from "react";
// import "./LeaveApplicationHRTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import BASE_URL from "../../../../Pages/config/config";

import { css } from "@emotion/core";
import {
  Form,
  Button,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownButton
} from "react-bootstrap";

// *************csv & pdf **************//
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
// *************csv & pdf **************//

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const LeaveApplicationHRTable = (props) => {
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowData, setRowData] = useState([]);

  // ...

  let leaveApplicationHRObj = [];
  let rowDataT = [];

  const loadLeaveApplicationHRData = () => {
    axios
      .get(`${BASE_URL}/api/leave-application-hr/`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        leaveApplicationHRObj = response.data;
        console.log("response", response.data);
        setLeaveApplicationHRData(response.data);
        setLoading(false);

        rowDataT = [];

        leaveApplicationHRObj.map((data) => {
          let temp = {
            data,
            empID:
              data["employee"] &&
              data["employee"][0] &&
              data["employee"][0]["empID"],
            Name:
              data["employee"] &&
              data["employee"][0] &&
              data["employee"][0]["FirstName"] +
                " " +
                data["employee"][0]["LastName"],
            Leavetype: data["Leavetype"],
            FromDate: data["FromDate"].slice(0, 10),
            ToDate: data["ToDate"].slice(0, 10),
            Reasonforleave: data["Reasonforleave"],
            Status: status(data["Status"])
          };

          rowDataT.push(temp);
        });

        setRowData(rowDataT);

        setTotalLeaves(response.data.length);
        props.updateTotalLeaves(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ...

  const onLeaveApplicationHRDelete = (e1, e2) => {
    console.log(e1, e2);
    if (window.confirm("Are you sure to delete this record? ") == true) {
      axios
        .delete(
          `${BASE_URL}/api/leave-application-hr/` + e1 + "/" + e2,
          {
            headers: {
              authorization: localStorage.getItem("token") || ""
            }
          }
        )
        .then((res) => {
          loadLeaveApplicationHRData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const exportToPDF = () => {
    if (window.confirm("Are you sure to download Leave record? ")) {
      // Set A4 landscape dimensions
      const pdfWidth = 297; // A4 width in mm
      const pdfHeight = 210; // A4 height in mm
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight]
      });

      doc.setFontSize(18);
      doc.text("Employee Leave Details", pdfWidth / 2, 15, "center");
      const headers = [
        "Emp Id",
        "Leave Type",
        "Start Date",
        "End Date",
        "Remarks",
        "Status"
      ];
      const data = rowData.map((row) => [
        row.empID,
        row.Leavetype,
        row.FromDate,
        row.ToDate,
        row.Reasonforleave,
        row.Status,

        "" // Action column - you can customize this based on your requirements
      ]);
      doc.setFontSize(12);
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 25
      });

      doc.save("leaveApplication_data.pdf");
    }
  };

  useEffect(() => {
    loadLeaveApplicationHRData();
  }, []);

  const renderButton = (params) => {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() =>
          onLeaveApplicationHRDelete(
            params.data.data["employee"][0]["_id"],
            params.data.data["_id"]
          )
        }
      />
    );
  };

  const renderEditButton = (params) => {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditLeaveApplicationHR(params.data.data)}
      />
    );
  };

  const status = (s) => {
    if (s == 1) {
      return "Pending";
    }
    if (s == 2) {
      return "Approved";
    }
    if (s == 3) {
      return "Rejected";
    }
    // Add a default case or return a meaningful value for unknown status
    return "Unknown";
  };

  const renderSortIcon = (field) => {
    if (sortColumn === field) {
      return sortDirection === "asc" ? "▴" : "▾";
    }
    return null;
  };

  const sortData = (columnName) => {
    const newSortDirection =
      sortColumn === columnName && sortDirection === "asc" ? "desc" : "asc";

    const sortedData = [...rowData];

    sortedData.sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      let comparison = 0;

      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return newSortDirection === "desc" ? comparison * -1 : comparison;
    });

    setRowData(sortedData);
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
  };

  // Calculate the total length for each status
  const pendingLeaves = rowData.filter(
    (data) => data.Status === "Pending"
  ).length;
  const approvedLeaves = rowData.filter(
    (data) => data.Status === "Approved"
  ).length;
  const rejectedLeaves = rowData.filter(
    (data) => data.Status === "Rejected"
  ).length;

  return (
    // <div className="p-4">
    //   <div className="d-flex justify-between">
    //     <h3 className="fw-bold text-muted">Leave Request ({totalLeaves})</h3>

    //     <button
    //       className="btn px-3 d-flex justify-center aline-center gap-2"
    //       onClick={exportToPDF}
    //     >
    //       <BsFillFileEarmarkPdfFill className="text-danger fs-4" />
    //       <p className="my-auto fs-5 fw-bold">PDF</p>
    //     </button>
    //   </div>

    //   <div id="clear-both" />

    //   <div className="mt-3">
    //     {/* Display the total length for each status */}
    //     <p>Total Pending Leaves: {pendingLeaves}</p>
    //     <p>Total Approved Leaves: {approvedLeaves}</p>
    //     <p>Total Rejected Leaves: {rejectedLeaves}</p>

    //     {/* Display the table */}
    //     {!loading ? (
    //       <div
    //         style={{
    //           overflow: "auto",
    //           height: "85vh",
    //           width: "100%",
    //           scrollbarWidth: "thin"
    //         }}
    //       >
    //         <table className="table table-striped">
    //           <thead>{/* ... (existing code) */}</thead>
    //           <tbody>
    //             {rowData
    //               .filter((e) => e.Status == "Pending")
    //               .map((data, index) => (
    //                 <tr key={index}>{/* ... (existing code) */}</tr>
    //               ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     ) : (
    //       <div id="loading-bar">
    //         <RingLoader
    //           css={override}
    //           sizeUnit={"px"}
    //           size={50}
    //           color={"#0000ff"}
    //           loading={true}
    //         />
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div>
      <div className="container-fluid ">
        <div className="row row-gap-4">
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#FED2AA" }}
              className=" DashboardCard position-relative"
            >
              <div className=" d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  On Pending Leaves
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {pendingLeaves}
                  </span>
                </p>
                <Link
                  className=" moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/pendingLeave"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#DFFFD8" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  On Approved Leaves{" "}
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {approvedLeaves}
                  </span>
                </p>
                <Link
                  className=" moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/leaveAccepted"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="row row-gap-4"></div> */}
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#FEBBCC" }}
              className="DashboardCard position-relative"
            >
              <div className="d-flex flex-column gap-3">
                <p className="fw-bold pt-2 text-muted">
                  On Rejected Leaves
                  <span
                    className="fw-bolder text-info position-absolute"
                    style={{ fontSize: "35px", right: "10%", top: "4%" }}
                  >
                    {rejectedLeaves}
                  </span>
                </p>
                <Link
                  className=" moreInfoLink text-decoration-none bg-white px-4  rounded-5 d-flex justify-between py-1  aline-items-center fw-bold text-info  aline-center"
                  to="/admin/leaveRejected"
                >
                  <p className="my-auto">More Info</p>{" "}
                  <p className="my-auto fs-4 d-flex">
                    <IoIosArrowDroprightCircle />
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationHRTable;
