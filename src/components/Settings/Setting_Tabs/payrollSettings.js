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
    closingDate: ""
  });

  // Fetch settings from the server
  const fetchPyrSett = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}sett-adv-pyr/`);
      const fetchedData = response.data[0]; // Assuming only one object is returned
      // setSettings(fetchedData); 
      setSettings({
        ...fetchedData,
        closingDate: fetchedData.closingDate || "", // Populate closingDate if available
      });
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
  const handleDateChange = (event) => {
    setSettings((prevState) => ({
      ...prevState,
      closingDate: event.target.value, // Update closingDate
    }));
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
  ];

  const handleSubmit = async () => {
    console.log(settings);
    try {
      const response = await axios.post(`${SERVER_URL}sett-adv-pyr/`, settings);
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
      <div className="checkbox-item" style={{padding: '25px 10px'}}>
        <label htmlFor="closingDate">Closing Date</label>

        <input
          type="date"
          id="closingDate"
          value={settings.closingDate}
          onChange={handleDateChange}
          style={{padding: '5px', width:'7vw', background: 'transparent', border:'none'}}
        />
      </div>
      
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
      <button onClick={handleSubmit} className="submit-button">
        Save Settings
      </button>
    </div>
  );
};

export default PayrollSettings;
