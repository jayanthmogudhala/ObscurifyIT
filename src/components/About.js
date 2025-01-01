import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-content-wrapper">
        <section className="hero-section">
          <div className="hero-content">
            <h1>About ObcusrifyIT</h1>
            <p>
              Secure your data with RE-DACT, the automated redaction tool that ensures
              privacy across all your sensitive documents.
            </p>
            <a href="#features" className="learn-more-btn">
              Learn More
            </a>
          </div>
          <div className="hero-image-container">
            <img src="/km.jpg" alt="Redaction Illustration" className="hero-image" />
          </div>
        </section>

        <section id="features" className="features-section">
          <h2>Key Features</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <img src="Redacted_image/redacted_pan_output.jpg" alt="Text Redaction" className="feature-icon" />
              <h3>Intelligent Text Redaction</h3>
              <p>
                Powered by advanced models for context-aware anonymization, ensuring
                sensitive text data is securely redacted.
              </p>
            </div>
            <div className="feature-card">
              <img src="Redacted_image/csv image.jpg" alt="Data Anonymization" className="feature-icon" />
              <h3>Secure Structured Data</h3>
              <p>
                Generates high-quality, synthetic datasets using cutting-edge techniques to
                maintain statistical integrity while protecting privacy.
              </p>
            </div>
            <div className="feature-card">
              <img src="/image-redaction.svg" alt="Image Redaction" className="feature-icon" />
              <h3>Advanced Image Redaction</h3>
              <p>
                Detects and masks sensitive regions, such as faces and even text in image, with
                high accuracy using sophisticated algorithms.
              </p>
            </div>
          </div>
        </section>

        <section className="commitment-section">
          <div className="commitment-content">
            <h2>Our Commitment</h2>
            <p>
              We are dedicated to providing top-tier security, cutting-edge
              technology, and constant innovation to protect your sensitive information.
              We understand that protecting your data and maintaining your trust is our top priority.
            </p>
          </div>
          <div className="commitment-image-container">
            <img src="/commitment.svg" alt="Commitment Illustration" className="commitment-image" />
          </div>
        </section>

        <section className="value-section">
          <h2>Why Choose ObcusrifyIT?</h2>
          <div className="value-points">
            <div className="value-point">
              <h3>Efficiency</h3>
              <p>Automated redaction saves you time and resources, eliminating tedious manual processes.</p>
            </div>
            <div className="value-point">
              <h3>Accuracy</h3>
              <p>Minimize errors and maintain precision in redaction tasks with our intelligent algorithms.</p>
            </div>
            <div className="value-point">
              <h3>Compliance</h3>
              <p>Ensure adherence to data privacy regulations like HIPAA, GDPR, and other standards.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
