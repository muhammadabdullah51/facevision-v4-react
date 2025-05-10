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
import MarkAsCompletedModal from "./MarkAsCompletedModal";
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setSelectedIds, setSelectedDeductions, resetState } from '../../../redux/empProfileSlice';
import EditedSalarySlip from "./EditedSalarySlip";


const calculateNetPay = (employee, deductions, options) => {
  const { allowances, bonuses, taxes, appraisals } = options;
  let netPay = parseFloat(employee.calculate_pay) || 0;

  // Allowances
  deductions.allowances?.forEach(allowance => {
    const found = allowances.find(a => a.id === allowance.value);
    netPay += parseFloat(found?.amount) || 0;
  });

  // Bonuses
  deductions.bonuses?.forEach(bonus => {
    const found = bonuses.find(b => b.id === bonus.value);
    netPay += parseFloat(found?.bonusAmount) || 0;
  });

  // Taxes
  deductions.taxes?.forEach(tax => {
    const found = taxes.find(t => t.id === tax.value);
    if (found?.nature === "fixedamount") {
      netPay -= parseFloat(found.amount) || 0;
    } else {
      netPay -= netPay * (parseFloat(found?.percent) / 100) || 0;
    }
  });


  // Loans
  deductions.appraisals?.forEach(app => {
    const found = appraisals.find(a => a.id === app.value);
    netPay += parseFloat(found?.appraisal_amount) || 0;
  });

  // Loans
  // deductions.loans?.forEach(loan => {
  //   const found = loans.find(l => l.id === loan.value);
  //   netPay -= parseFloat(found?.givenLoan) || 0;
  // });

  return netPay.toFixed(2);
};

