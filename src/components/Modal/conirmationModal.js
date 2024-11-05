import React from "react";
import "./modal.css"; // Custom CSS for modal styling
import Lottie from "lottie-react";

const ConirmationModal = ({ isOpen, message, onConfirm, onCancel, animationData, successModal, warningModal }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay-modal">
        <div className="modal-content-modal">
          <Lottie animationData={animationData} loop={false} />
          <p>{message}</p>
          {!successModal && !warningModal && (

              <div className="modal-buttons-modal">
            <button className="submit-button" onClick={onConfirm}>
              Confirm
            </button>
            <button className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        )}
          {warningModal && (

              <div className="modal-buttons-modal">
            
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
