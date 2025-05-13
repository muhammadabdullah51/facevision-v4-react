import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../config";
import error from "../../../assets/error.png";

const ExtraFundsReport = ({ searchQuery, sendDataToParent }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchExtraFunds = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}pyr-ext/`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ExtraFundsReport data:", error);
    }
  }, [setData]);

  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.assign_date); // Assuming the `date` field is a string representing a valid date
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Check if item matches the search query
      const matchesSearchQuery =
        item.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.empIdVal?.toString().includes(searchQuery) ||
        item.type?.toString().includes(searchQuery) ||
        item.status?.toString().includes(searchQuery) ||
        item.pendingAmount?.toString().includes(searchQuery) ||
        item.paidAmount?.toString().includes(searchQuery) ||
        item.nextPayable?.toString().includes(searchQuery) ||
        item.extrafund_amount?.toString().includes(searchQuery)

      // Check if item matches the date range
      const matchesDateRange =
        (!fromDate || itemDate >= startDate) &&
        (!toDate || itemDate <= endDate);

      // Return items that match both the search query and the date range
      return matchesSearchQuery && matchesDateRange;
    });

    setFilteredData(newFilteredData);
  }, [searchQuery, data, fromDate, toDate]); // Dependencies include data, searchQuery, fromDate, toDate

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      sendDataToParent(filteredData);
    }
  }, [filteredData, sendDataToParent]);

  useEffect(() => {
    fetchExtraFunds();
  }, [fetchExtraFunds]);

  return (
    <>
      {data.length < 1 ? (
        <>
          <div className="baandar">
            <img src={error} alt="No Data Found" />
            <h4>No Extra Funds Record Found.</h4>
          </div>
        </>
      ) : (
        <div className="departments-table">
          <div className="report-head">
            <h3>Extra Funds Report</h3>
            <div className="date-search">
              <label>
                From:
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </label>

              <label>
                To:
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </label>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Extra Funds Name</th>
                <th>Extra Funds Amount</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
                <th>Return In Months</th>
                <th>Next Month Payable</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((adv) => (
                <tr key={adv.id}>
                  <td>{adv.id}</td>
                  <td>{adv.empIdVal}</td>
                  <td className="bold-fonts">{adv.empName}</td>
                  <td className="bold-fonts">{adv.name}</td>
                  <td>{adv.extrafund_amount}</td>
                  <td>{adv.paidAmount}</td>
                  <td>{adv.pendingAmount}</td>
                  <td>{adv.returnInMonths}</td>
                  <td>{adv.nextPayable}</td>
                  <td>{adv.assign_date}</td>
                  <td>
                    <span
                      className={`status ${adv.status === "rejected"
                        ? "absentStatus"
                        : adv.status === "pending"
                          ? "lateStatus"
                          : "presentStatus"
                        }`}
                    >
                      {adv.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${adv.type === "payable"
                        ? "absentStatus"
                        : adv.type === "Rejected"
                          ? "absentStatus"
                          : "presentStatus"
                        }`}
                    >
                      {adv.type}
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

export default ExtraFundsReport;
