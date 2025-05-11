import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import JSZip from "jszip";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import "../../Settings/Setting_Tabs/leave.css";
import "../../Enrollment/Department/department.css";
import { faFileCsv, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import AdvanceSalary from "../Advance_Salary/advance_salary";
import Appraisal from "../Appraisal/appraisal";
import Loan from "../Loan/loan";
import ExtraFunds from "../../Enrollment/ExtraFund/ExtraFunds";
import Bonuses from "../Bouneses/bouneses";
import Tax from "../Tax/Tax"
import axios from "axios";
import { faXmark, faPrint } from "@fortawesome/free-solid-svg-icons";

import SalarySlip from "./SalarySlip";
import ReactDOMServer from "react-dom/server";

import { SERVER_URL } from "../../../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaCheck, FaChevronDown, FaDownload, FaFolderOpen, FaTable, FaThLarge } from "react-icons/fa";

import Allowance from "../Allowances/Allowances";
import WorkingHours from "../Working_Hours/WorkingHours";
import "./employee_profile.css"
import ReactPaginate from "react-paginate";
import ConirmationModal from "../../Modal/conirmationModal";
import addAnimation from "../../../assets/Lottie/addAnim.json";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";
import CompletedSalarySlip from "./CompletedSalarySlip";




const CompletedPayroll = () => {




  const [data, setData] = useState([
    {
      cPayId: "",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [changeTab, setChangeTab] = useState("Completed Payrolls");
  const [activeTab, setActiveTab] = useState("table");
  const activeTabRef = React.useRef(activeTab);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const rowsPerPage = 7;


  // Get selected employees data based on selectedIds
  const selectedEmployees = data.filter(employee =>
    selectedIds?.includes(employee.empId)
  );

  const fetchCompletedPayrolls = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-emp-cmp/`);
      const fetchedData = response.data;
      console.log(response.data);
      setData(fetchedData);
      setEmployees(fetchedData);
    } catch (error) {
      console.error("Error fetching payroll profiles:", error);
    }
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);



  useEffect(() => {
    fetchCompletedPayrolls()
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchCompletedPayrolls, successModal]);


  // Filter data based on search query
  const filteredData = data.filter(
    (item) =>
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.attemptWorkingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dailySalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.basicSalary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salaryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salaryPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalWorkingDays.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalWorkingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalWorkingMinutes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.attemptWorkingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.calculate_pay.toString().includes(searchQuery) ||
      item.dailySalary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current page data
  const currentPageData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allIds = currentPageData.map((row) => row.empId);
      setSelectedIds(allIds);
      console.log(allIds);
    } else {
      setSelectedIds([]);
    }
  };


  const handleRowCheckboxChange = (event, rowId) => {
    const isChecked = event.target.checked;
    const currentIds = [...selectedIds]; // Create a copy of current selected IDs

    if (isChecked) {
      currentIds.push(rowId); // Add the row ID
    } else {
      const index = currentIds.indexOf(rowId);
      if (index > -1) {
        currentIds.splice(index, 1); // Remove the row ID
      }
    }

    setSelectedIds(currentIds); // Dispatch the new array
  };

  useEffect(() => {
    if (selectedIds.length === currentPageData.length && currentPageData.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedIds, currentPageData]);







  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'legal');

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
        overflow: 'linebreak',
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      tableWidth: 'auto',
      didDrawCell: (data) => {
        const { cell } = data;
        doc.setTextColor(0, 0, 0);
        doc.setLineWidth(0.1);
        doc.setDrawColor(0, 0, 0);
        doc.rect(cell.x, cell.y, cell.width, cell.height);
      },
      didDrawPage: (data) => {
        doc.text('Employee Salary Report', 20, 10);
      },
    });

    doc.save("employee-profile.pdf");
  };

  const handleExportPdf = async () => {
    const element = document.querySelector(".salary-slip");
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
    await Promise.all(imagePromises);

    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.8);
    const pdf = new jsPDF("p", "mm", "a4");

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

    setSelectedEmployee(employee);
    setActiveTab("salarySlip");
  };


  const handleCloseSalarySlip = () => {
    setActiveTab("table");
    setSelectedEmployee(null);
  };
  const handleCloseEditedSalarySlip = () => {
    setActiveTab("table");
    setSelectedEmployee(null);
  };

  const generateSalarySlipPDF = (salaryDetails) => {
    return new Promise(async (resolve, reject) => {
      const tempContainer = document.createElement("div");
      try {
        const salarySlipHTML = ReactDOMServer.renderToStaticMarkup(
          <SalarySlip salaryDetails={salaryDetails} />
        );

        tempContainer.innerHTML = salarySlipHTML;
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        document.body.appendChild(tempContainer);

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

        await Promise.all(imagePromises);

        const canvas = await html2canvas(tempContainer, {
          scale: 1.5,
          useCORS: true,
        });

        if (!canvas || !canvas.width || !canvas.height) {
          reject(new Error("Canvas rendering failed"));
          return;
        }

        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const pdf = new jsPDF("p", "mm", "a4");

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

        document.body.removeChild(tempContainer);

        const pdfBlob = pdf.output("blob");
        resolve({
          pdfBlob,
          fileName: `${salaryDetails.empId}-${salaryDetails.empName}-SalarySlip.pdf`,
        });
      } catch (error) {
        document.body.removeChild(tempContainer);
        reject(error);
      }
    });
  };

  const downloadAllSalarySlips = async () => {
    const zip = new JSZip();

    if (!employees || employees.length === 0) {
      console.error("No employees data found.");
      return;
    }

    for (const employee of employees) {
      try {
        const { pdfBlob, fileName } = await generateSalarySlipPDF(employee);
        zip.file(fileName, pdfBlob);
      } catch (error) {
        console.error(
          "Error generating salary slip for",
          employee.empName,
          error
        );
      }
    }

    zip
      .generateAsync({ type: "blob" })
      .then(function (content) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "all_salary_slips.zip";
        link.click();
      })
      .catch((error) => {
        console.error("Error generating ZIP file:", error);
      });
  };


  const PreviewContainer = ({ employee, deductions = {}, bonuses, allowances, taxes, appraisals }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const previewRef = React.useRef();

    useEffect(() => {
      const generatePreview = async () => {
        setIsLoading(true);
        try {
          const canvas = await html2canvas(previewRef.current, {
            scale: 3,
            useCORS: true,
            logging: false,
          });
          setPreviewImage(canvas.toDataURL('image/jpeg', 2));
        } catch (error) {
          console.error('Error generating preview:', error);
        } finally {
          setIsLoading(false);
        }
      };

      generatePreview();
    }, [employee, deductions]);

    // Transform deduction items to match SalarySlip expectations
    const transformDeductions = useMemo(() => ({
      allowances: (deductions.allowances || []).map(item => ({
        ...allowances.find(a => a.id === item.id),
        amount: item.amount,
        allowanceName: item.name
      })),
      bonuses: (deductions.bonuses || []).map(item => ({
        ...bonuses.find(b => b.id === item.id),
        bonusAmount: item.amount,
        bonusName: item.name
      })),
      taxes: (deductions.taxes || []).map(item => ({
        ...taxes.find(t => t.id === item.id),
        amount: item.amount,
        taxName: item.name,
        nature: taxes.find(t => t.id === item.id)?.nature || "fixedamount"
      })),
      appraisals: (deductions.appraisals || []).map(item => ({
        ...appraisals.find(a => a.id === item.id),
        appraisalAmount: item.amount,
        appraisalName: item.name
      }))
    }), [deductions, allowances, bonuses, taxes, appraisals]);

    return (
      <div className="preview-container">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : previewImage ? (
         <img
          src={previewImage}
          />
        ) : (
         <div 
          ref={previewRef} 
          className="preview-viewport"
        >
          <SalarySlip
            salaryDetails={transformDeductions}
            preview // Add this
          />
          </div>
        )}
      </div>
    );
  };



  // State to track selected deductions for each employee





  // Add these state variables at the top of your component
  // With proper API-driven state:
  const [bonuses, setBonuses] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  // const [extraFunds, setExtraFunds] = useState([]);
  // const [loans, setLoans] = useState([]);

  // And use the Redux-selected deductions directly:
  // Memoize derived data

  // Add this useEffect hook for fetching deductions
  useEffect(() => {
    const fetchDeductions = async () => {
      try {
        const [bonusesRes, taxesRes, allowancesRes, appraisalsRes] = await Promise.all([

          axios.get(`${SERVER_URL}pyr-bns/`),
          axios.get(`${SERVER_URL}taxes/`),
          axios.get(`${SERVER_URL}allowances/`),
          axios.get(`${SERVER_URL}pyr-appr/`),
          // axios.get(`${SERVER_URL}pyr-ext/`),
          // axios.get(`${SERVER_URL}pyr-loan/`)

        ]);

        setBonuses(bonusesRes.data);
        setTaxes(taxesRes.data);
        setAllowances(allowancesRes.data);
        setAppraisals(appraisalsRes.data);
        // setExtraFunds(extraFundsRes.data);
        // setLoans(loansRes.data);

        console.log(bonuses, allowances, taxes, appraisals);

      } catch (error) {
        console.error("Error fetching deduction data:", error);
      }
    };

    fetchDeductions();
  }, []);


  // Create options for Select components
  // Memoize options
  const bonusOptions = useMemo(() => bonuses.map(bonus => ({
    value: bonus.id,
    label: `${bonus.bonusName} (${bonus.bonusAmount}Rs)`
  })), [bonuses]);

  const taxOptions = useMemo(() => taxes.map(tax => ({
    value: tax.id,
    label: `${tax.taxName} (${tax.nature === "fixedamount" ? tax.amount + "Rs" : tax.percent + "%"})`,
    type: 'tax'
  })), [taxes]);

  const allowanceOptions = useMemo(() => allowances.map(allowance => ({
    value: allowance.id,
    label: `${allowance.allowanceName} (${allowance.amount}Rs)`,
    type: 'allowance'
  })), [allowances]);

  const appraisalOptions = useMemo(() => appraisals.map(appr => ({
    value: appr.id,
    label: `${appr.name} (${appr.appraisal_amount}Rs)`,
    type: 'appraisal'
  })), [appraisals]);




  const renderTabContent = () => {
    switch (changeTab) {
      case "Working Hours":
        return <WorkingHours />;
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
      case "Taxes":
        return <Tax />;
      case "Allowances":
        return <Allowance />;

      default:
        return (
          <>
            {(() => {
              switch (activeTab) {
                case "table":
                  return (
                    <>
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
                            type="button"
                            onClick={() => setSearchQuery("")}
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

                        <div className="tabs card-table-toggle">
                          <button
                            className={`card-view-123 toggle- ${activeTab === 'table' ? 'active' : ''}`}
                            onClick={handleTableActiveTab}
                          >
                            <FaTable />
                          </button>
                          <button
                            className={`table-view-123 toggle-button ${activeTab === 'gallery' ? 'active' : ''}`}
                            onClick={handleGalleryActiveTab}
                          >
                            <FaThLarge />
                          </button>
                        </div>

                        <div className="add-delete-container add-delete-emp">

                          <div className="export-dropdown-container ">
                            <button
                              className="add-button export-button"
                              onMouseEnter={() => setShowExportDropdown(true)}
                              onMouseLeave={() => setShowExportDropdown(false)}
                            >
                              <FaDownload className="button-icon" />
                              Export Data
                              <FaChevronDown className="dropdown-chevron" />

                            </button>
                            {showExportDropdown && (
                              <div
                                className="export-dropdown-menu"
                                onMouseEnter={() => setShowExportDropdown(true)}
                                onMouseLeave={() => setShowExportDropdown(false)}
                              >
                                <button
                                  className="dropdown-item"
                                  onClick={downloadAllSalarySlips}
                                >
                                  <FaFolderOpen className="dropdown-icon" />
                                  All Salary Slips
                                </button>

                                <CSVLink
                                  data={filteredData}
                                  filename="employee-profile.csv"
                                  style={{ textDecoration: 'none' }}
                                >
                                  <button
                                    className="dropdown-item"
                                  >
                                    <FontAwesomeIcon icon={faFileCsv} className="dropdown-icon" />
                                    Export to CSV
                                  </button>
                                </CSVLink>

                                <button
                                  className="dropdown-item"
                                  onClick={exportToPDF}
                                >
                                  <FontAwesomeIcon icon={faFilePdf} className="dropdown-icon" />
                                  Export to PDF
                                </button>

                              </div>

                            )}
                          </div>
                        </div>
                      </div>

                      <div className="department-table">
                        <div className="departments-table">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>
                                  <input
                                    id="delete-checkbox"
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                  />
                                </th>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Overtime Pay</th>
                                <th>Overtime Hours</th>
                                <th>Extra Fund</th>
                                <th>Advance Salary</th>
                                <th>Appraisals</th>
                                <th>Bonus</th>
                                <th>Alowance</th>
                                <th>Tax</th>
                                <th>Loan</th>
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
                                <tr key={item.cPayId}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      id="delete-checkbox"
                                      checked={selectedIds.includes(item.empId)}
                                      onChange={(event) => handleRowCheckboxChange(event, item.empId)}
                                    />
                                  </td>
                                  <td>{item.empId}</td>
                                  <td>{item.empName}</td>
                                  <td>{item.otHoursPay}</td>
                                  <td>{item.otHours}</td>
                                  <td>{item.extraFund}</td>
                                  <td>{item.advSalary}</td>
                                  <td>{parseFloat(item.app || 0) +
                                    (Array.isArray(item.appraisal_items)
                                      ? item.appraisal_items.reduce((total, i) => total + parseFloat(i.amount || 0), 0)
                                      : 0)
                                  }
                                  </td>
                                  <td>
                                    {parseFloat(item.bonus || 0) +
                                      (Array.isArray(item.bonus_items)
                                        ? item.bonus_items.reduce((total, i) => total + parseFloat(i.amount || 0), 0)
                                        : 0)}
                                  </td>
                                  <td>
                                    {parseFloat(item.allowance || 0) +
                                      (Array.isArray(item.allowance_items)
                                        ? item.allowance_items.reduce((total, i) => total + parseFloat(i.amount || 0), 0)
                                        : 0)}
                                  </td>
                                  <td>
                                    {parseFloat(item.taxes || 0) +
                                      (Array.isArray(item.tax_items)
                                        ? item.tax_items.reduce((total, i) => total + parseFloat(i.amount || 0), 0)
                                        : 0)}
                                  </td>
                                  <td>{item.loan}</td>
                                  <td>{item.salaryPeriod}</td>
                                  <td>{item.basicSalary}</td>
                                  <td>{item.salaryType}</td>
                                  <td>{item.totalWorkingDays}</td>
                                  <td>{item.totalWorkingMinutes}</td>
                                  <td>{item.attempt_working_hours}</td>
                                  <td>{item.dailySalary}</td>
                                  <td>{item.calcPay || item.calculate_pay}</td>
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
                        <div className="pagination">
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={Math.ceil(filteredData.length / rowsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageChange}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                          />
                        </div>
                      </div>
                    </>
                  );



                case "gallery":
                  // Group employees by month-year using from_date
                  const groupedEmployees = currentPageData.reduce((acc, employee) => {
                    const dateString = employee.from_date || employee.end_date; // Fallback to end_date if needed
                    const monthYear = dateString
                      ? new Date(dateString).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric'
                      })
                      : "Current Period";

                    if (!acc[monthYear]) acc[monthYear] = [];
                    acc[monthYear].push(employee);
                    return acc;
                  }, {});

                  // Sort groups chronologically
                  const sortedGroups = Object.entries(groupedEmployees).sort((a, b) => {
                    const dateA = new Date(a[0]);
                    const dateB = new Date(b[0]);
                    return dateB - dateA;
                  });

                  return (
                    <>
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
                            type="button"
                            onClick={() => setSearchQuery("")}
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

                        <div className="tabs card-table-toggle">
                          <button
                            className={`card-view-123 toggle- ${activeTab === 'table' ? 'active' : ''}`}
                            onClick={handleTableActiveTab}
                          >
                            <FaTable />
                          </button>
                          <button
                            className={`table-view-123 toggle-button ${activeTab === 'gallery' ? 'active' : ''}`}
                            onClick={handleGalleryActiveTab}
                          >
                            <FaThLarge />
                          </button>
                        </div>

                        <div className="add-delete-container add-delete-emp">

                          <div className="export-dropdown-container ">
                            <button
                              className="add-button export-button"
                              onMouseEnter={() => setShowExportDropdown(true)}
                              onMouseLeave={() => setShowExportDropdown(false)}
                            >
                              <FaDownload className="button-icon" />
                              Export Data
                              <FaChevronDown className="dropdown-chevron" />

                            </button>
                            {showExportDropdown && (
                              <div
                                className="export-dropdown-menu"
                                onMouseEnter={() => setShowExportDropdown(true)}
                                onMouseLeave={() => setShowExportDropdown(false)}
                              >
                                <button
                                  className="dropdown-item"
                                  onClick={downloadAllSalarySlips}
                                >
                                  <FaFolderOpen className="dropdown-icon" />
                                  All Salary Slips
                                </button>

                                <CSVLink
                                  data={filteredData}
                                  filename="employee-profile.csv"
                                  style={{ textDecoration: 'none' }}
                                >
                                  <button
                                    className="dropdown-item"
                                  >
                                    <FontAwesomeIcon icon={faFileCsv} className="dropdown-icon" />
                                    Export to CSV
                                  </button>
                                </CSVLink>

                                <button
                                  className="dropdown-item"
                                  onClick={exportToPDF}
                                >
                                  <FontAwesomeIcon icon={faFilePdf} className="dropdown-icon" />
                                  Export to PDF
                                </button>

                              </div>

                            )}
                          </div>
                        </div>
                      </div>

                      <div className="gallery-container">
                        {sortedGroups.map(([monthYear, employees], groupIndex) => (
                          <div key={monthYear}>
                            <div className="month-group">
                              <div className="month-header">
                                <h3 className="month-title">{monthYear}</h3>
                                <hr className="month-divider" />
                              </div>
                              <div className="salary-slips-grid">
                                {employees.map((employee) => {
                                  // Prepare deductions data for PreviewContainer
                                  const deductions = {
                                    allowances: employee.allowance_items || [],
                                    bonuses: employee.bonus_items || [],
                                    taxes: employee.tax_items || [],
                                    appraisals: employee.appraisal_items || []
                                  };

                                  return (
                                    <div
                                      key={employee.cPayId}
                                      className="salary-slip-card"
                                      onClick={() => handleOpenSalarySlip(employee)}
                                    >
                                      <div className="preview-header">
                                        <h4>{employee.empName}</h4>
                                        <small>{employee.empId}</small>
                                      </div>
                                      <PreviewContainer
                                        employee={employee}
                                        deductions={deductions}
                                        allowances={allowances}
                                        bonuses={bonuses}
                                        taxes={taxes}
                                        appraisals={appraisals}
                                      />
                                      <div className="preview-footer">
                                        <span>Basic: Rs. {employee.basicSalary}</span>
                                        <span>Net: Rs. {employee.calculate_pay}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            {groupIndex < sortedGroups.length - 1 && <hr />}
                          </div>
                        ))}
                      </div>
                    </>
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
                            <button onClick={handleCloseEditedSalarySlip}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                        </div>
                        <CompletedSalarySlip salaryDetails={selectedEmployee} />
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



  const handleTableActiveTab = () => {
    setActiveTab('table')
  }
  const handleGalleryActiveTab = () => {
    setActiveTab('gallery')
  }
  const handleSalarySlipActiveTab = () => {
    setActiveTab('salarySlip')
  }

  return (
    <>
      <div className="settings-page">
        <div className="tabs" id="emp-profile-tabs">
          <button
            className={`${changeTab === "Completed Payrolls" ? "active" : ""}`}
            onClick={() => setChangeTab("Completed Payrolls")}
          >
            Completed Payrolls
          </button>
          <button
            className={`${changeTab === "Working Hours" ? "active" : ""}`}
            onClick={() => setChangeTab("Working Hours")}
          >
            Working Hours
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
          <button
            className={`${changeTab === "Taxes" ? "active" : ""}`}
            onClick={() => setChangeTab("Taxes")}
          >
            Taxes
          </button>
          <button
            className={`${changeTab === "Allowances" ? "active" : ""}`}
            onClick={() => setChangeTab("Allowances")}
          >
            Allowances
          </button>
        </div>
        <div className="tab-content">
          {/* Regular confirmation modal for general actions */}
          <ConirmationModal
            isOpen={showModal}
            message={
              modalType === "close all payrolls"
                ? "Are you sure you want to close all existing payrolls? This action cannot be undone."
                : `Are you sure you want to ${modalType} this Employee?`
            }
            onConfirm={() => {
              // if (modalType === "close all payrolls") confirmCloseAllPayrolls();
            }}
            onCancel={() => setShowModal(false)}
            animationData={
              modalType === "create"
                ? addAnimation
                : modalType === "update"
                  ? updateAnimation
                  : deleteAnimation
            }
          />

          {/* Success modal */}
          <ConirmationModal
            isOpen={successModal}
            message={resMsg}
            onConfirm={() => setSuccessModal(false)}
            onCancel={() => setSuccessModal(false)}
            animationData={successAnimation}
            successModal={successModal}
          />

          {/* Warning modal */}
          <ConirmationModal
            isOpen={warningModal}
            message={resMsg}
            onConfirm={() => setWarningModal(false)}
            onCancel={() => setWarningModal(false)}
            animationData={warningAnimation}
            warningModal={warningModal}
          />



          {renderTabContent()}
        </div>
      </div>
    </>
  );
};


export default CompletedPayroll;
