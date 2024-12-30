import React from 'react';
import './Help.css';

function Help() {
  const faqs = [
    {
      question: 'What is RE-DACT?',
      answer: 'RE-DACT is an automated redaction tool designed to anonymize, obfuscate, and mask sensitive information in text, images, PDFs, and videos.',
    },
    {
      question: 'How do I upload a file for redaction?',
      answer: 'On the home page, select the file type (CSV, image, or PDF) and click on the upload section. You can then browse and upload the desired file.',
    },
    {
      question: 'Which file formats are supported?',
      answer: 'Currently, RE-DACT supports CSV files for structured data, image formats like JPEG and PNG, PDF documents, and videos in common formats like MP4.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, RE-DACT is designed with security in mind. All file uploads and processed data are handled securely and deleted after processing.',
    },
    {
      question: 'Can I customize the redaction process?',
      answer: 'Yes, RE-DACT offers options for customized redaction. You can specify sensitive fields in structured data or areas to redact in images.',
    },
  ];

  return (
    <div className="help-container">
      <h1 className="help-title">Help & FAQ</h1>
      <div className="faq-section">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h2 className="faq-question">{faq.question}</h2>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Help;
