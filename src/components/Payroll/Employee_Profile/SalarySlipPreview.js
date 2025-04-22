import React from 'react';

const SalarySlipPreview = ({ employee }) => {
  // Use calculate_pay if available, otherwise fall back to calcPay
  const netPay = employee.calculate_pay || employee.calcPay || '0';
  
  return (
    <div className="salary-slip-preview">
      <div className="preview-header">
        <h4>{employee.empName}</h4>
        <small>ID: {employee.empId}</small>
      </div>
      
      <div className="preview-content">
        <div className="preview-row">
          <span>Basic Salary:</span>
          <span>₹ {employee.basicSalary}</span>
        </div>
        <div className="preview-row">
          <span>Net Pay:</span>
          <span>₹ {netPay}</span>
        </div>
        
        <div className="slip-status">
          <div className="status-badge pending">Pending</div>
          
        </div>
      </div>
    </div>
  );
};

export default SalarySlipPreview;