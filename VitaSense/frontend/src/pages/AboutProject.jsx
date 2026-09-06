import React from 'react';

export default function AboutProject() {
    return (
        <div className="animate-fade-in">
            <h1>About Project</h1>
            <p>Pre-Symptomatic Mango Disease Detection Using VOC Fingerprints From a Gas Sensor Array and Machine Learning</p>

            <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
                <div className="glass-panel">
                    <h3>Problem Statement & Objectives</h3>
                    <p>Mango diseases lead to significant yield losses. Visual detection only happens after symptoms appear, which is often too late for effective intervention. Current laboratory methods are expensive and time-consuming.</p>
                    <p><strong>Objectives:</strong></p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                        <li>Develop a non-invasive, cost-effective Electronic Nose (E-nose).</li>
                        <li>Capture Volatile Organic Compounds (VOC) emitted by mango leaves.</li>
                        <li>Analyze sensor response patterns to differentiate healthy and diseased states.</li>
                    </ul>
                </div>

                <div className="glass-panel">
                    <h3>Current Implementation (Review 2)</h3>
                    <p>The current phase demonstrates the core data acquisition and analysis pipeline:</p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                        <li><strong>Hardware Prototype:</strong> Custom sealed chamber with MQ-3 (Alcohol) and MQ-135 (Air Quality/NH3) sensors.</li>
                        <li><strong>Data Acquisition:</strong> ESP32-based logging to CSV format with controlled 15-minute exposure periods.</li>
                        <li><strong>Analysis Pipeline:</strong> Automated validation, standard preprocessing (Delta, %), statistical feature extraction, and linear PCA projection.</li>
                        <li><strong>Observation:</strong> Exploring VOC clustering potential utilizing solely MQ-sensor dynamics without prior labeling bias during dimensionality reduction.</li>
                    </ul>
                </div>

                <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
                    <h3>Proposed Architecture & Future Work</h3>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ color: 'var(--primary)' }}>Data Collection Phase</h4>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, opacity: 0.8 }}>
                                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>Integrate MQ-138 and TGS2602 sensors</li>
                                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>Add DHT22 for Temperature/Humidity compensation</li>
                                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>Expand dataset longitudinally for actual pre-symptomatic tracking</li>
                            </ul>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ color: 'var(--secondary)' }}>Machine Learning Phase</h4>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, opacity: 0.8 }}>
                                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>Evaluate Support Vector Machines (SVM)</li>
                                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>Evaluate Random Forest & KNN</li>
                                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>Cross-validation and model deployment</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
