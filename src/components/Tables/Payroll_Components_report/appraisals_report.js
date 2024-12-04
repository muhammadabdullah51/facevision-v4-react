import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const Appraisals_Report = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const fetchAppraisals = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-appr/`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching appraisals data:", error);
    }
  }, [setData]);

  const filteredData = data.filter(
    (item) =>
      item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId?.toString().includes(searchQuery) ||
      item.date?.toLowerCase().includes(searchQuery) ||
      item.reason?.toLowerCase().includes(searchQuery) ||
      item.desc?.toLowerCase().includes(searchQuery) ||
      item.appraisal?.toLowerCase().includes(searchQuery)
  );

  useEffect(() => {
    fetchAppraisals();
    sendDataToParent(filteredData);
  }, [fetchAppraisals]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Absent Employee For Today.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <h3>Appraisals Report</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Appraisal</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((adv) => (
                <tr key={adv.id}>
                  <td>{adv.id}</td>
                  <td>{adv.empId}</td>
                  <td className="bold-fonts">{adv.empName}</td>
                  <td>{adv.appraisal}</td>
                  <td>{adv.reason}</td>
                  <td>{adv.date}</td>
                  <td>
                    <span
                      className={`status ${
                        adv.status === "Pending"
                          ? "lateStatus"
                          : adv.status === "Rejected"
                          ? "absentStatus"
                          : "presentStatus"
                      }`}
                    >
                      {adv.status}
                    </span>
                  </td>
                  <td>{adv.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Appraisals_Report;
