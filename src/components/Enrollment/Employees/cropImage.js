// cropImage.js
export default function getCroppedImg(imageSrc, croppedAreaPixels) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous"; // Ensures cross-origin images can be used
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext("2d");
  
        // Draw the cropped portion of the image onto the canvas
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
  
        // Convert the canvas content to a Data URL (base64 encoded PNG)
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  }
  