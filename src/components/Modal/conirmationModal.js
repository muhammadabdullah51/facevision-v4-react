import React from "react";
import "./modal.css"; // Custom CSS for modal styling
import Lottie from "lottie-react";

const ConirmationModal = ({ isOpen, message, onConfirm, onCancel, animationData, successModal }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <Lottie animationData={animationData} loop={false} />
          <p>{message}</p>
          {!successModal && (

              <div className="modal-buttons">
            <button className="submit-button" onClick={onConfirm}>
              Confirm
            </button>
            <button className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        )}
        </div>
      </div>
    );
  };
export default ConirmationModal
