import React, {useEffect, useState} from "react";
import EmployeeTable from "./EmployeeTable";
import AddEmployee from "./AddEmployee";
import axios from "axios";

const Employees = () => {
    const [activeTab, setActiveTab] = useState('Employees');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [data, setData] = useState([])

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employees');
            setData(response.data);  // Store fetched employee data
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };
    useEffect(() => {

        fetchEmployees(); 
    }, []);


    return (
        <div>
            {activeTab === 'Employees' ? (
            <EmployeeTable data={data} setData={setData} setActiveTab={setActiveTab} fetchEmployees={fetchEmployees} />
        ) : (
            <AddEmployee setData={setData} setActiveTab={setActiveTab} data={data} employeeData={selectedEmployee} isEditMode={isEditMode}/>
        )}
        </div>
    );
};

export default Employees;
