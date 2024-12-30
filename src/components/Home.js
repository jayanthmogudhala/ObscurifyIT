// Home.js
import React, { useRef, useState } from 'react';
import './Home.css';

function Home() {
  const fileInputRefs = {
    csv: useRef(null),
    image: useRef(null),
    pdf: useRef(null),
  };

  const [popupMessage, setPopupMessage] = useState('');

  const handleFileClick = (type) => {
    if (fileInputRefs[type]?.current) {
      fileInputRefs[type].current.click();
    }
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setPopupMessage(`${file.name} has been uploaded successfully!`);
      setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
    }
  };

  return (
    <div className="home-container">
      <h1 className="welcome-title">Welcome To Automated Redaction</h1>
      <div className="file-drop-section">
        <div className="file-drop" onClick={() => handleFileClick('csv')}>
          <p>Click to Upload CSV File</p>
          <input
            type="file"
            ref={fileInputRefs.csv}
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'csv')}
          />
        </div>
        <div className="file-drop" onClick={() => handleFileClick('image')}>
          <p>Click to Upload Image File</p>
          <input
            type="file"
            ref={fileInputRefs.image}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'image')}
          />
        </div>
        <div className="file-drop" onClick={() => handleFileClick('pdf')}>
          <p>Click to Upload PDF File</p>
          <input
            type="file"
            ref={fileInputRefs.pdf}
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'pdf')}
          />
        </div>
      </div>
      {popupMessage && <div className="popup-message">{popupMessage}</div>}
    </div>
  );
}

export default Home;
// import React, { useRef, useState } from 'react';
// import './Home.css';

// function Home() {
//     const fileInputRef = useRef(null);
//     const [uploadedImage, setUploadedImage] = useState(null);
//     const [redactedImage, setRedactedImage] = useState(null);

//     const handleFileClick = () => {
//         if (fileInputRef.current) {
//             fileInputRef.current.click();
//         }
//     };

//     const handleFileChange = async (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setUploadedImage(URL.createObjectURL(file));
//             const formData = new FormData();
//             formData.append('image', file);

//             const response = await fetch('http://localhost:5000/upload', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setRedactedImage(`data:image/jpeg;base64,${data.redactedImage}`);
//             } else {
//                 console.error('Error redacting image');
//             }
//         }
//     };

//     const downloadImage = () => {
//         if (redactedImage) {
//             const a = document.createElement('a');
//             a.href = redactedImage;
//             a.download = 'redacted_image.jpg';
//             a.click();
//         }
//     };

//     return (
//         <div className="home-container">
//             <h1 className="welcome-title">Welcome To Automated Redaction</h1>
//             <div className="file-drop" onClick={handleFileClick}>
//                 <p>Click to Upload Image File</p>
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     accept="image/*"
//                     style={{ display: 'none' }}
//                     onChange={handleFileChange}
//                 />
//             </div>
//             {uploadedImage && <img className="uploaded-image" src={uploadedImage} alt="Uploaded" />}
//             {redactedImage && (
//                 <div className="image-section">
//                     <img className="redacted-image" src={redactedImage} alt="Redacted" />
//                     <button className="download-button" onClick={downloadImage}>Download Redacted Image</button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Home;

