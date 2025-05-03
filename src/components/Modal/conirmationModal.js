import React, { useEffect, useRef } from "react";
import "./modal.css"; // Custom CSS for modal styling
import Lottie from "lottie-react";

const ConirmationModal = ({ isOpen, message, onConfirm, onCancel, animationData, successModal, warningModal }) => {

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element when modal opens
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      // Handle Escape key
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          onCancel();
        }

        // Trap focus within modal
        if (event.key === 'Tab') {
          const focusableContent = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          const firstFocusable = focusableContent[0];
          const lastFocusable = focusableContent[focusableContent.length - 1];

          if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              event.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              event.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-modal">
      <div className="modal-content-modal" ref={modalRef} role="dialog"
        aria-modal="true"
        tabIndex="-1">
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
