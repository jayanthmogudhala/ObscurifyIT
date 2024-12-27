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
