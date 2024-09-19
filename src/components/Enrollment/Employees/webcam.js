// WebcamModal.jsx
import React from "react";
import Webcam from "react-webcam";
import "./webcam.css"; // Include your custom styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";

const WebcamModal = ({ isOpen, onClose, onCapture }) => {
    const webcamRef = React.useRef(null);

    // Function to capture the picture from the webcam
    const capturePicture = () => {
        const imageSrc = webcamRef.current.getScreenshot(); 
        onCapture(imageSrc); 
        onClose(); 
    };

    if (!isOpen) return null; // Don't render anything if the modal is not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                <div className="webcam-buttons">
                    <button type="button" onClick={capturePicture}>
                        <FontAwesomeIcon icon={faCamera} /> Capture Picture
                    </button>
                    <button type="button" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} /> Close Webcam
                    </button>
                </div>


            </div>
        </div>
    );
};

export default WebcamModal;
