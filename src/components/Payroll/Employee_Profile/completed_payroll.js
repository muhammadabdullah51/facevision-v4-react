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

import ReactDOMServer from "react-dom/server";

import { SERVER_URL } from "../../../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaChevronDown, FaDownload, FaEdit, FaFolderOpen, FaTable, FaThLarge } from "react-icons/fa";

import Allowance from "../Allowances/Allowances";
import WorkingHours from "../Working_Hours/WorkingHours";
import "./employee_profile.css"
import ReactPaginate from "react-paginate";
import ConirmationModal from "../../Modal/conirmationModal";
import updateAnimation from "../../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../../assets/Lottie/successAnim.json";
import warningAnimation from "../../../assets/Lottie/warningAnim.json";
import CompletedSalarySlip from "./CompletedSalarySlip";




const CompletedPayroll = () => {




  const [data, setData] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [callEmployees, setCallEmployees] = useState([]);


  const [editFormData, setEditFormData] = useState(
    {
      empId: "",
      from_date: "",
      end_date: "",
      empName: "",
      department: "",
      bankName: "",
      accountNo: "",
      salaryType: "",
      salaryPeriod: "",
      basicSalary: "",
      otHours: "",
      otHoursPay: "",
      advSalary: "",
      loan: "",
      bonus: "",
      allowance: "",
      taxes: "",
      extraFund: "",
      app: "",
      dailySalary: "",
      calculate_pay: "",
      totalWorkingDays: "",
      totalWorkingHours: "",
      totalWorkingMinutes: "",
      attemptWorkingHours: "",
      attempt_working_hours: "",
      filteredAllowance: [],
      filteredBonus: [],
      filteredTax: [],
      filteredAppraisals: []
    })






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


  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pr-emp/`);
      setCallEmployees(response.data);
      console.log(callEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, [])

  useEffect(() => {
    fetchCompletedPayrolls();
    fetchEmployees();
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [fetchCompletedPayrolls, fetchEmployees, successModal]);


  // Filter data based on search query
  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    // Check top-level fields
    const basicMatch =
      String(item.empId).toLowerCase().includes(query) ||
      String(item.empName).toLowerCase().includes(query) ||
      String(item.attemptWorkingHours).toLowerCase().includes(query) ||
      String(item.dailySalary).toLowerCase().includes(query) ||
      String(item.basicSalary).toLowerCase().includes(query) ||
      String(item.salaryType).toLowerCase().includes(query) ||
      String(item.salaryPeriod).toLowerCase().includes(query) ||
      String(item.bankName).toLowerCase().includes(query) ||
      String(item.accountNo).toLowerCase().includes(query) ||
      String(item.totalWorkingDays).toLowerCase().includes(query) ||
      String(item.totalWorkingHours).toLowerCase().includes(query) ||
      String(item.totalWorkingMinutes).toLowerCase().includes(query) ||
      String(item.calculate_pay).toLowerCase().includes(query);

    // Check nested arrays
    const allowanceMatch = item.allowance_items?.some(a =>
      String(a.name).toLowerCase().includes(query) ||
      String(a.amount).includes(searchQuery) // Direct string comparison for amounts
    );

    const bonusMatch = item.bonus_items?.some(b =>
      String(b.name).toLowerCase().includes(query) ||
      String(b.amount).includes(searchQuery)
    );

    const taxMatch = item.tax_items?.some(t =>
      String(t.name).toLowerCase().includes(query) ||
      String(t.amount).includes(searchQuery)
    );

    const appraisalMatch = item.appraisal_items?.some(app =>
      String(app.name).toLowerCase().includes(query) ||
      String(app.amount).includes(searchQuery)
    );

    return basicMatch || allowanceMatch || bonusMatch || taxMatch || appraisalMatch;
  });

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







  // const exportToPDF = () => {
  //   const doc = new jsPDF('l', 'mm', 'legal');

  //   doc.autoTable({
  //     head: [
  //       [
  //         "Serial No",
  //         "Employee ID",
  //         "Employee Name",
  //         "Overtime Pay",
  //         "Overtime Hours",
  //         "Extra Fund",
  //         "Advance Salary",
  //         "Appraisals",
  //         "Loan",
  //         "Bonus",
  //         "Allowances",
  //         "Taxes",
  //         "Salary Period",
  //         "Bank Name",
  //         "Account Number",
  //         "Basic Salary",
  //         "Salary Type",
  //         "Total Working Days",
  //         "Total Working Hours",
  //         "Total Working Minutes",
  //         "Attempt Working Hours",
  //         "Daily Salary",
  //         "Pay",
  //       ],
  //     ],
  //     body: filteredData.map((item, index) => [
  //       index + 1,
  //       item.empId,
  //       item.empName,
  //       item.otHoursPay,
  //       item.otHours,
  //       item.extraFund,
  //       item.advSalary,
  //       item.app,
  //       item.loan,
  //       item.bonus,
  //       item.allowances,
  //       item.taxes,
  //       item.salaryPeriod,
  //       item.bankName,
  //       item.accountNo,
  //       item.basicSalary,
  //       item.salaryType,
  //       item.totalWorkingDays,
  //       item.totalWorkingHours,
  //       item.totalWorkingMinutes,
  //       item.attemptWorkingHours,
  //       item.dailySalary,
  //       item.calcPay,
  //     ]),
  //     styles: {
  //       overflow: 'linebreak',
  //       fontSize: 8,
  //       cellPadding: 2,
  //       lineWidth: 0.1,
  //       lineColor: [0, 0, 0],
  //     },
  //     tableWidth: 'auto',
  //     didDrawCell: (data) => {
  //       const { cell } = data;
  //       doc.setTextColor(0, 0, 0);
  //       doc.setLineWidth(0.1);
  //       doc.setDrawColor(0, 0, 0);
  //       doc.rect(cell.x, cell.y, cell.width, cell.height);
  //     },
  //     didDrawPage: (data) => {
  //       doc.text('Employee Salary Report', 20, 10);
  //     },
  //   });

  //   doc.save("completed-payrolls.pdf");
  // };


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
          "Allowances",
          "Taxes",
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
        // Appraisals
        `${item.app || '0'}${item.appraisal_items?.length > 0 ?
          ` + ${item.appraisal_items.map(i => i.amount).join(', ')}` : ''}`,
        item.loan,
        // Bonus
        `${item.bonus || '0'}${item.bonus_items?.length > 0 ?
          ` + ${item.bonus_items.map(i => i.amount).join(', ')}` : ''}`,
        // Allowances
        `${item.allowance || '0'}${item.allowance_items?.length > 0 ?
          ` + ${item.allowance_items.map(i => i.amount).join(', ')}` : ''}`,
        // Taxes
        `${item.taxes || '0'}${item.tax_items?.length > 0 ?
          ` + ${item.tax_items.map(i => i.amount).join(', ')}` : ''}`,
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
        item.calculate_pay,  // Changed from calcPay to calculate_pay to match your state
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

    doc.save("completed-payrolls.pdf");
  };

  const csvData = useMemo(() => {
    // const joinAmounts = (arr) =>
    //   Array.isArray(arr) && arr.length
    //     ? arr.map(i => i.amount).join(' + ')
    //     : '0';

    return filteredData.map((item, index) => ({
      "Serial No": index + 1,
      "Employee ID": item.empId,
      "Employee Name": item.empName,
      "Overtime Pay": item.otHoursPay,
      "Overtime Hours": item.otHours,
      "Extra Fund": item.extraFund,
      "Advance Salary": item.advSalary,
      "Appraisals": `${item.app || '0'}${item.appraisal_items?.length > 0
        ? ` + ${item.appraisal_items.map(i => i.amount).join(', ')}`
        : ''}`,
      "Loan": item.loan,
      "Bonus": `${item.bonus || '0'}${item.bonus_items?.length > 0
        ? ` + ${item.bonus_items.map(i => i.amount).join(', ')}`
        : ''}`,
      "Allowances": `${item.allowance || '0'}${item.allowance_items?.length > 0
        ? ` + ${item.allowance_items.map(i => i.amount).join(', ')}`
        : ''}`,
      "Taxes": `${item.taxes || '0'}${item.tax_items?.length > 0
        ? ` + ${item.tax_items.map(i => i.amount).join(', ')}`
        : ''}`,
      "Salary Period": item.salaryPeriod,
      "Bank Name": item.bankName,
      "Account Number": item.accountNo,
      "Basic Salary": item.basicSalary,
      "Salary Type": item.salaryType,
      "Total Working Days": item.totalWorkingDays,
      "Total Working Hours": item.totalWorkingHours,
      "Total Working Minutes": item.totalWorkingMinutes,
      "Attempt Working Hours": item.attemptWorkingHours,
      "Daily Salary": item.dailySalary,
      "Pay": item.calculate_pay,
    }));
  }, [filteredData]);



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


  // const handleCloseSalarySlip = () => {
  //   setActiveTab("table");
  //   setSelectedEmployee(null);
  // };
  const handleCloseEditedSalarySlip = () => {
    setActiveTab("table");
    setSelectedEmployee(null);
  };

  // const generateSalarySlipPDF = (salaryDetails) => {
  //   return new Promise(async (resolve, reject) => {
  //     const tempContainer = document.createElement("div");
  //     try {
  //       const salarySlipHTML = ReactDOMServer.renderToStaticMarkup(
  //         <SalarySlip salaryDetails={salaryDetails} />
  //       );

  //       tempContainer.innerHTML = salarySlipHTML;
  //       tempContainer.style.position = "absolute";
  //       tempContainer.style.left = "-9999px";
  //       document.body.appendChild(tempContainer);

  //       const images = tempContainer.querySelectorAll("img");
  //       const imagePromises = Array.from(images).map((img) => {
  //         return new Promise((resolve, reject) => {
  //           if (img.complete) {
  //             resolve();
  //           } else {
  //             img.onload = resolve;
  //             img.onerror = reject;
  //           }
  //         });
  //       });

  //       await Promise.all(imagePromises);

  //       const canvas = await html2canvas(tempContainer, {
  //         scale: 1.5,
  //         useCORS: true,
  //       });

  //       if (!canvas || !canvas.width || !canvas.height) {
  //         reject(new Error("Canvas rendering failed"));
  //         return;
  //       }

  //       const imgData = canvas.toDataURL("image/jpeg", 0.8);
  //       const pdf = new jsPDF("p", "mm", "a4");

  //       const pageWidth = pdf.internal.pageSize.getWidth();
  //       const pageHeight = pdf.internal.pageSize.getHeight();
  //       const canvasAspectRatio = canvas.width / canvas.height;
  //       const pdfAspectRatio = pageWidth / pageHeight;

  //       let imgWidth, imgHeight;
  //       if (canvasAspectRatio > pdfAspectRatio) {
  //         imgWidth = pageWidth;
  //         imgHeight = pageWidth / canvasAspectRatio;
  //       } else {
  //         imgHeight = pageHeight;
  //         imgWidth = pageHeight * canvasAspectRatio;
  //       }

  //       const x = (pageWidth - imgWidth) / 2;
  //       const y = (pageHeight - imgHeight) / 2;

  //       pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);

  //       document.body.removeChild(tempContainer);

  //       const pdfBlob = pdf.output("blob");
  //       resolve({
  //         pdfBlob,
  //         fileName: `${salaryDetails.empId}-${salaryDetails.empName}-SalarySlip.pdf`,
  //       });
  //     } catch (error) {
  //       document.body.removeChild(tempContainer);
  //       reject(error);
  //     }
  //   });
  // };

  const generateSalarySlipPDF = (salaryDetails) => {
  return new Promise(async (resolve, reject) => {
    const tempContainer = document.createElement("div");
    let appended = false;

    try {
      const salarySlipHTML = ReactDOMServer.renderToStaticMarkup(
        <CompletedSalarySlip salaryDetails={salaryDetails} />
      );

      tempContainer.innerHTML = salarySlipHTML;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);
      appended = true;

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
        throw new Error("Canvas rendering failed");
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
      const pdfBlob = pdf.output("blob");

      resolve({
        pdfBlob,
        fileName: `${salaryDetails.empId}-${salaryDetails.empName}-Completed-SalarySlip.pdf`,
      });
    } catch (error) {
      reject(error);
    } finally {
      if (appended && tempContainer.parentNode === document.body) {
        document.body.removeChild(tempContainer);
      }
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
        link.download = "all_completed_salary_slips.zip";
        link.click();
      })
      .catch((error) => {
        console.error("Error generating ZIP file:", error);
      });
  };


  const PreviewContainer = ({ employee, deductions = {} }) => {
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



    return (
      <div className="preview-container">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : previewImage ? (
          <img
            src={previewImage}
            alt={`${employee.empName} salary slip preview`}
            className="preview-thumbnail"
          />
        ) : (
          <div ref={previewRef} className="preview-viewport">
            <CompletedSalarySlip
              salaryDetails={employee}
              preview
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


  // Add this useEffect hook for fetching deductions
  useEffect(() => {
    const fetchDeductions = async () => {
      try {
        const [bonusesRes, taxesRes, allowancesRes, appraisalsRes] = await Promise.all([

          axios.get(`${SERVER_URL}pyr-bns/`),
          axios.get(`${SERVER_URL}taxes/`),
          axios.get(`${SERVER_URL}allowances/`),
          axios.get(`${SERVER_URL}pyr-appr/`),

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




  const [newCalculatePay, setNewCalculatePay] = useState(null);
  const [originalValues, setOriginalValues] = useState({
    allowances: [],
    bonuses: [],
    taxes: [],
    appraisals: []
  });

  const handleEdit = (item) => {
    const original = {
      allowances: item.allowance_items?.map(a => parseFloat(a.amount)) || [],
      bonuses: item.bonus_items?.map(b => parseFloat(b.amount)) || [],
      taxes: item.tax_items?.map(t => parseFloat(t.amount)) || [],
      appraisals: item.appraisal_items?.map(app => parseFloat(app.amount)) || []
    };

    setOriginalValues(original);
    setNewCalculatePay(null)

    setEditFormData({
      empId: item.empId,
      empName: item.empName,
      calculate_pay: item.calculate_pay,
      filteredAllowance: item.allowance_items?.map(a => ({ amount: parseFloat(a.amount) })) || [],
      filteredBonus: item.bonus_items?.map(b => ({ amount: parseFloat(b.amount) })) || [],
      filteredTax: item.tax_items?.map(t => ({ amount: parseFloat(t.amount) })) || [],
      filteredAppraisals: item.appraisal_items?.map(app => ({ amount: parseFloat(app.amount) })) || [],
      from_date: item.from_date,
      end_date: item.end_date,
      department: item.department,
      bankName: item.bankName,
      accountNo: item.accountNo,
      salaryType: item.salaryType,
      salaryPeriod: item.salaryPeriod,
      basicSalary: item.basicSalary,
      otHours: item.otHours,
      otHoursPay: item.otHoursPay,
      advSalary: item.advSalary,
      loan: item.loan,
      bonus: item.bonus,
      allowance: item.allowance,
      taxes: item.taxes,
      extraFund: item.extraFund,
      app: item.app,
      dailySalary: item.dailySalary,
      calculate_pay: item.calculate_pay,
      totalWorkingDays: item.totalWorkingDays,
      totalWorkingHours: item.totalWorkingHours,
      totalWorkingMinutes: item.totalWorkingMinutes,
      attemptWorkingHours: item.attemptWorkingHours,
      attempt_working_hours: item.attempt_working_hours,
    });
    setShowEditForm(true);
  };
  const updateAssign = () => {
    setModalType("update");
    setEditFormData({ ...editFormData });
    setShowModal(true);
  };
  const confirmUpdate = async () => {
    if (!editFormData.empId) {
      setResMsg("Please fill in all required fields.");
      setShowModal(false);
      setWarningModal(true);
      return;
    }
    console.log(editFormData);
    const payload = {
      ...editFormData, calculate_pay: newCalculatePay
    }
    console.log(payload);
    await axios.put(`${SERVER_URL}pyr-emp-cmp/`, payload);

    setShowModal(false);
    setSuccessModal(true);
    setShowEditForm(false);
    fetchCompletedPayrolls(); // replace with your actual fetch function
    handleReset();
  };
  const handleReset = () => {
    setEditFormData({
      empId: "",
      from_date: "",
      end_date: "",
      empName: "",
      department: "",
      bankName: "",
      accountNo: "",
      salaryType: "",
      salaryPeriod: "",
      basicSalary: "",
      otHours: "",
      otHoursPay: "",
      advSalary: "",
      loan: "",
      bonus: "",
      allowance: "",
      taxes: "",
      extraFund: "",
      app: "",
      dailySalary: "",
      calculate_pay: "",
      totalWorkingDays: "",
      totalWorkingHours: "",
      totalWorkingMinutes: "",
      attemptWorkingHours: "",
      attempt_working_hours: "",
      filteredAllowance: [],
      filteredBonus: [],
      filteredTax: [],
      filteredAppraisals: []
    },
    );
    setNewCalculatePay(null)
    setShowEditForm(false);
  };


  // Modified calculate function
  const calculateNewTotal = () => {
    let totalDelta = 0;

    // Calculate allowance deltas
    editFormData.filteredAllowance.forEach((allowance, index) => {
      const original = originalValues.allowances[index] || 0;
      const current = parseFloat(allowance.amount) || 0;
      totalDelta += (current - original);
    });

    // Calculate bonus deltas
    editFormData.filteredBonus.forEach((bonus, index) => {
      const original = originalValues.bonuses[index] || 0;
      const current = parseFloat(bonus.amount) || 0;
      totalDelta += (current - original);
    });

    // Calculate appraisal deltas
    editFormData.filteredAppraisals.forEach((appraisal, index) => {
      const original = originalValues.appraisals[index] || 0;
      const current = parseFloat(appraisal.amount) || 0;
      totalDelta += (current - original);
    });

    // Calculate tax deltas (subtract since taxes reduce pay)
    editFormData.filteredTax.forEach((tax, index) => {
      const original = originalValues.taxes[index] || 0;
      const current = parseFloat(tax.amount) || 0;
      totalDelta -= (current - original);
    });

    const newPay = (
      parseFloat(editFormData.calculate_pay) +
      totalDelta
    ).toFixed(2);

    setNewCalculatePay(newPay);
  };

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
                                  data={csvData}
                                  headers={Object.keys(csvData[0] || {}).map(key => ({ label: key, key }))}
                                  filename="completed-payrolls.csv"
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
                        {showEditForm && (
                          <div className="add-leave-form">
                            <h3>Update Completed Payroll</h3>

                            {/* Employee Information */}
                            <div className="form-section">
                              <div className="form-row">
                                <label>Selected Employee</label>
                                <input
                                  type="text"
                                  placeholder="Employee ID"
                                  value={`${editFormData.empId} ${editFormData.empName}`}
                                  onChange={(e) => setEditFormData({ ...editFormData, empId: e.target.value })}
                                  required
                                />
                              </div>
                            </div>

                            {/* Allowances Section */}
                            <div className="form-section">
                              <label>Allowances</label>
                              {editFormData.filteredAllowance.map((allowance, index) => (
                                <div className="form-row" key={index}>
                                  <input
                                    type="number"
                                    className="form-input"
                                    placeholder={`Allowance #${index + 1}`}
                                    value={allowance.amount}
                                    onChange={(e) => {
                                      const newAllowances = [...editFormData.filteredAllowance];
                                      newAllowances[index].amount = e.target.value;
                                      setEditFormData({ ...editFormData, filteredAllowance: newAllowances });
                                      setNewCalculatePay(null);
                                    }}
                                    step="0.01"
                                  />
                                  <span className="original-value">
                                    (Original: {originalValues.allowances[index] || 0})
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Bonuses Section */}
                            <div className="form-section">
                              <label>Bonuses</label>
                              {editFormData.filteredBonus.map((bonus, index) => (
                                <div className="form-row" key={index}>
                                  <input
                                    type="number"
                                    className="form-input"
                                    placeholder={`Bonus #${index + 1}`}
                                    value={bonus.amount}
                                    onChange={(e) => {
                                      const newBonuses = [...editFormData.filteredBonus];
                                      newBonuses[index].amount = e.target.value;
                                      setEditFormData({ ...editFormData, filteredBonus: newBonuses });
                                      setNewCalculatePay(null);
                                    }}
                                    step="0.01"
                                  />
                                  <span className="original-value">
                                    (Original: {originalValues.bonuses[index] || 0})
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Taxes Section */}
                            <div className="form-section">
                              <label>Taxes</label>
                              {editFormData.filteredTax.map((tax, index) => (
                                <div className="form-row" key={index}>
                                  <input
                                    type="number"
                                    className="form-input"
                                    placeholder={`Tax #${index + 1}`}
                                    value={tax.amount}
                                    onChange={(e) => {
                                      const newTaxes = [...editFormData.filteredTax];
                                      newTaxes[index].amount = e.target.value;
                                      setEditFormData({ ...editFormData, filteredTax: newTaxes });
                                      setNewCalculatePay(null);
                                    }}
                                    step="0.01"
                                  />
                                  <span className="original-value">
                                    (Original: {originalValues.taxes[index] || 0})
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Appraisals Section */}
                            <div className="form-section">
                              <label>Appraisals</label>
                              {editFormData.filteredAppraisals.map((appraisal, index) => (
                                <div className="form-row" key={index}>
                                  <input
                                    type="number"
                                    className="form-input"
                                    placeholder={`Appraisal #${index + 1}`}
                                    value={appraisal.amount}
                                    onChange={(e) => {
                                      const newAppraisals = [...editFormData.filteredAppraisals];
                                      newAppraisals[index].amount = e.target.value;
                                      setEditFormData({ ...editFormData, filteredAppraisals: newAppraisals });
                                      setNewCalculatePay(null);
                                    }}
                                    step="0.01"
                                  />
                                  <span className="original-value">
                                    (Original: {originalValues.appraisals[index] || 0})
                                  </span>
                                </div>
                              ))}

                            </div>

                            <div className="form-section">
                              <div className="form-row">
                                <label>Original Net Pay</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={editFormData.calculate_pay}
                                  disabled
                                  step="0.01"
                                />
                              </div>
                            </div>

                            <div className="form-section">
                              <div className="form-row">
                                <button
                                  type="button"
                                  className="add-button"
                                  style={{ margin: '0' }}
                                  onClick={calculateNewTotal}
                                >
                                  Calculate New Net Pay
                                </button>
                              </div>
                            </div>

                            {newCalculatePay !== null && (
                              <>
                                <div className="form-section">
                                  <div className="form-row">
                                    <label>New Calculated Net Pay</label>
                                    <input
                                      type="number"
                                      className="form-input"
                                      value={newCalculatePay}
                                      disabled
                                      step="0.01"
                                    />
                                  </div>
                                </div>





                                <div className="form-actions">
                                  <button className="submit-button" onClick={() => updateAssign(editFormData)}>
                                    Update Payroll
                                  </button>
                                  <button className="cancel-button" onClick={handleReset}>
                                    Cancel
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        <div className="departments-table">
                          <table className="table pyr-table">
                            <thead>
                              <tr>
                                
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
                                <th>Action</th>
                                <th>Salary Slip</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((item, index) => (
                                <tr key={item.cPayId}>
                                 
                                  <td>{item.empId}</td>
                                  <td>{item.empName}</td>
                                  <td>{item.otHoursPay}</td>
                                  <td>{item.otHours}</td>
                                  <td>{item.extraFund}</td>
                                  <td>{item.advSalary}</td>
                                  <td>
                                    {`${item.app || '0'}${Array.isArray(item.appraisal_items) && item.appraisal_items.length > 0
                                      ? ` + ${item.appraisal_items.map(i => i.amount).join(', ')}`
                                      : ''
                                      }`}
                                  </td>
                                  <td>
                                    {`${item.bonus || '0'}${Array.isArray(item.bonus_items) && item.bonus_items.length > 0
                                      ? ` + ${item.bonus_items.map(i => i.amount).join(', ')}`
                                      : ''
                                      }`}
                                  </td>
                                  <td>
                                    {`${item.allowance || '0'}${Array.isArray(item.allowance_items) && item.allowance_items.length > 0
                                      ? ` + ${item.allowance_items.map(i => i.amount).join(', ')}`
                                      : ''
                                      }`}
                                  </td>
                                  <td>
                                    {`${item.taxes || '0'}${Array.isArray(item.tax_items) && item.tax_items.length > 0
                                      ? ` + ${item.tax_items.map(i => i.amount).join(', ')}`
                                      : ''
                                      }`}
                                  </td>
                                  <td>{item.loan}</td>
                                  <td>{item.salaryPeriod}</td>
                                  <td>{item.basicSalary}</td>
                                  <td>{item.salaryType}</td>
                                  <td>{item.totalWorkingDays}</td>
                                  <td>{item.totalWorkingMinutes}</td>
                                  <td>{item.attempt_working_hours}</td>
                                  <td>{item.dailySalary}</td>
                                  <td>{item.calculate_pay}</td>
                                  <td>
                                    <button
                                      // className="edit-button"
                                      onClick={() => handleEdit(item)}
                                      style={{ background: "none", border: "none" }}
                                    >
                                      <FaEdit className="table-edit" />
                                    </button>
                                  </td>
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
  // const handleSalarySlipActiveTab = () => {
  //   setActiveTab('salarySlip')
  // }

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
              modalType === "create"
                ? `Are you sure you want to confirm Assign Tax?`
                : modalType === "update"
                  ? "Are you sure you want to update Assigned Tax?"
                  : modalType === "delete selected"
                    ? "Are you sure you want to delete selected items?"
                    : `Are you sure you want to delete Assigned Tax?`
            }
            onConfirm={() => {
              if (modalType === "update") confirmUpdate();
              // else confirmBulkDelete();

            }}
            onCancel={() => setShowModal(false)}
            animationData={
              modalType === "update"
                ? updateAnimation
                : deleteAnimation
            }
          />
          <ConirmationModal
            isOpen={successModal}
            message={
              modalType === "delete selected"
                ? "Selected items deleted successfully!"
                : `Assign Tax ${modalType}d successfully!`
            }
            onConfirm={() => setSuccessModal(false)}
            onCancel={() => setSuccessModal(false)}
            animationData={successAnimation}
            successModal={successModal}
          />
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
