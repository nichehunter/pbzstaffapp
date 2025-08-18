import React from "react";

export const PDFPreviewer = ({ base64Data }) => {
  const base64ToBlob = (base64) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  };

  const handlePreviewClick = () => {
    const blob = base64ToBlob(base64Data);
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div>
      <button className="btn btn-light btn-sm" onClick={handlePreviewClick}>
        Preview PDF
      </button>
    </div>
  );
};
