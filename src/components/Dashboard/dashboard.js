import React, { useEffect, useState } from "react";
import Card from '../Cards/card';
import { faIdBadge, faCalendarCheck, faCalendarAlt, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import PrefomanceGraph from '../Graphs/prefomanceGraph';
import Table from '../Tables/Dashboard_Table/dashboard_table';
import ProjectGraph from '../Graphs/projectStatus';
import CheckInOut from "../Attendence/checkinout";
import { SERVER_URL } from "../../config";
import axios from "axios";
import Employees from "../Enrollment/Employees/employees";
import Attendance from "../Attendence/attendence";
import PayrollLogs from "../Payroll/Payroll_Logs/payroll_log";
import Devices from "../Devices/devices";
import { FaArrowLeft } from "react-icons/fa";
import CheckInOutTable from "../Attendence/CheckInOutTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Dashboard = () => {

    const [data, setData] = useState([])
    const [dash, setDash] = useState(true)
    const [dashData, setDashData] = useState([])


    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(`${SERVER_URL}dashboard/`);
    //         setDashData(response.data);
    //         console.log(dashData);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}dashboard/`);
                setDashData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);



    const [activeComponent, setActiveComponent] = useState("dashboard");

    const renderContent = () => {
        switch (activeComponent) {
            case "employees":
                return <Employees />;
            case "add-employees":
                return <Employees />;
            case "attendance":
                return <Attendance />;
            case "payrolls":
                return <PayrollLogs />;
            case "devices":
                return <Devices />;
            default:
                return (
                    <>
                        <div className="dashboard-cards">



                            <div className="card">
                                <div className="card-header">
                                    <span className="card-title">Total Employees</span>
                                    <FontAwesomeIcon className="icon" icon={faIdBadge} />
                                </div>
                                <div className="card-content">
                                    <span className="card-amount">{dashData?.total_employees || 0}</span>
                                </div>
                                <div className="card-footer">
                                    {/* <span className={`card-percentage ${dashData?.total_present >= 0 ? 'positive' : 'negative'}`}>
                                        {dashData?.total_present >= 0 ? `↑ ${dashData?.total_present}` : `↓ ${Math.abs(dashData?.total_present)}`}
                                    </span> */}

                                    <span className="card-view-more" onClick={() => setActiveComponent("employees")}>View Employees</span>
                                    <span className="card-view-more1" onClick={() => setActiveComponent("add-employees")}>Add Employees</span>
                                </div>
                            </div>



                            <div className="card">
                                <div className="card-header">
                                    <span className="card-title">Attendance</span>
                                    <FontAwesomeIcon className="icon" icon={faCalendarCheck} />
                                </div>
                                <div className="card-content">
                                    <span className="card-amount">{dashData?.total_present || 0}</span>
                                </div>
                                <div className="card-footer">
                                    <span className={`card-percentage negative `}>
                                        {dashData?.total_absent > 0 ? `↑ ${dashData?.total_absent}` : dashData?.total_absent == 0 ? `${dashData?.total_absent}` : `↓ ${Math.abs(dashData?.total_absent)}`}
                                    </span>
                                    <span className={`card-percentage neutral `}>
                                        {dashData?.total_late > 0 ? `↑ ${dashData?.total_late}` : dashData?.total_late == 0 ? `${dashData?.total_late}` : `↓ ${Math.abs(dashData?.total_late)}`}
                                    </span>
                                    <span className="card-view-more" onClick={() => setActiveComponent("attendance")}>See Attendance</span>
                                </div>
                            </div>


                            <div className="card">
                                <div className="card-header">
                                    <span className="card-title">Payrolls</span>
                                    <FontAwesomeIcon className="icon" icon={faCalendarAlt} />
                                </div>
                                <div className="card-content">
                                    <span className="card-amount">Rs. {dashData?.total_payroll_amount || 0}</span>
                                </div>
                                <div className="card-footer">
                                    <span className={`card-percentage negative `}>
                                        {/* {dashData?.total_absent > 0 ? `↑ ${dashData?.total_absent}` : dashData?.total_absent == 0 ? `${dashData?.total_absent}` : `↓ ${Math.abs(dashData?.total_absent)}`} */}
                                    </span>
                                    <span className={`card-percentage neutral `}>
                                        {/* {dashData?.total_late > 0 ? `↑ ${dashData?.total_late}` : dashData?.total_late == 0 ? `${dashData?.total_late}` : `↓ ${Math.abs(dashData?.total_late)}`} */}
                                    </span>
                                    <span className="card-view-more" onClick={() => setActiveComponent("payrolls")}>View Payrolls</span>
                                </div>
                            </div>


                            <div className="card">
                                <div className="card-header">
                                    <span className="card-title">Devices</span>
                                    <FontAwesomeIcon className="icon" icon={faTabletAlt} />
                                </div>
                                <div className="card-content">
                                    <span className="card-amount">{dashData?.total_devices || 0}</span>
                                </div>
                                <div className="card-footer">
                                    <span className={`card-percentage ${dashData?.connected_devices > 0 ? 'positive' : dashData?.connected_devices == 0 ? 'neutral' : 'negative'}`}>
                                        {dashData?.connected_devices > 0 ? `↑ ${dashData?.connected_devices}` : dashData?.connected_devices == 0 ? `${dashData?.connected_devices}` : `↓ ${Math.abs(dashData?.connected_devices)}`}
                                    </span>
                                    <span className={`card-percentage ${dashData?.disconnected_devices >= 0 ? 'negative' : 'positive'}`}>
                                        {dashData?.disconnected_devices > 0 ? `↑ ${dashData?.disconnected_devices}` : dashData?.disconnected_devices == 0 ? `${dashData?.connected_devices}` : `↓ ${Math.abs(dashData?.connected_devices)}`}
                                    </span>

                                    <span className="card-view-more" onClick={() => setActiveComponent("devices")}>Check Devices</span>
                                </div>
                            </div>



                        </div>
                        <div className="dashboard-graphs">
                            <div className="prefomance-graph">
                                <PrefomanceGraph />
                            </div>
                            <div className="geography-graph">
                                <ProjectGraph />
                            </div>
                        </div>
                        <div>
                            <div className="table-container">

                                <h3>Latest Attendance <span className="live-data">Live data</span></h3>
                                <CheckInOutTable dash={dash} />
                                {/* <Table /> */}
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="dashboard-main">
            {/* Back button, shown only when a component other than "dashboard" is active */}
            {activeComponent !== "dashboard" && (
                <button className="back-button" onClick={() => setActiveComponent("dashboard")}>
                    <FaArrowLeft />Back to Dashboard
                </button>
            )}
            {renderContent()}
        </div>
    );
};


export default Dashboard;
