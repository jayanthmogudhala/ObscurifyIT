import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import axios from 'axios'; // Import axios

function Home() {
    const [selectedFileType, setSelectedFileType] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [file, setFile] = useState(null)
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const uploadContainerRef = useRef(null);
      const [isSubmited, setIsSubmited] = useState(false)


    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = true;
            video.loop = true;

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Autoplay prevented");
                });
            }
        }
    }, []);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionSelect = (option) => {
        setSelectedFileType(option);
        setIsDropdownOpen(false);
          setIsSubmited(false)
           setSelectedFileName('')
         setFile(null);
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
      if (file) {
              setSelectedFileName(file.name);
              setFile(file)

        } else {
            setSelectedFileName('');
            setFile(null);


        }
        setIsSubmited(false);

    };

    const handleSubmit = async () => {
        if (!file) {
           alert("No file selected");
        return;
        }
       setIsSubmited(true);
       alert("Submit successful!")

    };
   const handleDownload = async () => {
     if (!isSubmited || !file) {
      alert("You can't download file. first submit it.")
      return
        }
        try {
           const formData = new FormData();
           formData.append('file', file)
          const response = await axios.post('http://localhost:5000/api/process', formData, {
            responseType: 'blob',
                headers: {
            'Content-Type': 'multipart/form-data',
           },
          });

        const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
            link.href = url;
      link.setAttribute('download',  `${selectedFileName}` ); // Corrected this line
       document.body.appendChild(link);
            link.click();
            link.remove();
           window.URL.revokeObjectURL(url)
        } catch (error) {
      console.error('Error downloading file:', error);
    alert('Error downloading file. Check console for details.');

        }

   }



    const handleDragOver = (event) => {
        event.preventDefault();
        if (uploadContainerRef.current) {
            uploadContainerRef.current.classList.add('dragover');
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        if (uploadContainerRef.current) {
            uploadContainerRef.current.classList.remove('dragover');
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (uploadContainerRef.current) {
            uploadContainerRef.current.classList.remove('dragover');
        }
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
             setSelectedFileName(files[0].name);
              setFile(files[0]);

            fileInputRef.current.files = files;
        }
          setIsSubmited(false);
    };

    return (
        <div className="home-container">
            <video ref={videoRef} className="background-video" src="/bg.mp4" muted loop autoPlay />
            <div className="home-content">
                <h1 className="title">Welcome to ObscurifyIT</h1>
                <p className="description">Securely handle and obscure sensitive information from images, PDFs, and CSVs.</p>
                  <div className="selection-area">
                      <div className="file-selection">
                          <label htmlFor="fileType" className="label">Select File Type to Obscure</label>
                           <div className="dropdown-button-container">
                              <button className="dropdown-button" onClick={handleDropdownToggle}>
                                  <span className="button-text">
                                    {selectedFileType || 'Choose File'}
                                  </span>
                                  <span className="dropdown-arrow">▼</span>
                              </button>
                                {isDropdownOpen && (
                                    <ul className="dropdown-menu">
                                      <li onClick={() => handleOptionSelect('image')}>Image</li>
                                       <li onClick={() => handleOptionSelect('pdf')}>PDF</li>
                                       <li onClick={() => handleOptionSelect('csv')}>CSV</li>
                                    </ul>
                                  )}
                           </div>
                    </div>
                 {selectedFileType && (
                    <div className="upload-container"
                     ref={uploadContainerRef}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     onDrop={handleDrop}
                      >
                    <label htmlFor="fileInput" className="label">Upload {selectedFileType.toUpperCase()} File:</label>
                    <button className="upload-button" onClick={handleButtonClick}>Choose File</button>
                        <input
                        type="file"
                            className="file-input"
                           style={{ display: 'none' }}
                         onChange={handleFileSelect}
                           ref={fileInputRef}
                        />
                       <span className="file-name">{selectedFileName}</span>
                         <p className="drag-drop-text">or drop files here</p>
                   </div>
                )}
              </div>
             <div className="button-container">
            {selectedFileName && selectedFileType && (
              <>
              <button className="submit-button" onClick={handleSubmit}>Submit</button>
                   <button className="download-button" onClick={handleDownload}>Download</button>

              </>
        )}
        </div>
    </div>
        </div>
    );
}

export default Home;