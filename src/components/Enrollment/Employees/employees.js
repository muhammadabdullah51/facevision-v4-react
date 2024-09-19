import React, {useState} from "react";
import EmployeeTable from "./EmployeeTable";
import AddEmployee from "./AddEmployee";

const Employees = () => {
    const [activeTab, setActiveTab] = useState('Employees');
    const [data, setData] = useState([  
        {
            "serialNo": 1,
            "employeeId": "E001",
            "employeeName": "John Smith",
            "department": "IT",
            "enrollSite": "Head Office",
            "salaryType": "Monthly",
            "contactNo": "1234567890",
            "basicSalary": 50000,
            "accountNo": "12345678901",
            "bankName": "Bank of America",
            "image": "employee1.jpg"
          },
          {
            "serialNo": 2,
            "employeeId": "E002",
            "employeeName": "Sarah Johnson",
            "department": "HR",
            "enrollSite": "Branch Office",
            "salaryType": "Hourly",
            "contactNo": "2345678901",
            "basicSalary": 20000,
            "accountNo": "23456789012",
            "bankName": "Wells Fargo",
            "image": "employee2.jpg"
          },
          {
            "serialNo": 3,
            "employeeId": "E003",
            "employeeName": "Michael Brown",
            "department": "Finance",
            "enrollSite": "Head Office",
            "salaryType": "Monthly",
            "contactNo": "3456789012",
            "basicSalary": 55000,
            "accountNo": "34567890123",
            "bankName": "Chase",
            "image": "employee3.jpg"
          },
          {
            "serialNo": 4,
            "employeeId": "E004",
            "employeeName": "Emily Davis",
            "department": "Marketing",
            "enrollSite": "Branch Office",
            "salaryType": "Contract",
            "contactNo": "4567890123",
            "basicSalary": 45000,
            "accountNo": "45678901234",
            "bankName": "CitiBank",
            "image": "employee4.jpg"
          },
          {
            "serialNo": 5,
            "employeeId": "E005",
            "employeeName": "James Miller",
            "department": "Sales",
            "enrollSite": "Head Office",
            "salaryType": "Hourly",
            "contactNo": "5678901234",
            "basicSalary": 22000,
            "accountNo": "56789012345",
            "bankName": "PNC Bank",
            "image": "employee5.jpg"
          },
          {
            "serialNo": 6,
            "employeeId": "E006",
            "employeeName": "Olivia Wilson",
            "department": "R&D",
            "enrollSite": "Branch Office",
            "salaryType": "Monthly",
            "contactNo": "6789012345",
            "basicSalary": 48000,
            "accountNo": "67890123456",
            "bankName": "TD Bank",
            "image": "employee6.jpg"
          },
          {
            "serialNo": 7,
            "employeeId": "E007",
            "employeeName": "William Moore",
            "department": "Admin",
            "enrollSite": "Head Office",
            "salaryType": "Contract",
            "contactNo": "7890123456",
            "basicSalary": 40000,
            "accountNo": "78901234567",
            "bankName": "HSBC",
            "image": "employee7.jpg"
          },
          {
            "serialNo": 8,
            "employeeId": "E008",
            "employeeName": "Sophia Taylor",
            "department": "IT",
            "enrollSite": "Branch Office",
            "salaryType": "Monthly",
            "contactNo": "8901234567",
            "basicSalary": 53000,
            "accountNo": "89012345678",
            "bankName": "Barclays",
            "image": "employee8.jpg"
          },
          {
            "serialNo": 9,
            "employeeId": "E009",
            "employeeName": "Liam Anderson",
            "department": "HR",
            "enrollSite": "Head Office",
            "salaryType": "Hourly",
            "contactNo": "9012345678",
            "basicSalary": 24000,
            "accountNo": "90123456789",
            "bankName": "Standard Chartered",
            "image": "employee9.jpg"
          },
          {
            "serialNo": 10,
            "employeeId": "E010",
            "employeeName": "Isabella Thomas",
            "department": "Finance",
            "enrollSite": "Branch Office",
            "salaryType": "Monthly",
            "contactNo": "0123456789",
            "basicSalary": 60000,
            "accountNo": "01234567890",
            "bankName": "US Bank",
            "image": "employee10.jpg"
          },
          {
            "serialNo": 11,
            "employeeId": "E011",
            "employeeName": "Noah Jackson",
            "department": "Marketing",
            "enrollSite": "Head Office",
            "salaryType": "Contract",
            "contactNo": "1123456789",
            "basicSalary": 42000,
            "accountNo": "11234567890",
            "bankName": "Bank of America",
            "image": "employee11.jpg"
          },
          {
            "serialNo": 12,
            "employeeId": "E012",
            "employeeName": "Ava White",
            "department": "Sales",
            "enrollSite": "Branch Office",
            "salaryType": "Hourly",
            "contactNo": "2123456789",
            "basicSalary": 25000,
            "accountNo": "21234567890",
            "bankName": "Wells Fargo",
            "image": "employee12.jpg"
          },
          {
            "serialNo": 13,
            "employeeId": "E013",
            "employeeName": "Lucas Harris",
            "department": "R&D",
            "enrollSite": "Head Office",
            "salaryType": "Monthly",
            "contactNo": "3123456789",
            "basicSalary": 52000,
            "accountNo": "31234567890",
            "bankName": "Chase",
            "image": "employee13.jpg"
          },
          {
            "serialNo": 14,
            "employeeId": "E014",
            "employeeName": "Mia Martin",
            "department": "Admin",
            "enrollSite": "Branch Office",
            "salaryType": "Contract",
            "contactNo": "4123456789",
            "basicSalary": 39000,
            "accountNo": "41234567890",
            "bankName": "CitiBank",
            "image": "employee14.jpg"
          },
          {
            "serialNo": 15,
            "employeeId": "E015",
            "employeeName": "Benjamin Thompson",
            "department": "IT",
            "enrollSite": "Head Office",
            "salaryType": "Hourly",
            "contactNo": "5123456789",
            "basicSalary": 30000,
            "accountNo": "51234567890",
            "bankName": "PNC Bank",
            "image": "employee15.jpg"
          },
          {
            "serialNo": 16,
            "employeeId": "E016",
            "employeeName": "Charlotte Garcia",
            "department": "HR",
            "enrollSite": "Branch Office",
            "salaryType": "Monthly",
            "contactNo": "6123456789",
            "basicSalary": 47000,
            "accountNo": "61234567890",
            "bankName": "TD Bank",
            "image": "employee16.jpg"
          },
          {
            "serialNo": 17,
            "employeeId": "E017",
            "employeeName": "Henry Martinez",
            "department": "Finance",
            "enrollSite": "Head Office",
            "salaryType": "Contract",
            "contactNo": "7123456789",
            "basicSalary": 51000,
            "accountNo": "71234567890",
            "bankName": "HSBC",
            "image": "employee17.jpg"
          },
          {
            "serialNo": 18,
            "employeeId": "E018",
            "employeeName": "Amelia Robinson",
            "department": "Marketing",
            "enrollSite": "Branch Office",
            "salaryType": "Hourly",
            "contactNo": "8123456789",
            "basicSalary": 32000,
            "accountNo": "81234567890",
            "bankName": "Barclays",
            "image": "employee18.jpg"
          },
          {
            "serialNo": 19,
            "employeeId": "E019",
            "employeeName": "Elijah Clark",
            "department": "Sales",
            "enrollSite": "Head Office",
            "salaryType": "Monthly",
            "contactNo": "9123456789",
            "basicSalary": 58000,
            "accountNo": "91234567890",
            "bankName": "Standard Chartered",
            "image": "employee19.jpg"
          },
          {
            "serialNo": 20,
            "employeeId": "E020",
            "employeeName": "Abigail Lewis",
            "department": "R&D",
            "enrollSite": "Branch Office",
            "salaryType": "Contract",
            "contactNo": "1023456789",
            "basicSalary": 44000,
            "accountNo": "10234567890",
            "bankName": "US Bank",
            "image": "employee20.jpg"
          }
    ])
    return (
        <div>
            {activeTab === 'Employees' ? (
            <EmployeeTable data={data} setData={setData} setActiveTab={setActiveTab} />
        ) : (
            <AddEmployee setData={setData} setActiveTab={setActiveTab} data={data} />
        )}
        </div>
    );
};

export default Employees;
