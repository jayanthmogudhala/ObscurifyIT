import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About RE-DACT</h1>
        <p>
          Safeguarding sensitive information has never been more critical in the era of data-driven innovation. 
          RE-DACT is here to provide an end-to-end, automated solution for secure data handling and redaction.
        </p>
      </div>
      <div className="about-content">
        <p>
          The proliferation of digital data across industries such as healthcare, finance, and research has made 
          safeguarding sensitive information a critical priority. RE-DACT, our automated redaction tool, provides 
          a robust, versatile solution for obfuscating, anonymizing, and masking sensitive information across 
          diverse data formats, including text, images, PDFs, and videos.
        </p>
        <p>
          The primary objective of this project is to ensure secure data handling while preserving data utility, 
          enabling compliance with stringent data privacy regulations like HIPAA and GDPR.
        </p>
        <p>
          <strong>Key Features:</strong>
        </p>
        <ul>
          <li>
            <strong>Text Redaction:</strong> Powered by BERT-based models for precise, context-aware anonymization.
          </li>
          <li>
            <strong>Structured Data:</strong> Uses PATE-GAN for generating high-quality synthetic datasets with 
            statistical integrity.
          </li>
          <li>
            <strong>Image Redaction:</strong> Employs OpenCV for detecting and masking sensitive regions like 
            faces and signatures.
          </li>
        </ul>
        <p>
          By leveraging state-of-the-art technologies, RE-DACT balances the dual imperatives of data privacy and utility, 
          providing a scalable, automated redaction solution to meet the growing demand for secure data handling.
        </p>
      </div>
    </div>
  );
}

export default About;
