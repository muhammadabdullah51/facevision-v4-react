import React, { useEffect } from "react";
import '../Dashboard_Table/dashboard_table.css';


const Daily_Working_Hours_Report = ({searchQuery, sendDataToParent  }) => {
    const data = [
        { employeeId: "E001", employeeName: "Camila Rios", firstCheckIn: "09:00 AM", lastCheckOut: "05:00 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E002", employeeName: "Diana Smith", firstCheckIn: "09:15 AM", lastCheckOut: "05:15 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E003", employeeName: "Wade Warren", firstCheckIn: "09:05 AM", lastCheckOut: "05:10 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E004", employeeName: "Guy Hawkins", firstCheckIn: "09:30 AM", lastCheckOut: "05:45 PM", hours: "8.25", date: "12 / 04 / 2022" },
        { employeeId: "E005", employeeName: "Emily Davis", firstCheckIn: "09:00 AM", lastCheckOut: "05:00 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E006", employeeName: "Michael Brown", firstCheckIn: "09:10 AM", lastCheckOut: "05:20 PM", hours: "8.1", date: "12 / 04 / 2022" },
        { employeeId: "E007", employeeName: "Jessica White", firstCheckIn: "09:20 AM", lastCheckOut: "05:30 PM", hours: "8.1", date: "12 / 04 / 2022" },
        { employeeId: "E008", employeeName: "David Johnson", firstCheckIn: "09:00 AM", lastCheckOut: "05:00 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E009", employeeName: "Laura Martinez", firstCheckIn: "09:25 AM", lastCheckOut: "05:35 PM", hours: "8.1", date: "12 / 04 / 2022" },
        { employeeId: "E010", employeeName: "James Lee", firstCheckIn: "09:00 AM", lastCheckOut: "05:00 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E011", employeeName: "Anna Wilson", firstCheckIn: "09:30 AM", lastCheckOut: "05:45 PM", hours: "8.25", date: "12 / 04 / 2022" },
        { employeeId: "E012", employeeName: "John Scott", firstCheckIn: "09:00 AM", lastCheckOut: "05:00 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E013", employeeName: "Olivia Taylor", firstCheckIn: "09:15 AM", lastCheckOut: "05:20 PM", hours: "8.05", date: "12 / 04 / 2022" },
        { employeeId: "E014", employeeName: "Chris Anderson", firstCheckIn: "09:35 AM", lastCheckOut: "05:50 PM", hours: "8.25", date: "12 / 04 / 2022" },
        { employeeId: "E015", employeeName: "Sophia Harris", firstCheckIn: "09:00 AM", lastCheckOut: "05:00 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E016", employeeName: "Matthew Clark", firstCheckIn: "09:05 AM", lastCheckOut: "05:10 PM", hours: "8.05", date: "12 / 04 / 2022" },
        { employeeId: "E017", employeeName: "Charlotte Lewis", firstCheckIn: "09:20 AM", lastCheckOut: "05:30 PM", hours: "8.1", date: "12 / 04 / 2022" },
        { employeeId: "E018", employeeName: "Ethan Walker", firstCheckIn: "09:00 AM", lastCheckOut: "05:00 PM", hours: "8", date: "12 / 04 / 2022" },
        { employeeId: "E019", employeeName: "Ava Young", firstCheckIn: "09:30 AM", lastCheckOut: "05:45 PM", hours: "8.25", date: "12 / 04 / 2022" },
        { employeeId: "E020", employeeName: "Daniel King", firstCheckIn: "09:00 AM", lastCheckOut: "05:00 PM", hours: "8", date: "12 / 04 / 2022" },
    ];
    
    const filteredData = data.filter(row =>
        row.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.firstCheckIn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.lastCheckOut.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.hours.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.date.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send filtered data to parent
    useEffect(() => {
        sendDataToParent(filteredData);
    }, [filteredData, sendDataToParent]);

    return (
        <div className="table-container">
            <h3>Daily Working Hours Report</h3>
            <table>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>First CheckIn</th>
                        <th>Last CheckOut</th>
                        <th>Hours</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.employeeId}</td>
                            <td className="bold-fonts">{row.employeeName}</td>
                            <td>{row.firstCheckIn}</td>
                            <td>{row.lastCheckOut}</td>
                            <td className="bold-fonts">{row.hours}</td>
                            <td className="bold-fonts">{row.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Daily_Working_Hours_Report;
