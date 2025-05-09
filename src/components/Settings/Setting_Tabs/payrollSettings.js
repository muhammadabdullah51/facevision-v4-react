import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../../../config';

const PayrollSettings = () => {
  const [settings, setSettings] = useState({
    whForAdvSal: "No",
    asgnAppByDf: "No",
    lnDedByDf: "No",
    extFundDedByDf: "No",
    asgnBnsByDf: "No",
    pyOtByDf: "No",
    cutSalWhByDf: "No",
    lvPUnPByDf: "No",
    isEndDate: "No",
    customeDate: "0",
    endingNote: "",
    isPerDay: "No",
    isOrigional: "Yes",
    otCustomHours: "0",

  });

  // Fetch settings from the server
  const fetchPyrSett = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}sett-adv-pyr/`);
      const fetchedData = response.data[0]; // Assuming only one object is returned
      console.log(fetchedData);
      setSettings((prevSettings) => ({
        ...prevSettings,
        ...fetchedData,
        isOrigional: fetchedData.isOrigional ?? "Yes",
        otCustomHours: fetchedData.otCustomHours ?? "",
      }));
    } catch (error) {
      console.error('Error fetching payroll settings:', error);
    }
  }, []);

  useEffect(() => {
    fetchPyrSett();
  }, [fetchPyrSett]);

  const handleCheckboxChange = (key) => {
    setSettings((prevState) => ({
      ...prevState,
      [key]: prevState[key] === "Yes" ? "No" : "Yes",
    }));
  };
  const handleEndNote = (event) => {
    const value = event.target.value;
    setSettings((prevState) => ({
      ...prevState,
      endingNote: value,
    }));

  }
  const handleDateChange = (event) => {
    const value = event.target.value;

    // Ensure the value is within the valid range
    if (value >= 1 && value <= 31) {
      setSettings((prevState) => ({
        ...prevState,
        customeDate: value,
      }));
    } else {
      alert("Please enter a valid date between 1 and 31.");
    }
  };
  const handleModifiedOTHours = (event) => {
    const value = event.target.value;
    if (value >= 0 ) {
      setSettings((prevState) => ({
        ...prevState,
        otCustomHours: value,
      }));
    } else {
      alert("Please enter valid hours greater than 0.");
    }
  };


  const questions = [
    { key: "whForAdvSal", label: "Consider working hours for advance salaries" },
    { key: "asgnAppByDf", label: "Assign appraisals by default" },
    { key: "lnDedByDf", label: "Loan deduction by default" },
    { key: "extFundDedByDf", label: "Payable Extra Funds deductions by default" },
    { key: "asgnBnsByDf", label: "Assign Bonus by Default" },
    { key: "pyOtByDf", label: "Pay for Overtime" },
    { key: "cutSalWhByDf", label: "Cut Salary on working hours" },
    { key: "lvPUnPByDf", label: "Leaves are paid or unpaid" },
    { key: "isPerDay", label: "Consider salary per day instead of working hours" },
    { key: "isOrigional", label: "Consider Original Overtime" },
    { key: "isEndDate", label: "Consider last day of the month for payroll closing date and first day of the month as starting date" },
  ];

  const handleSubmit = async () => {
    console.log(settings);
    const payload = {
      ...settings,
      // if they’re “Yes”, zero them out
      customeDate: settings.isEndDate === "Yes"
        ? 0
        : settings.customeDate,
      otCustomHours: settings.isOrigional === "Yes"
        ? 0
        : settings.otCustomHours,
    };
    console.log("sending", payload);
    try {
      const response = await axios.post(`${SERVER_URL}sett-adv-pyr/`, payload);
      if (response.status === 200) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error posting settings:', error);
      alert('An error occurred while saving settings.');
    }
  };

  return (
    <div className="checkbox-settings">


      <ul className="checkbox-list">
        {questions.map((question) => (
          <li key={question.key} className="checkbox-item">
            <label>{question.label}</label>
            <div className="payroll-checkbox">
              <h5>No</h5>
              <input
                type="checkbox"
                checked={settings[question.key] === "Yes"}
                onChange={() => handleCheckboxChange(question.key)}
              />
              <h5>Yes</h5>
            </div>
          </li>
        ))}
      </ul>

      {settings.isOrigional === "No" && (
        <div className="checkbox-item" style={{ padding: '25px 10px' }}>
          <label>
            If not the original overtime then enter custom hours
          </label>
          <input
            type="number"
            placeholder="Enter Custom OT Hours"
            id="closingDate"
            value={settings.otCustomHours}
            onChange={handleModifiedOTHours}
          />
        </div>
      )}
      {settings.isEndDate === "No" && (
        <div className="checkbox-item" style={{ padding: '25px 10px' }}>
          <label>
            If not the last day of the month then Enter Closing Date
          </label>
          <input
            type="number"
            placeholder="Enter Closing Date"
            id="closingDate"
            value={settings.customeDate}
            onChange={handleDateChange}
          />
        </div>
      )}
      <div className="checkbox-item-textarea checkbox-item" style={{ padding: '25px 10px' }}>
        <label>
          Write a Description note for salary slip
        </label>
        <textarea
          rows="4"
          type="number"
          placeholder="Write your note here"
          id="endingNote"
          value={settings.endingNote}
          onChange={handleEndNote}
        />
      </div>

      <button onClick={handleSubmit} className="submit-button">
        Save Settings
      </button>
    </div>
  );
};

export default PayrollSettings;
