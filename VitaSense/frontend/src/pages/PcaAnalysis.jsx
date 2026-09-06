import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function PcaAnalysis({ appData }) {
    if (!appData || appData.status !== 'success' || !appData.pca) {
        return (
            <div className="animate-fade-in">
                <h1>Principal Component Analysis (PCA)</h1>
                <p>{appData && appData.pca_error ? appData.pca_error : 'Please load sufficient dataset for PCA (min 2 samples).'}</p>
            </div>
        );
    }

    const { points, variance } = appData.pca;

    const affected = points.filter(p => p.Label.toLowerCase().includes('iseased') || p.Label.toLowerCase().includes('affected') && !p.Label.toLowerCase().includes('unaffected'));
    const unaffected = points.filter(p => p.Label.toLowerCase().includes('una') || p.Label.toLowerCase().includes('healthy'));

    return (
        <div className="animate-fade-in">
            <h1>Principal Component Analysis</h1>
            <p>Unsupervised linear dimensionality reduction projecting multi-sensor features.</p>

            <div className="grid grid-cols-3">
                <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
                    <h3>PCA Scatter Plot</h3>
                    <div className="chart-container" style={{ height: '500px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    type="number"
                                    dataKey="PC1"
                                    name="PC1"
                                    stroke="#6b7280"
                                    tick={{ fill: '#374151', fontSize: 11 }}
                                    label={{
                                        value: `PC1 — ${variance.pc1.toFixed(1)}% variance`,
                                        position: 'insideBottom',
                                        offset: -30,
                                        fill: '#374151',
                                        fontSize: 12,
                                        fontWeight: 600
                                    }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="PC2"
                                    name="PC2"
                                    stroke="#6b7280"
                                    tick={{ fill: '#374151', fontSize: 11 }}
                                    label={{
                                        value: `PC2 — ${variance.pc2.toFixed(1)}% variance`,
                                        angle: -90,
                                        position: 'insideLeft',
                                        offset: -40,
                                        fill: '#374151',
                                        fontSize: 12,
                                        fontWeight: 600
                                    }}
                                />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    contentStyle={{ background: '#fff', borderColor: '#e5e7eb', borderRadius: '8px', color: '#1a2e1e', fontSize: '12px' }}
                                />
                                <Legend
                                    wrapperStyle={{ color: '#374151', fontSize: '13px', paddingTop: '8px' }}
                                    verticalAlign="top"
                                />
                                <Scatter name="Diseased" data={affected} fill="#dc2626">
                                    {affected.map((_, index) => (
                                        <Cell key={`cell-aff-${index}`} fill="#dc2626" />
                                    ))}
                                </Scatter>
                                <Scatter name="Unaffected" data={unaffected} fill="#16a34a">
                                    {unaffected.map((_, index) => (
                                        <Cell key={`cell-unaff-${index}`} fill="#16a34a" />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                <div className="glass-panel">
                    <h3>Explained Variance</h3>
                    <ul style={{ listStyle: 'none', lineHeight: '2' }}>
                        <li><strong style={{ color: 'var(--primary)' }}>PC1:</strong> {variance.pc1.toFixed(2)}%</li>
                        <li><strong style={{ color: 'var(--secondary)' }}>PC2:</strong> {variance.pc2.toFixed(2)}%</li>
                        <hr style={{ borderColor: 'var(--card-border)', margin: '1rem 0' }} />
                        <li><strong>Cumulative:</strong> {variance.cumulative.toFixed(2)}%</li>
                    </ul>

                    <div style={{ marginTop: '2rem' }}>
                        <h4>Data Preprocessing for PCA</h4>
                        <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
                            <li>Samples: {points.length}</li>
                            <li>Label column excluded</li>
                            <li>Features standardized (Z-score)</li>
                            <li>Missing values handled locally</li>
                        </ul>
                    </div>

                    {/* MQ3 finding note */}
                    <div style={{
                        marginTop: '1.5rem',
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderLeft: '4px solid #16a34a',
                        borderRadius: '8px',
                        padding: '0.85rem 1rem',
                        fontSize: '0.8rem',
                        color: '#14532d',
                        lineHeight: 1.6
                    }}>
                        <strong>📊 Sensor Insight</strong><br />
                        MQ3 features are the dominant contributors to PC1, driving the visible class
                        separation between Diseased and Unaffected clusters. MQ135 features contribute
                        less to discriminability in this feature space.
                    </div>
                </div>
            </div>
        </div>
    );
}
