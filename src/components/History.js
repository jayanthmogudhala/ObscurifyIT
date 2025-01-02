import React, { useState, useEffect } from 'react';
import './History.css';

function History() {
    const [redactedFiles, setRedactedFiles] = useState([]);
    const [loading, setLoading] = useState(true); // Initially set to true

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/redaction-history'); // Fetch history
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorData?.message || "Unknown error"}`);
                }

                const data = await response.json();
                setRedactedFiles(data.history); // Set fetched history
            } catch (error) {
                console.error("Error fetching redaction history:", error);
                setRedactedFiles( [ { originalName: 'Error', redactedContent: error.message }] );
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="history-container">
            <h2>History</h2>
            <p>Previously downloaded files</p>

            {loading ? (
                <p>Loading history...</p>
            ) : (
                redactedFiles.length > 0 ? (
                    <ul>
                        {redactedFiles.map((item, index) => (
                            <li key={index}>
                                <p><strong>Original File:</strong> {item.originalName}</p>
                                <p><strong>Redacted Content:</strong></p>
                            
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No files redacted yet.</p>
                )
            )}
        </div>
    );
}

export default History;