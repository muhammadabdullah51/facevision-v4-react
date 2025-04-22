import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import SalarySlipPreview from './SalarySlipPreview';
import './MarkAsCompletedModal.css';

const MarkAsCompletedModal = ({
  isOpen,
  onClose,
  selectedEmployees,
  onConfirm,
}) => {
  // Sample data - in a real app, this would come from your API
  const [deductions] = useState([
    { id: '1', name: 'Housing Allowance', type: 'allowance', amount: 1000 },
    { id: '2', name: 'Transportation Allowance', type: 'allowance', amount: 500 },
    { id: '3', name: 'Medical Allowance', type: 'allowance', amount: 750 },
    { id: '4', name: 'Performance Bonus', type: 'bonus', amount: 2000 },
    { id: '5', name: 'Year-End Bonus', type: 'bonus', amount: 3000 },
    { id: '6', name: 'Project Completion Bonus', type: 'bonus', amount: 1500 },
    { id: '7', name: 'Income Tax', type: 'tax', amount: 1200 },
    { id: '8', name: 'Social Security Tax', type: 'tax', amount: 800 },
    { id: '9', name: 'Professional Tax', type: 'tax', amount: 300 },
  ]);

  // State to track selected deductions for each employee
  const [selectedDeductions, setSelectedDeductions] = useState({});

  if (!isOpen) return null;

  const deductionOptions = deductions.map((deduction) => ({
    value: deduction.id,
    label: `${deduction.name} (${deduction.amount})`,
    type: deduction.type,
  }));

  const allowanceOptions = deductionOptions.filter((option) => option.type === 'allowance');
  const bonusOptions = deductionOptions.filter((option) => option.type === 'bonus');
  const taxOptions = deductionOptions.filter((option) => option.type === 'tax');

  const handleDeductionChange = (employee, selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    const selectedItems = deductions.filter((deduction) => 
      selectedIds.includes(deduction.id)
    );
    
    setSelectedDeductions({
      ...selectedDeductions,
      [employee.pysId]: selectedItems,
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedDeductions);
    onClose();
  };

  return (
    <div className="mark-completed-modal-overlay">
      <div className="mark-completed-modal">
        <div className="mark-completed-header">
          <h2>Complete Payroll Processing</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="selected-employees-section">
            <h3>Selected Employee Salary Slips ({selectedEmployees.length})</h3>
            <div className="salary-slip-previews">
              {selectedEmployees.map((employee) => (
                <div key={employee.pysId} className="salary-slip-preview-container">
                  <SalarySlipPreview employee={employee} />
                  
                  <div className="deduction-selectors">
                    <h4>{employee.empName}'s Deductions</h4>
                    
                    <div className="select-group">
                      <label>Allowances</label>
                      <Select
                        isMulti
                        name={`allowances-${employee.pysId}`}
                        options={allowanceOptions}
                        className="deduction-select"
                        classNamePrefix="select"
                        placeholder="Select allowances..."
                        onChange={(selected) => handleDeductionChange(
                          employee,
                          selected || []
                        )}
                      />
                    </div>
                    
                    <div className="select-group">
                      <label>Bonuses</label>
                      <Select
                        isMulti
                        name={`bonuses-${employee.pysId}`}
                        options={bonusOptions}
                        className="deduction-select"
                        classNamePrefix="select"
                        placeholder="Select bonuses..."
                        onChange={(selected) => handleDeductionChange(
                          employee,
                          selected || []
                        )}
                      />
                    </div>
                    
                    <div className="select-group">
                      <label>Taxes</label>
                      <Select
                        isMulti
                        name={`taxes-${employee.pysId}`}
                        options={taxOptions}
                        className="deduction-select"
                        classNamePrefix="select"
                        placeholder="Select taxes..."
                        onChange={(selected) => handleDeductionChange(
                          employee,
                          selected || []
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="submit-button" onClick={handleConfirm}>
            Confirm Mark as Completed
          </button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MarkAsCompletedModal;