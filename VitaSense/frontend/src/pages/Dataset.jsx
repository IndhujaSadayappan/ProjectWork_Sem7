import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Dataset({ appData, onUpdate, apiBase }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleLoadDefault = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const res = await axios.get(`${apiBase}/load-default`);
            const results = await axios.get(`${apiBase}/analysis-results`);
            onUpdate(results.data);
        } catch (err) {
            setErrorMsg('Failed to load default dataset');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        setLoading(true);
        setErrorMsg(null);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            await axios.post(`${apiBase}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const results = await axios.get(`${apiBase}/analysis-results`);
            onUpdate(results.data);
        } catch (err) {
            setErrorMsg('Failed to upload and process files');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isLoaded = appData && appData.status === 'success';

    return (
        <div className="animate-fade-in">
            <h1>Dataset Management</h1>
            <p>Upload and validate Mango VOC sensor readings</p>

            {errorMsg && <div className="alert-error">{errorMsg}</div>}

            <div className="grid grid-cols-2">
                <div className="glass-panel text-center">
                    <h3 style={{ marginBottom: '1rem' }}>Demo Initialization</h3>
                    <p>Load the 30 samples provided in the data_phase2 folder to demonstrate the review-2 application seamlessly.</p>
                    <button className="btn btn-primary" onClick={handleLoadDefault} disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Processing...' : 'Load Default Dataset'}
                    </button>
                </div>

                <div className="glass-panel">
                    <label className="upload-zone" style={{ display: 'block' }}>
                        <input type="file" multiple accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} disabled={loading} />
                        <UploadCloud className="upload-icon" />
                        <h3>Upload CSV Files</h3>
                        <p>Drag and drop or click to select multiple experimental samples</p>
                    </label>
                </div>
            </div>

            {isLoaded && appData.validation && (
                <div style={{ marginTop: '2rem' }}>
                    <div className="glass-panel">
                        <h3>Data Validation Report</h3>
                        <div className="grid grid-cols-3" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <span className="stat-title">Files Received</span>
                                <div className="stat-value" style={{ fontSize: '2rem' }}>{appData.validation.files_received}</div>
                            </div>
                            <div>
                                <span className="stat-title" style={{ color: 'var(--success)' }}>Valid Files</span>
                                <div className="stat-value" style={{ fontSize: '2rem' }}>{appData.validation.valid_files}</div>
                            </div>
                            <div>
                                <span className="stat-title" style={{ color: 'var(--danger)' }}>Invalid Files</span>
                                <div className="stat-value" style={{ fontSize: '2rem' }}>{appData.validation.invalid_files}</div>
                            </div>
                        </div>

                        {appData.validation.errors && appData.validation.errors.length > 0 && (
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ color: 'var(--danger)' }}>Validation Errors</h4>
                                <ul style={{ listStyle: 'none' }}>
                                    {appData.validation.errors.map((err, i) => (
                                        <li key={i} style={{ padding: '0.5rem', background: 'rgba(239, 71, 111, 0.1)', borderRadius: '4px', marginBottom: '0.5rem' }}>
                                            <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--danger)' }} />
                                            {err.filename}: {err.reason}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ marginTop: '2rem' }}>
                        <h3>Valid Samples Preview</h3>
                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Sample ID</th>
                                        <th>Label</th>
                                        <th>Baseline MQ-3</th>
                                        <th>Baseline MQ-135</th>
                                        <th>Data Points</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appData.dataset.map(s => (
                                        <tr key={s.sample_id}>
                                            <td>{s.sample_id}</td>
                                            <td>
                                                <span className={`status-badge ${s.label.toLowerCase().includes('iseased') ? 'badge-danger' : 'badge-success'}`}>
                                                    {s.label}
                                                </span>
                                            </td>
                                            <td>{s.baseline_mq3}</td>
                                            <td>{s.baseline_mq135}</td>
                                            <td>{s.data.length} pts</td>
                                            <td><CheckCircle size={16} color="var(--success)" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
