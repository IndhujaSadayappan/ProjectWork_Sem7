import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FeatureAnalysis({ appData }) {
    if (!appData || appData.status !== 'success') {
        return (
            <div className="animate-fade-in">
                <h1>Feature Analysis</h1>
                <p>Please load dataset.</p>
            </div>
        );
    }

    const features = appData.features;

    // Group by label 
    const affected = features.filter(f => f.Label.toLowerCase().includes('iseased') || f.Label.toLowerCase().includes('affected') && !f.Label.toLowerCase().includes('unaffected'));
    const unaffected = features.filter(f => f.Label.toLowerCase().includes('una') || f.Label.toLowerCase().includes('healthy'));

    // Calculate averages for key features
    const calcAvg = (group, key) => {
        if (group.length === 0) return 0;
        const sum = group.reduce((acc, curr) => acc + curr[key], 0);
        return (sum / group.length).toFixed(2);
    };

    const comparisonData = [
        {
            name: 'MQ3 Max %',
            Affected: calcAvg(affected, 'MQ3_PercentageResponse'),
            Unaffected: calcAvg(unaffected, 'MQ3_PercentageResponse')
        },
        {
            name: 'MQ135 Max %',
            Affected: calcAvg(affected, 'MQ135_PercentageResponse'),
            Unaffected: calcAvg(unaffected, 'MQ135_PercentageResponse')
        },
        {
            name: 'MQ3 AUC/1000',
            Affected: (calcAvg(affected, 'MQ3_AUC') / 1000).toFixed(2),
            Unaffected: (calcAvg(unaffected, 'MQ3_AUC') / 1000).toFixed(2)
        },
        {
            name: 'MQ135 AUC/1000',
            Affected: (calcAvg(affected, 'MQ135_AUC') / 1000).toFixed(2),
            Unaffected: (calcAvg(unaffected, 'MQ135_AUC') / 1000).toFixed(2)
        }
    ];

    return (
        <div className="animate-fade-in">
            <h1>Feature Analysis</h1>
            <p>Comparing mathematically extracted numerical features between groups.</p>

            {/* ── MQ3 Key Finding Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                border: '1.5px solid #86efac',
                borderLeft: '5px solid #16a34a',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem'
            }}>
                <span style={{ fontSize: '1.4rem', lineHeight: 1, marginTop: '2px' }}>📊</span>
                <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#14532d', fontSize: '0.95rem' }}>
                        Key Finding — MQ3 is the Superior Discriminating Sensor
                    </p>
                    <p style={{ margin: '0.3rem 0 0', color: '#166534', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        Graph analysis reveals that <strong>MQ3 produces a significantly larger and more consistent
                            percentage response gap</strong> between Diseased and Unaffected samples compared to MQ135.
                        MQ3's AUC and Max response show clear class separation, making it the primary VOC indicator
                        for pre-symptomatic mango disease classification. MQ135 shows overlap and lower
                        discriminatory power under current experimental conditions.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2">
                <div className="glass-panel">
                    <h3>Average Key Features Comparison</h3>
                    <div className="chart-container" style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#374151', fontSize: 12 }} />
                                <YAxis stroke="#6b7280" tick={{ fill: '#374151', fontSize: 12 }} />
                                <Tooltip contentStyle={{ background: '#fff', borderColor: '#e5e7eb', borderRadius: '8px', color: '#1a2e1e', fontSize: '12px' }} />
                                <Legend wrapperStyle={{ color: '#374151', fontSize: '13px' }} />
                                <Bar dataKey="Affected" fill="#dc2626" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Unaffected" fill="#16a34a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel" style={{ overflowY: 'auto', maxHeight: '500px' }}>
                    <h3>Sample Feature Matrix Extracted (Preview)</h3>
                    <table className="data-table" style={{ fontSize: '0.8rem' }}>
                        <thead>
                            <tr>
                                <th>Sample</th>
                                <th>MQ3 Max</th>
                                <th>MQ3 %Resp</th>
                                <th>MQ135 Max</th>
                                <th>MQ135 %Resp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((f, i) => (
                                <tr key={i}>
                                    <td>{f.Sample_ID}</td>
                                    <td>{f.MQ3_Max.toFixed(2)}</td>
                                    <td>{f.MQ3_PercentageResponse.toFixed(2)}%</td>
                                    <td>{f.MQ135_Max.toFixed(2)}</td>
                                    <td>{f.MQ135_PercentageResponse.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
