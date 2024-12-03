import React, { useCallback, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import JSZip from "jszip";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import "../../Settings/Setting_Tabs/leave.css";
import "../../Enrollment/Department/department.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import PayrollLogs from "../Payroll_Logs/payroll_log";
import AdvanceSalary from "../Advance_Salary/advance_salary";
import Appraisal from "../Appraisal/appraisal";
import Loan from "../Loan/loan";
import ExtraFunds from "../../Enrollment/ExtraFund/ExtraFunds";
import Bonuses from "../Bouneses/bouneses";
import axios from "axios";
import { faXmark, faPrint } from "@fortawesome/free-solid-svg-icons";

import SalarySlip from "./SalarySlip";
import ReactDOMServer from "react-dom/server";

import { SERVER_URL } from "../../../config";
import { FaArrowDown, FaDownload, FaFolderOpen } from "react-icons/fa";

const EmplyeeProfile = () => {
  const [data, setData] = useState([
    {
      pysId: "",
      empId: "",
      empName: "",
      otHoursPay: "",
      otHours: "",
      extraFund: "",
      advSalary: "",
      app: "",
      loan: "",
      bonus: "",
      salaryPeriod: "",
      bankName: "",
      accountNo: "",
      basicSalary: "",
      salaryType: "",
      totalWorkingDays: "",
      totalWorkingHours: "",
      totalWorkingMinutes: "",
      attemptWorkingHours: "",
      dailySalary: "",
      calcPay: "",
    },
  ]);

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [changeTab, setChangeTab] = useState("Employee Profile");

  const [activeTab, setActiveTab] = useState("table"); // Default view is the table
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store the selected employee data

  const fetchPayrollEmpProfiles = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-emp-profile/`);
      const fetchedData = response.data; // Assuming only one object is returned
      setData(fetchedData); // Directly update the settings state
      setEmployees(fetchedData);
      console.log("employees", employees);
      console.log(fetchedData);
    } catch (error) {
      console.error("Error fetching payroll profiles:", error);
    }
  }, []);
  useEffect(() => {
    fetchPayrollEmpProfiles();
    setActiveTab("table");
  }, [fetchPayrollEmpProfiles, changeTab]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.attemptWorkingHours
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.dailySalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.basicSalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salaryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salaryPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalWorkingDays.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalWorkingHours
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.totalWorkingMinutes
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.attemptWorkingHours
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.dailySalary.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'legal'); // Set to 'landscape' and 'legal' size (216 x 356 mm)
  
    doc.autoTable({
      head: [
        [
          "Serial No",
          "Employee ID",
          "Employee Name",
          "Overtime Pay",
          "Overtime Hours",
          "Extra Fund",
          "Advance Salary",
          "Appraisals",
          "Loan",
          "Bonus",
          "Salary Period",
          "Bank Name",
          "Account Number",
          "Basic Salary",
          "Salary Type",
          "Total Working Days",
          "Total Working Hours",
          "Total Working Minutes",
          "Attempt Working Hours",
          "Daily Salary",
          "Pay",
        ],
      ],
      body: filteredData.map((item, index) => [
        index + 1,
        item.empId,
        item.empName,
        item.otHoursPay,
        item.otHours,
        item.extraFund,
        item.advSalary,
        item.app,
        item.loan,
        item.bonus,
        item.salaryPeriod,
        item.bankName,
        item.accountNo,
        item.basicSalary,
        item.salaryType,
        item.totalWorkingDays,
        item.totalWorkingHours,
        item.totalWorkingMinutes,
        item.attemptWorkingHours,
        item.dailySalary,
        item.calcPay,
      ]),
      styles: {
        overflow: 'linebreak', // Allow text to wrap
        fontSize: 8, // Adjust font size to fit more content
        cellPadding: 2, // Adjust padding for better spacing
        lineWidth: 0.1, // Set the line width for borders
        lineColor: [0, 0, 0], // Set the border color to black
      },
      tableWidth: 'auto', // Automatically adjust column widths
      didDrawCell: (data) => {
        const { row, column, cell } = data;
  
        // No background color or other styling applied, just basic borders
        doc.setTextColor(0, 0, 0); // Set text color to black for all cells
  
        // Add border around each cell
        doc.setLineWidth(0.1); // Border thickness
        doc.setDrawColor(0, 0, 0); // Border color (black)
        doc.rect(cell.x, cell.y, cell.width, cell.height); // Draw rectangle (border) around each cell
      },
      didDrawPage: (data) => {
        // Add a title or additional content on the first page
        doc.text('Employee Salary Report', 20, 10);
      },
    });
  
    doc.save("employee-profile.pdf");
  };
  









  const handleExportPdf = async () => {
    const element = document.querySelector(".salary-slip");

    // Ensure all images are loaded before rendering
    const images = element.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img) => {
      return new Promise((resolve, reject) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = reject;
        }
      });
    });
    await Promise.all(imagePromises); // Wait for images to load

    // Generate canvas with html2canvas
    const canvas = await html2canvas(element, {
      scale: 1.5, // Lower scale for faster rendering
      useCORS: true, // Enable cross-origin images
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.8); // Compress image (JPEG)
    const pdf = new jsPDF("p", "mm", "a4");

    // Calculate dimensions to fit canvas into A4
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pageWidth / pageHeight;

    let imgWidth, imgHeight;
    if (canvasAspectRatio > pdfAspectRatio) {
      imgWidth = pageWidth;
      imgHeight = pageWidth / canvasAspectRatio;
    } else {
      imgHeight = pageHeight;
      imgWidth = pageHeight * canvasAspectRatio;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
    pdf.save(
      `${selectedEmployee.empId}-${selectedEmployee.empName}-SalarySlip.pdf`
    );
  };

  const handleOpenSalarySlip = (employee) => {
    setSelectedEmployee(employee); // Set the selected employee's data
    setActiveTab("salarySlip"); // Switch to the salary slip tab
  };

  const handleCloseSalarySlip = () => {
    setActiveTab("table"); // Go back to the table view
    setSelectedEmployee(null); // Clear the selected employee's data
  };

  const generateSalarySlipPDF = (salaryDetails) => {
    console.log('salaryDetails', salaryDetails)
    return new Promise(async (resolve, reject) => {
      const tempContainer = document.createElement("div");
      try {
        // Render the SalarySlip component to static HTML
        const salarySlipHTML = ReactDOMServer.renderToStaticMarkup(
          <SalarySlip salaryDetails={salaryDetails} />
        );

        console.log("Generating Salary Slip HTML for:", salaryDetails.empName); // Debugging output

        // Create a temporary container to hold the HTML for rendering
        tempContainer.innerHTML = salarySlipHTML;
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px"; // Hide the container
        document.body.appendChild(tempContainer);

        // Preload all images inside the container
        const images = tempContainer.querySelectorAll("img");
        const imagePromises = Array.from(images).map((img) => {
          return new Promise((resolve, reject) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = reject;
            }
          });
        });

        await Promise.all(imagePromises); // Wait for all images to load

        // Generate canvas with html2canvas
        const canvas = await html2canvas(tempContainer, {
          scale: 1.5, // Higher scale for better resolution
          useCORS: true, // Handle cross-origin images
        });

        if (!canvas || !canvas.width || !canvas.height) {
          console.error(
            "Error: html2canvas failed to render the canvas for",
            salaryDetails.empName
          );
          reject(new Error("Canvas rendering failed"));
          return;
        }

        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const pdf = new jsPDF("p", "mm", "a4");

        // Calculate the dimensions to fit the canvas into an A4 page
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;
        const pdfAspectRatio = pageWidth / pageHeight;

        let imgWidth, imgHeight;
        if (canvasAspectRatio > pdfAspectRatio) {
          imgWidth = pageWidth;
          imgHeight = pageWidth / canvasAspectRatio;
        } else {
          imgHeight = pageHeight;
          imgWidth = pageHeight * canvasAspectRatio;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);

        // Clean up by removing the temporary container
        document.body.removeChild(tempContainer);

        console.log("Generated PDF for:", salaryDetails.empName); // Debugging output

        // Resolve the Promise with the generated PDF as a Blob
        const pdfBlob = pdf.output("blob");
        resolve({
          pdfBlob,
          fileName: `${salaryDetails.empId}-${salaryDetails.empName}-SalarySlip.pdf`,
        });
      } catch (error) {
        console.error(
          "Error generating salary slip for:",
          salaryDetails.empName,
          error
        );

        // Ensure temporary container is cleaned up on error
        document.body.removeChild(tempContainer); // Correctly removes the tempContainer
        reject(error);
      }
    });
  };

  // Function to generate and download the ZIP with all salary slips
  const downloadAllSalarySlips = async () => {
    const zip = new JSZip();

    if (!employees || employees.length === 0) {
      console.error("No employees data found.");
      return;
    }

    console.log(
      "Starting to generate salary slips for",
      employees.length,
      "employees..."
    );

    // Loop through all employees and generate salary slips
    for (const employee of employees) {
      try {
        console.log("Processing salary slip for employee:", employee.empName); // Debugging output
        const { pdfBlob, fileName } = await generateSalarySlipPDF(employee);
        console.log("Adding PDF to ZIP for:", fileName); // Debugging output
        zip.file(fileName, pdfBlob); // Add the PDF Blob to the ZIP file
      } catch (error) {
        console.error(
          "Error generating salary slip for",
          employee.empName,
          error
        );
      }
    }

    // Generate the ZIP file after all PDFs have been added
    zip
      .generateAsync({ type: "blob" })
      .then(function (content) {
        console.log("ZIP file generated, preparing to download..."); // Debugging output

        // Create a link to download the ZIP file
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "all_salary_slips.zip"; // Name of the ZIP file
        link.click(); // Trigger the download
      })
      .catch((error) => {
        console.error("Error generating ZIP file:", error);
      });
  };

  const renderTabContent = () => {
    switch (changeTab) {
      case "Payroll Log":
        return <PayrollLogs />;
      case "Advance Salary":
        return <AdvanceSalary />;
      case "Appraisal":
        return <Appraisal />;
      case "Loan":
        return <Loan />;
      case "Extra Funds":
        return <ExtraFunds />;
      case "Bonuses":
        return <Bonuses />;
      default:
        return (
          <>
            {(() => {
              switch (activeTab) {
                case "table":
                  return (
                    <div className="department-table">
                      <div
                        className="table-header"
                        style={{ paddingBottom: "none" }}
                      >
                        <form
                          className="form"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <button type="submit">
                            <svg
                              width="17"
                              height="16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-labelledby="search"
                            >
                              <path
                                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                                stroke="currentColor"
                                strokeWidth="1.333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                          </button>
                          <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="input"
                            type="text"
                          />
                          <button
                            className="reset"
                            type="button" // Change to type="button" to prevent form reset
                            onClick={() => setSearchQuery("")} // Clear the input on click
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </form>
                        <div className="export-buttons">
                          <button
                            className="button download-all"
                            onClick={downloadAllSalarySlips}
                          >
                            <div className="icon-group">
                              <FaFolderOpen className="folder-icon" />
                            </div>
                             Download All Sallary Slips
                          </button>

                          <button className="button export-csv">
                            <CSVLink
                              data={filteredData}
                              filename="employee-profile.csv"
                            >
                              <div className="icon-group">
                                <FontAwesomeIcon
                                  icon={faFileCsv}
                                  className="button-icon"
                                />
                            Export to CSV
                              </div>
                            </CSVLink>
                          </button>

                          <button
                            className="button export-pdf"
                            onClick={exportToPDF}
                          >
                            <div className="icon-group">
                              <FontAwesomeIcon
                                icon={faFilePdf}
                                className="button-icon"
                              />
                            </div>
                            Export to PDF
                          </button>
                        </div>



                        
                      </div>
                      <div className="departments-table">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Employee ID</th>
                              <th>Employee Name</th>
                              <th>Overtime Pay</th>
                              <th>Overtime Hours</th>
                              <th>Extra Fund</th>
                              <th>Advance Salary</th>
                              <th>Appraisals</th>
                              <th>Loan</th>
                              <th>Bonus</th>
                              <th>Period</th>
                              <th>Basic</th>
                              <th>Type</th>
                              <th>Total Working Days</th>
                              <th>Total Working Hours</th>
                              <th>Attempt Working Hours</th>
                              <th>Daily Salary</th>
                              <th>Pay</th>
                              <th>Salary Slip</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((item, index) => (
                              <tr key={item.id}>
                                <td>{item.empId}</td>
                                <td>{item.empName}</td>
                                <td>{item.otHoursPay}</td>
                                <td>{item.otHours}</td>
                                <td>{item.extraFund}</td>
                                <td>{item.advSalary}</td>
                                <td>{item.app}</td>
                                <td>{item.loan}</td>
                                <td>{item.bonus}</td>
                                <td>{item.salaryPeriod}</td>
                                <td>{item.basicSalary}</td>
                                <td>{item.salaryType}</td>
                                <td>{item.totalWorkingDays}</td>
                                <td>{item.totalWorkingHours}</td>
                                <td>{item.attempt_working_hours}</td>
                                <td>{item.dailySalary}</td>
                                <td>{item.calculate_pay}</td>
                                <td>
                                  <button
                                    onClick={() => handleOpenSalarySlip(item)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                    }}
                                  >
                                    <FaDownload className="salary-slip-button" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );

                case "salarySlip":
                  return (
                    <div className="modal">
                      <div className="modal-salary">
                        <div className="btn-container">
                          <div className="print-salary">
                            <button onClick={handleExportPdf}>
                              <FontAwesomeIcon icon={faPrint} />
                            </button>
                          </div>
                          <div className="close-Salary">
                            <button onClick={handleCloseSalarySlip}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                        </div>
                        <SalarySlip salaryDetails={selectedEmployee} />
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })()}
          </>
        );
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="tabs">
          <button
            className={`${changeTab === "Employee Profile" ? "active" : ""}`}
            onClick={() => setChangeTab("Employee Profile")}
          >
            Employee Profile
          </button>
          <button
            className={`${changeTab === "Advance Salary" ? "active" : ""}`}
            onClick={() => setChangeTab("Advance Salary")}
          >
            Advance Salary
          </button>
          <button
            className={`${changeTab === "Appraisal" ? "active" : ""}`}
            onClick={() => setChangeTab("Appraisal")}
          >
            Appraisal
          </button>
          <button
            className={`${changeTab === "Loan" ? "active" : ""}`}
            onClick={() => setChangeTab("Loan")}
          >
            Loan
          </button>
          <button
            className={`${changeTab === "Extra Funds" ? "active" : ""}`}
            onClick={() => setChangeTab("Extra Funds")}
          >
            Extra Funds
          </button>
          <button
            className={`${changeTab === "Bonuses" ? "active" : ""}`}
            onClick={() => setChangeTab("Bonuses")}
          >
            Bonuses
          </button>
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </>
  );
};

export default EmplyeeProfile;
