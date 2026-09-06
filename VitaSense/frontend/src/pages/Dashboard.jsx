import React from 'react';
import { Activity, Beaker, FileCheck, Layers } from 'lucide-react';

export default function Dashboard({ appData }) {
    const isLoaded = appData && appData.status === 'success';

    const stats = isLoaded ? {
        total: appData.dataset.length,
        affected: appData.dataset.filter(s => s.label.toLowerCase().includes('iseased') || s.label.toLowerCase().includes('affected') && !s.label.toLowerCase().includes('unaffected')).length,
        unaffected: appData.dataset.filter(s => s.label.toLowerCase().includes('una') || s.label.toLowerCase().includes('healthy')).length,
        sensors: 'MQ-3 + MQ-135'
    } : { total: 0, affected: 0, unaffected: 0, sensors: '-' };

    // Fallback counting logic since dataset labels might be 'Diseased' or 'Unaffected'
    if (isLoaded) {
        stats.affected = appData.dataset.filter(s => s.label.toLowerCase().includes('iseased')).length;
        stats.unaffected = appData.dataset.filter(s => !s.label.toLowerCase().includes('iseased')).length;
    }

    return (
        <div className="animate-fade-in">
            <h1>Project Dashboard</h1>
            <p>Overview of the VitaSense Mango VOC Analysis</p>

            <div className="grid grid-cols-4" style={{ marginTop: '2rem' }}>
                <div className="glass-panel stat-card">
                    <div className="flex-row">
                        <span className="stat-title">Total Samples</span>
                        <Layers size={20} color="#00b4d8" />
                    </div>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="glass-panel stat-card">
                    <div className="flex-row">
                        <span className="stat-title">Affected</span>
                        <Activity size={20} color="#ef476f" />
                    </div>
                    <div className="stat-value">{stats.affected}</div>
                </div>
                <div className="glass-panel stat-card">
                    <div className="flex-row">
                        <span className="stat-title">Unaffected</span>
                        <FileCheck size={20} color="#06d6a0" />
                    </div>
                    <div className="stat-value">{stats.unaffected}</div>
                </div>
                <div className="glass-panel stat-card">
                    <div className="flex-row">
                        <span className="stat-title">Sensors Active</span>
                        <Beaker size={20} color="#ffd166" />
                    </div>
                    <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: '1.5rem' }}>{stats.sensors}</div>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
                <div className="glass-panel">
                    <h3>Experiment Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Hardware Setup</span>
                            <span className="status-badge badge-success">Completed</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Data Collection (30 Samples)</span>
                            <span className="status-badge badge-success">Completed</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Feature Extraction</span>
                            <span className="status-badge badge-success">Current (Rev 2)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>PCA Analysis</span>
                            <span className="status-badge badge-success">Current (Rev 2)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Machine Learning Classification</span>
                            <span className="status-badge badge-accent">Future Work</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Pre-Symptomatic Validation</span>
                            <span className="status-badge badge-accent">Future Work</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel">
                    <h3>Analysis Pipeline</h3>
                    <ul style={{ listStyle: 'none', lineHeight: '2' }}>
                        <li><span style={{ color: '#06d6a0' }}>✔</span> CSV Data Validation</li>
                        <li><span style={{ color: '#06d6a0' }}>✔</span> Preprocessing (Delta & Percentage)</li>
                        <li><span style={{ color: '#06d6a0' }}>✔</span> Baseline Normalization</li>
                        <li><span style={{ color: '#06d6a0' }}>✔</span> Extracted 13 Features per Sensor</li>
                        <li><span style={{ color: '#06d6a0' }}>✔</span> Sensor Response Comparison</li>
                        <li><span style={{ color: '#06d6a0' }}>✔</span> Principal Component Analysis</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