const CompletedPayroll = () => {
  const dispatch = useDispatch();
  const { activeTab = 'table',
    selectedIds = [],
    selectedDeductions = {
      allowances: [],
      bonuses: [],
      taxes: [],
      appraisals: [],
    } } = useSelector(state => state.empProfile);

  const activeTabRef = React.useRef(activeTab);


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
  const [searchQuery, setSearchQuery] = useState("");
  const [changeTab, setChangeTab] = useState("Completed Payrolls");
  // const [activeTab, setActiveTab] = useState("table");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [resMsg, setResMsg] = useState("");
  const [showMarkAsCompletedModal, setShowMarkAsCompletedModal] = useState(false);
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
    const initializeComponent = async () => {
      await fetchCompletedPayrolls();

      // Only set to table if not already in markCompleted
      if (activeTabRef.current !== 'markCompleted') {
        dispatch(setActiveTab("table"));
      }
    };

    initializeComponent();

    return () => {
      // Cleanup when component unmounts
      if (activeTabRef.current !== 'markCompleted') {
        dispatch(resetState());
      }
      setSearchQuery("");
      setCurrentPage(0);
    };
  }, [fetchCompletedPayrolls]);

  useEffect(() => {
    let timer;
    if (successModal) {
      timer = setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [successModal]);


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
      // setSelectedIds(allIds);
      dispatch(setSelectedIds(allIds));
      console.log(allIds);
    } else {
      dispatch(setSelectedIds([]));
      // setSelectedIds([]);
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

    dispatch(setSelectedIds(currentIds)); // Dispatch the new array
  };

  useEffect(() => {
    if (selectedIds.length === currentPageData.length && currentPageData.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedIds, currentPageData]);

  // Handle close payroll (deletes all existing payrolls)
  const handleClosePayroll = () => {
    setModalType("close all payrolls");
    setShowModal(true);
    console.log(data);
  };

  // Confirm close all payrolls
  const confirmCloseAllPayrolls = async () => {
    try {
      // Send all payroll data in the request payload
      await axios.post(`${SERVER_URL}close-all-payrolls/`, {
        payrolls: data  // Send the entire data array
      });

      // Update the state after successful API call
      setData([]);
      setShowModal(false);
      setResMsg("All payrolls have been closed successfully.");
      setSuccessModal(true);
    } catch (error) {
      console.error("Error closing payrolls:", error);
      setResMsg("Failed to close payrolls. Please try again.");
      setShowModal(false);
      setWarningModal(true);
    }
  };

  // Handle mark as completed button click
  const handleMarkAsCompleted = () => {
    if (selectedIds.length > 0) {
      dispatch(setActiveTab("markCompleted")); // Switch to mark completed view
    } else {
      setResMsg("Please select at least one row to mark as completed.");
      setWarningModal(true);
    }
  };

  const handleConfirmMarkAsCompleted = async () => {
    try {
      const payload = selectedEmployees.map(employee => {
        // 1️⃣ Compute the sums:
        const appSum = Array.isArray(employee.app)
          ? employee.app.reduce((sum, a) => sum + Number(a.appraisalAmount || 0), 0)
          : 0;

        const bonusSum = Array.isArray(employee.bonus)
          ? employee.bonus.reduce((sum, b) => sum + Number(b.bonusAmount || 0), 0)
          : 0;

        const allowancesSum = Array.isArray(employee.allowances)
          ? employee.allowances.reduce((sum, al) => sum + Number(al.amount || 0), 0)
          : 0;

        const taxesSum = Array.isArray(employee.taxes)
          ? employee.taxes.reduce((sum, t) => sum + Number(t.amount || 0), 0)
          : 0;

        // 2️⃣ Build filtered arrays from the user’s selections:
        const filteredAppraisals = selectedDeductions.appraisals
          .map(ap => {
            const found = appraisals.find(x => x.id === ap.value);
            return found && { id: ap.value, amount: found.appraisal_amount, name: found.name };
          })
          .filter(Boolean);

        const filteredBonus = selectedDeductions.bonuses
          .map(b => {
            const found = bonuses.find(x => x.id === b.value);
            return found && { id: b.value, amount: found.bonusAmount, name: found.bonusName };
          })
          .filter(Boolean);



        const filteredAllowance = selectedDeductions.allowances
          .map(a => {
            const found = allowances.find(al => al.id === a.value);
            return found && { id: a.value, amount: found.amount, name: found.allowanceName };
          })
          .filter(Boolean);
        // console.log('filteredAllowance', filteredAllowance);



        const filteredTax = selectedDeductions.taxes
          .map(t => {
            const found = taxes.find(x => x.id === t.value);
            if (!found) return null;

            const originalPay = parseFloat(employee.calculate_pay) || 0;

            // 1️⃣ Calculate total additions from selected deductions
            const totalAdditions = 
              filteredAllowance.reduce((sum, a) => sum + Number(a.amount || 0), 0) +
              filteredBonus.reduce((sum, b) => sum + Number(b.amount || 0), 0) +
              filteredAppraisals.reduce((sum, ap) => sum + Number(ap.amount || 0), 0);

            // 2️⃣ Compute total before tax
            const totalBeforeTax = originalPay + totalAdditions;

            console.log('totalAdditions: ', totalAdditions);
            console.log('totalBeforeTax: ', totalBeforeTax);

            // 3️⃣ Calculate tax based on totalBeforeTax
            let amount;
            if (found.nature === "fixedamount") {
              amount = parseFloat(found.amount) || 0;
            } else {
              const percent = parseFloat(found.percent) || 0;
              amount = totalBeforeTax * (percent / 100); // Apply % to totalBeforeTax
            }

            return {
              id: t.value,
              amount: amount.toFixed(2),
              name: found.taxName
            };
          })
          .filter(Boolean);

          // console.log(filteredTax);
        // 3️⃣ Return the final shape:
        return {
          // preserve identifying fields
          pysId: employee.pysId,
          empId: employee.empId,
          empName: employee.empName,
          department: employee.department,
          companyName: employee.companyName,
          companyLogo: employee.companyLogo,

          // original scalar fields
          otHoursPay: employee.otHoursPay,
          otHours: employee.otHours,
          extraFund: employee.extraFund,
          advSalary: employee.advSalary,
          loan: employee.loan,
          salaryPeriod: employee.salaryPeriod,
          bankName: employee.bankName,
          accountNo: employee.accountNo,
          basicSalary: employee.basicSalary,
          salaryType: employee.salaryType,
          totalWorkingDays: employee.totalWorkingDays,
          totalWorkingHours: employee.totalWorkingMinutes,
          totalWorkingMinutes: employee.totalWorkingHours,
          attemptWorkingHours: employee.attemptWorkingHours,
          attempt_working_hours: employee.attempt_working_hours,
          dailySalary: employee.dailySalary,
          calculate_pay: employee.calculate_pay,
          date: employee.date,
          from_date: "",
          end_date: "",

          // 🔢 Top-level sums
          app: appSum,
          bonus: bonusSum,
          allowances: allowancesSum,
          taxes: taxesSum,

          // 📑 Filtered selections
          filteredAppraisals,
          filteredBonus,
          filteredAllowance,
          filteredTax,
        };
      });

      // console.log("selectedDeductions:", selectedDeductions);
      console.log("Final Payload:", payload);

      // await axios.post(`${SERVER_URL}pyr-emp-cmp/`, payload);
      await fetchCompletedPayrolls();

      setResMsg("Selected items have been marked as completed successfully.");
      setSuccessModal(true);
      dispatch(resetState());

    } catch (error) {
      console.error("Error marking items as completed:", error);
      setResMsg("Failed to mark items as completed. Please try again.");
      setWarningModal(true);
    }
  };


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
    dispatch(setActiveTab("salarySlip"));
  };
  const handleOpenEditedSalarySlip = (employee) => {
    if (!employee) return;
    const originalPay = parseFloat(employee?.calculate_pay) || 0;


    const existingAppraisals = Array.isArray(employee.app)
      ? employee.app.reduce((total, i) => total + Number(i.appraisalAmount || 0), 0)
      : 0;

    const existingBonuses = Array.isArray(employee.bonus)
      ? employee.bonus.reduce((total, i) => total + Number(i.bonusAmount || 0), 0)
      : 0;

    const existingAllowances = Array.isArray(employee.allowances)
      ? employee.allowances.reduce((total, a) => total + Number(a.amount || 0), 0)
      : 0;

    const existingTaxes = Array.isArray(employee.taxes)
      ? employee.taxes.reduce((total, t) => {
        if (t.nature === "fixedamount") return total + Number(t.amount);
        return total + (originalPay * (Number(t.percent) / 100));
      }, 0)
      : 0;

    // Calculate new amounts from selections
    const newAppraisals = (selectedDeductions.appraisals || []).reduce((sum, ap) => {
      const appraisal = appraisals.find(a => a.id === ap?.value);
      return sum + (appraisal ? Number(appraisal.appraisal_amount || 0) : 0);
    }, 0);

    const newBonuses = (selectedDeductions.bonuses || []).reduce((sum, b) => {
      const bonus = bonuses.find(bo => bo.id === b?.value);
      return sum + (bonus ? Number(bonus.bonusAmount || 0) : 0);
    }, 0);

    const newTaxes = (selectedDeductions.taxes || []).reduce((sum, t) => {
      const tax = taxes.find(ta => ta.id === t?.value);
      if (!tax) return sum;
      if (tax.nature === "fixedamount") return sum + Number(tax.amount || 0);
      return sum + (originalPay * (Number(tax.percent || 0) / 100));
    }, 0);

    // For allowances
    const newAllowances = (selectedDeductions.allowances || []).reduce((sum, a) => {
      const allowance = allowances.find(al => al.id === a?.value);
      return sum + (allowance ? Number(allowance.amount || 0) : 0);
    }, 0);

    // Create processed data object
    const processedData = {
      employeeInfo: {
        empId: employee.empId,
        empName: employee.empName,
        companyName: employee.companyName,
      },
      ...employee,
      originalPay,
      totalAllowances: newAllowances,
      totalBonuses: newBonuses,
      totalTaxes: newTaxes,
      totalAppraisals: newAppraisals,
      // totalAllowances: employee.existingAllowances + newAllowances,
      // totalBonuses: employee.existingBonuses + newBonuses,
      // totalTaxes: employee.existingTaxes + newTaxes,
      // totalAppraisals: employee.existingAppraisals + newAppraisals,
      finalNetPay: originalPay + newAllowances + newBonuses + newAppraisals - newTaxes,
      deductions: selectedDeductions
    };

    setSelectedEmployee(processedData);
    dispatch(setActiveTab("editedSalarySlip"));
  };

  const handleCloseSalarySlip = () => {
    dispatch(setActiveTab("table"));
    setSelectedEmployee(null);
  };
  const handleCloseEditedSalarySlip = () => {
    dispatch(setActiveTab("markCompleted"));
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
    }, [employee, deductions]); // Add deductions as dependency

    const safeDeductions = {
      allowances: deductions.allowances || [],
      bonuses: deductions.bonuses || [],
      taxes: deductions.taxes || [],
      appraisals: deductions.appraisals || []
    };

    const transformDeductions = useMemo(() => ({
      allowances: (deductions.allowances || []).map(a => ({
        ...allowances.find(al => al.id === a.value),
        amount: allowances.find(al => al.id === a.value)?.amount
      })),
      bonuses: (deductions.bonuses || []).map(b => ({
        ...bonuses.find(bo => bo.id === b.value),
        bonusAmount: bonuses.find(bo => bo.id === b.value)?.bonusAmount
      })),
      taxes: (deductions.taxes || []).map(t => ({
        ...taxes.find(ta => ta.id === t.value),
        amount: taxes.find(ta => ta.id === t.value)?.amount,
        percent: taxes.find(ta => ta.id === t.value)?.percent
      })),
      appraisals: (deductions.appraisals || []).map(a => ({
        ...appraisals.find(ap => ap.id === a.value),
        appraisalAmount: appraisals.find(ap => ap.id === a.value)?.appraisal_amount
      }))
    }), [deductions, bonuses, allowances, taxes, appraisals]);



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
            <SalarySlip
              salaryDetails={employee}
              preview
              deductions={transformDeductions}
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
  const { allowances: selectedAllowances, bonuses: selectedBonuses, taxes: selectedTaxes, appraisals: selectedAppraisals } = useMemo(
    () => selectedDeductions,
    [selectedDeductions]
  );

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
                          <button
                            className="add-button submit-button"
                            onClick={handleClosePayroll}
                          >
                            <FaCheck className="add-icon" /> Close Payroll
                          </button>
                          <button
                            className="add-button"
                            onClick={handleMarkAsCompleted}
                          >
                            <FaCheck className="add-icon" /> Mark As Completed
                          </button>
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
                                <tr key={item.pysId}>
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
                                  <td>
                                    {Array.isArray(item.app)
                                      ? item.app.reduce((total, i) => total + i.appraisalAmount, 0)
                                      : 0}
                                  </td>
                                  <td>
                                    {Array.isArray(item.bonus)
                                      ? item.bonus.reduce((total, i) => total + Number(i.bonusAmount), 0)
                                      : 0}
                                  </td>
                                  <td>
                                    {Array.isArray(item.allowances)
                                      ? item.allowances.reduce((total, i) => total + Number(i.amount), 0)
                                      : 0}
                                  </td>
                                  <td>
                                    {Array.isArray(item.taxes)
                                      ? item.taxes.reduce((total, i) => total + Number(i.amount), 0)
                                      : 0}
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
                  // Group employees by month-year
                  const groupedEmployees = currentPageData.reduce((acc, employee) => {
                    // If there's no date property, use a default grouping
                    let monthYear = "Current Period";
                    if (employee.date) {
                      const date = new Date(employee.date);
                      monthYear = date.toLocaleString('default', {
                        month: 'long',
                        year: 'numeric'
                      });
                    }
                    if (!acc[monthYear]) acc[monthYear] = [];
                    acc[monthYear].push(employee);
                    return acc;
                  }, {});

                  // Get groups in array format for easier rendering
                  const sortedGroups = Object.entries(groupedEmployees);

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
                          <button
                            className="add-button submit-button"
                            onClick={handleClosePayroll}
                          >
                            <FaCheck className="add-icon" /> Close Payroll
                          </button>
                          <button
                            className="add-button"
                            onClick={handleMarkAsCompleted}
                          >
                            <FaCheck className="add-icon" /> Mark As Completed
                          </button>
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
                                {employees.map((employee) => (
                                  <div
                                    key={employee.pysId}
                                    className="salary-slip-card"
                                    onClick={() => handleOpenSalarySlip(employee)}
                                  >
                                    <div className="preview-header">
                                      <h4>{employee.empName}</h4>
                                      <small>{employee.empId}</small>
                                    </div>
                                    <PreviewContainer employee={employee} deductions={{}} />
                                    <div className="preview-footer">
                                      <span>Basic: Rs. {employee.basicSalary}</span>
                                      <span>Net: Rs. {employee.calculate_pay}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {groupIndex < sortedGroups.length - 1 && <hr />}
                          </div>
                        ))}

                      </div>
                    </>
                  );




                case "markCompleted":
                  // Get selected employees data
                  const selectedEmployees = data.filter(employee =>
                    selectedIds.includes(employee.empId)
                  );

                  // Group selected employees by month-year
                  const groupedSelected = selectedEmployees.reduce((acc, employee) => {
                    const date = new Date(employee.date);
                    const monthYear = date.toLocaleString('default', {
                      month: 'long',
                      year: 'numeric'
                    });
                    if (!acc[monthYear]) acc[monthYear] = [];
                    acc[monthYear].push(employee);
                    return acc;
                  }, {});

                  return (
                    <div className="gallery-container">
                      {/* Deduction Controls */}
                      <div className="deduction-controls">
                        <h2>Apply Deductions to All Selected</h2>
                        <div className="deduction-filters">
                          <label>Select Allowances</label>
                          <Select
                            isMulti
                            placeholder="Select Allowances..."
                            options={allowanceOptions}
                            value={selectedAllowances}
                            onChange={(selected) => dispatch(setSelectedDeductions({
                              ...selectedDeductions,
                              allowances: selected || []
                            }))}
                          />

                          <label>Select Bonuses</label>
                          <Select
                            isMulti
                            placeholder="Select Bonuses..."
                            options={bonusOptions}
                            value={selectedBonuses}
                            onChange={(selected) => dispatch(setSelectedDeductions({
                              ...selectedDeductions,
                              bonuses: selected || []
                            }))}
                          />

                          <label>Select Taxes</label>
                          <Select
                            isMulti
                            placeholder="Select Taxes..."
                            options={taxOptions}
                            value={selectedTaxes}
                            onChange={(selected) => dispatch(setSelectedDeductions({
                              ...selectedDeductions,
                              taxes: selected || []
                            }))}
                          />

                          <label>Select Appraisals</label>
                          <Select
                            isMulti
                            placeholder="Select Appraisals..."
                            options={appraisalOptions}
                            value={selectedAppraisals}
                            onChange={(selected) => dispatch(setSelectedDeductions({
                              ...selectedDeductions,
                              appraisals: selected || []
                            }))}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="modal-footer">
                          <button
                            className="submit-button"
                            onClick={() => handleConfirmMarkAsCompleted(selectedDeductions)}
                          >
                            Confirm Mark as Completed
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => dispatch(resetState())}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      {/* Table Structure */}
                      {Object.entries(groupedSelected).map(([monthYear, employees], groupIndex) => (
                        <div key={monthYear}>
                          <div className="month-group">
                            <div className="month-header">
                              <h3 className="month-title">{monthYear}</h3>
                              <hr className="month-divider" />
                            </div>
                            <div className="department-table">
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
                                      <th>Loan</th>
                                      <th>Appraisals</th>
                                      <th>Bonus</th>
                                      <th>Allowances</th>
                                      <th>Taxes</th>
                                      <th>Basic</th>
                                      <th>Daily Salary</th>
                                      <th>Original Pay</th>
                                      <th>Total</th>
                                      <th>Salary Slip</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {employees.map((employee) => {
                                      const originalPay = parseFloat(employee.calculate_pay) || 0;

                                      const existingAppraisals = Array.isArray(employee.app)
                                        ? employee.app.reduce((total, i) => total + Number(i.appraisalAmount || 0), 0)
                                        : 0;

                                      const existingBonuses = Array.isArray(employee.bonus)
                                        ? employee.bonus.reduce((total, i) => total + Number(i.bonusAmount || 0), 0)
                                        : 0;

                                      const existingAllowances = Array.isArray(employee.allowances)
                                        ? employee.allowances.reduce((total, a) => total + Number(a.amount || 0), 0)
                                        : 0;

                                      const existingTaxes = Array.isArray(employee.taxes)
                                        ? employee.taxes.reduce((total, t) => {
                                          if (t.nature === "fixedamount") return total + Number(t.amount);
                                          return total + (originalPay * (Number(t.percent) / 100));
                                        }, 0)
                                        : 0;

                                      // Calculate new amounts from selections
                                      // 1. Calculate additions (allowances, bonuses, appraisals)
                                      const newAllowances = (selectedDeductions.allowances || []).reduce((sum, a) => {
                                        const allowance = allowances.find(al => al.id === a?.value);
                                        return sum + (allowance ? Number(allowance.amount || 0) : 0);
                                      }, 0);

                                      const newBonuses = (selectedDeductions.bonuses || []).reduce((sum, b) => {
                                        const bonus = bonuses.find(bo => bo.id === b?.value);
                                        return sum + (bonus ? Number(bonus.bonusAmount || 0) : 0);
                                      }, 0);

                                      const newAppraisals = (selectedDeductions.appraisals || []).reduce((sum, ap) => {
                                        const appraisal = appraisals.find(a => a.id === ap?.value);
                                        return sum + (appraisal ? Number(appraisal.appraisal_amount || 0) : 0);
                                      }, 0);

                                      // 2. Calculate total additions
                                      const totalAdditions = newAllowances + newBonuses + newAppraisals;

                                      // 3. Calculate additional amount BEFORE tax
                                      const additionalAmountBeforeTax = originalPay + totalAdditions;

                                      // 4. Calculate taxes (now using additionalAmountBeforeTax as the base)
                                      const newTaxes = (selectedDeductions.taxes || []).reduce((sum, t) => {
                                        const tax = taxes.find(ta => ta.id === t?.value);
                                        if (!tax) return sum;

                                        if (tax.nature === "fixedamount") {
                                          return sum + Number(tax.amount || 0);
                                        } else {
                                          const percent = Number(tax.percent || 0);
                                          return sum + (additionalAmountBeforeTax * (percent / 100));
                                        }
                                      }, 0);

                                      // 5. Final additional amount after tax
                                      const additionalAmount = additionalAmountBeforeTax - newTaxes;

                                      // Calculate totals
                                      const totalAppraisals = existingAppraisals + newAppraisals;
                                      const totalBonuses = existingBonuses + newBonuses;
                                      const totalAllowances = existingAllowances + newAllowances;
                                      const totalTaxes = existingTaxes + newTaxes;


                                      // const additionalAmount = parseFloat(calculateNetPay(employee, selectedDeductions, {
                                      //   appraisals,
                                      //   allowances,
                                      //   bonuses,
                                      //   taxes,

                                      // })                                    ) || 0;


                                      return (

                                        <tr key={employee.pysId}>
                                          <td>{employee.empId}</td>
                                          <td>{employee.empName}</td>
                                          <td>{employee.otHoursPay}</td>
                                          <td>{employee.otHours}</td>
                                          <td>{employee.extraFund}</td>
                                          <td>{employee.advSalary}</td>
                                          <td>{employee.loan}</td>
                                          <td>
                                            {existingAppraisals.toFixed(2)} + {newAppraisals.toFixed(2)} = {" "}
                                            <strong>{totalAppraisals.toFixed(2)}</strong>
                                          </td>
                                          <td>
                                            {existingBonuses.toFixed(2)} + {newBonuses.toFixed(2)} = {" "}
                                            <strong>{totalBonuses.toFixed(2)}</strong>
                                          </td>
                                          <td>
                                            {existingAllowances.toFixed(2)} + {newAllowances.toFixed(2)} = {" "}
                                            <strong>{totalAllowances.toFixed(2)}</strong>
                                          </td>
                                          <td>
                                            {existingTaxes.toFixed(2)} + {newTaxes.toFixed(2)} = {" "}
                                            <strong>{totalTaxes.toFixed(2)}</strong>
                                          </td>

                                          <td>{employee.basicSalary}</td>
                                          <td>{employee.dailySalary}</td>
                                          <td>Rs. {originalPay.toFixed(2)}</td>
                                          <td>Rs. {(additionalAmount).toFixed(2)}</td>
                                          <td>
                                            <button style={{ background: "none", border: "none" }}
                                              onClick={() => {
                                                if (!employee) return;
                                                handleOpenEditedSalarySlip({
                                                  ...employee,
                                                  existingAllowances,
                                                  existingBonuses,
                                                  existingTaxes,
                                                  existingAppraisals
                                                });
                                              }}
                                            >
                                              <FaDownload className="salary-slip-button" />
                                            </button>
                                          </td>
                                        </tr>

                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          {groupIndex < Object.keys(groupedSelected).length - 1 && <hr />}
                        </div>
                      ))}
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


                case "editedSalarySlip":
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
                        <EditedSalarySlip salaryDetails={selectedEmployee} />
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
    dispatch(setActiveTab('table'))
  }
  const handleGalleryActiveTab = () => {
    dispatch(setActiveTab('gallery'))
  }
  const handleSalarySlipActiveTab = () => {
    dispatch(setActiveTab('salarySlip'))
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
              if (modalType === "close all payrolls") confirmCloseAllPayrolls();
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

          {/* Mark As Completed Modal */}
          <MarkAsCompletedModal
            isOpen={showMarkAsCompletedModal}
            onClose={() => setShowMarkAsCompletedModal(false)}
            selectedEmployees={selectedEmployees}
            onConfirm={handleConfirmMarkAsCompleted}
          />


          {renderTabContent()}
        </div>
      </div>
    </>
  );
};


export default CompletedPayroll;
