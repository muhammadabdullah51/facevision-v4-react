import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

const ImageCropper = ({ imageSrc, onCropSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Capture the cropped area pixels when cropping changes.
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    // (Optional) console.log("Cropped area pixels:", croppedAreaPixels);
  }, []);

  return (
    <div className="cropper-wrapper" style={{ marginTop: "1rem" }}>
      <div
        className="crop-container"
        style={{
          position: "relative",
          width: "100%",
          height: "300px",
          background: "#333",
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // Change this if you need a different ratio
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <button
        type="button"
        className="submit-button"
        style={{ marginTop: "0.5rem", zIndex: 10, position: "relative" }}
        onClick={() => {
          // Pass the latest crop coordinates to the parent
          if (croppedAreaPixels) {
            onCropSave(croppedAreaPixels);
          } else {
            console.warn("Cropped area not defined yet");
          }
        }}
      >
        Apply Crop
      </button>
    </div>
  );
};

export default ImageCropper;
