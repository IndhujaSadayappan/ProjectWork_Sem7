import React from 'react';
import { Lightbulb, Info } from 'lucide-react';

export default function Insights({ appData }) {
    if (!appData || appData.status !== 'success') {
        return (
            <div className="animate-fade-in">
                <h1>Results & Insights</h1>
                <p>Please load dataset to generate insights.</p>
            </div>
        );
    }

    const paragraphs = appData.insights.insights.split('\n\n').filter(p => p.trim() !== '');

    return (
        <div className="animate-fade-in">
            <h1>Data-Driven Insights</h1>
            <p>Automated feature and dimensional synthesis based on current Review 2 evaluation.</p>

            <div className="glass-panel" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Lightbulb size={24} color="#ffd166" />
                    <h3 style={{ margin: 0 }}>Automated Observations</h3>
                </div>

                <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#fff' }}>
                    {paragraphs.map((p, i) => (
                        <p key={i} style={{ marginBottom: '1.5rem' }}>{p}</p>
                    ))}
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Info size={24} color="var(--secondary)" />
                    <h3 style={{ margin: 0 }}>Review 2 Scientific Limitations</h3>
                </div>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                    <li>Only MQ-3 and MQ-135 are currently used. Future phases will integrate MQ-138, TGS2602, and DHT22.</li>
                    <li>The current dataset contains {appData.dataset.length} manually screened samples (Affected and Unaffected).</li>
                    <li>The current analysis demonstrates pattern differences and cluster separability (PCA) but does NOT classify unlabeled data.</li>
                    <li>This dataset alone does NOT definitively establish longitudinal pre-symptomatic detection. Larger temporal studies are needed.</li>
                </ul>
            </div>
        </div>
    );
}
