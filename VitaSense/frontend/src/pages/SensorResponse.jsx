import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const DISEASED_COLOR = '#dc2626';   // red  — Diseased
const UNAFFECTED_COLOR = '#16a34a';   // green — Unaffected

export default function SensorResponse({ appData }) {
    const [filter, setFilter] = useState('All');
    const [viewType, setViewType] = useState('raw');

    if (!appData || appData.status !== 'success') {
        return (
            <div className="animate-fade-in">
                <h1>Sensor Response</h1>
                <p>Please load dataset first to visualize sensor response.</p>
            </div>
        );
    }

    let samples = appData.dataset;
    if (filter === 'Affected') samples = samples.filter(s => s.label.toLowerCase().includes('iseased'));
    else if (filter === 'Unaffected') samples = samples.filter(s => !s.label.toLowerCase().includes('iseased'));
    else if (filter !== 'All') samples = samples.filter(s => s.sample_id === filter);

    // Merge all samples onto shared time axis
    const timeMap = {};
    samples.forEach(s => {
        s.data.forEach(dp => {
            const t = dp.Time_sec;
            if (!timeMap[t]) timeMap[t] = { time: t };
            let mq3, mq135;
            if (viewType === 'raw') { mq3 = dp.MQ3; mq135 = dp.MQ135; }
            else if (viewType === 'delta') { mq3 = dp.Delta_MQ3; mq135 = dp.Delta_MQ135; }
            else { mq3 = dp.Pct_MQ3; mq135 = dp.Pct_MQ135; }
            timeMap[t][`${s.sample_id}_mq3`] = mq3;
            timeMap[t][`${s.sample_id}_mq135`] = mq135;
        });
    });

    const chartData = Object.values(timeMap).sort((a, b) => a.time - b.time);

    // Two-color rule: red = Diseased, green = Unaffected
    const getColor = (s) => s.label.toLowerCase().includes('iseased') ? DISEASED_COLOR : UNAFFECTED_COLOR;

    // Shared chart props
    const axisStyle = { stroke: '#6b7280', fontSize: 12 };
    const gridStyle = { stroke: '#e5e7eb', strokeDasharray: '3 3' };
    const tooltipStyle = {
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#1a2e1e',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    };
    const yLabel = viewType === 'raw' ? 'ADC Value' : viewType === 'delta' ? 'Δ (ADC)' : '% Response';

    return (
        <div className="animate-fade-in">
            <h1>Sensor Response Visualization</h1>

            {/* ── MQ3 Key Finding Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                border: '1.5px solid #86efac',
                borderLeft: '5px solid #16a34a',
                borderRadius: '10px',
                padding: '0.9rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem'
            }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1, marginTop: '2px' }}>📊</span>
                <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#14532d', fontSize: '0.9rem' }}>
                        Key Finding — MQ3 is the Superior Classifying Sensor
                    </p>
                    <p style={{ margin: '0.25rem 0 0', color: '#166534', fontSize: '0.82rem', lineHeight: 1.6 }}>
                        Graph analysis shows that <strong>MQ3 produces a larger, more consistent response gap</strong> between
                        Diseased and Unaffected samples. MQ3's percentage response and AUC clearly separate the two classes,
                        making it the dominant VOC indicator. MQ135 shows lower and overlapping responses under current conditions.
                    </p>
                </div>
            </div>

            {/* ── Controls ── */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                    <div>
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter Samples</h4>
                        <div className="pills" style={{ marginBottom: 0 }}>
                            {['All', 'Affected', 'Unaffected'].map(f => (
                                <div key={f} className={`pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Mode</h4>
                        <div className="pills" style={{ marginBottom: 0 }}>
                            {[['raw', 'Raw ADC'], ['delta', 'Δ Baseline'], ['pct', '% Response']].map(([v, l]) => (
                                <div key={v} className={`pill ${viewType === v ? 'active' : ''}`} onClick={() => setViewType(v)}>{l}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <select
                        onChange={e => setFilter(e.target.value)}
                        value={filter}
                        style={{
                            padding: '0.5rem 0.75rem',
                            background: '#fff',
                            color: '#1a2e1e',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            width: '280px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All">— Or select individual sample —</option>
                        {appData.dataset.map(s => (
                            <option key={s.sample_id} value={s.sample_id}>
                                {s.sample_id} — {s.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-2">
                {/* MQ3 Chart */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{
                            background: '#dcfce7', color: '#15803d',
                            borderRadius: '6px', padding: '0.2rem 0.6rem',
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em'
                        }}>PRIMARY SENSOR</span>
                        <h3 style={{ margin: 0 }}>MQ-3 (Alcohol / Ethylene VOCs)</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                                <CartesianGrid {...gridStyle} />
                                <XAxis
                                    dataKey="time"
                                    {...axisStyle}
                                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -15, fill: '#6b7280', fontSize: 12 }}
                                />
                                <YAxis
                                    {...axisStyle}
                                    label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10, fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip contentStyle={tooltipStyle} />
                                {samples.map(s => (
                                    <Line
                                        key={`${s.sample_id}_mq3`}
                                        type="monotone"
                                        dataKey={`${s.sample_id}_mq3`}
                                        name={`${s.sample_id} (MQ3)`}
                                        stroke={getColor(s)}
                                        dot={false}
                                        strokeWidth={filter === s.sample_id ? 3 : 1.8}
                                        strokeOpacity={filter === s.sample_id || filter === 'All' ? 1 : 0.6}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#dc2626' }}>
                            <span style={{ width: 16, height: 3, background: '#dc2626', display: 'inline-block', borderRadius: 2 }} /> Diseased
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#16a34a' }}>
                            <span style={{ width: 16, height: 3, background: '#16a34a', display: 'inline-block', borderRadius: 2 }} /> Unaffected
                        </span>
                    </div>
                </div>

                {/* MQ135 Chart */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{
                            background: '#f1f5f9', color: '#475569',
                            borderRadius: '6px', padding: '0.2rem 0.6rem',
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em'
                        }}>SECONDARY SENSOR</span>
                        <h3 style={{ margin: 0 }}>MQ-135 (Air Quality / NH₃)</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                                <CartesianGrid {...gridStyle} />
                                <XAxis
                                    dataKey="time"
                                    {...axisStyle}
                                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -15, fill: '#6b7280', fontSize: 12 }}
                                />
                                <YAxis
                                    {...axisStyle}
                                    label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10, fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip contentStyle={tooltipStyle} />
                                {samples.map(s => (
                                    <Line
                                        key={`${s.sample_id}_mq135`}
                                        type="monotone"
                                        dataKey={`${s.sample_id}_mq135`}
                                        name={`${s.sample_id} (MQ135)`}
                                        stroke={getColor(s)}
                                        dot={false}
                                        strokeWidth={filter === s.sample_id ? 3 : 1.8}
                                        strokeOpacity={filter === s.sample_id || filter === 'All' ? 1 : 0.6}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#dc2626' }}>
                            <span style={{ width: 16, height: 3, background: '#dc2626', display: 'inline-block', borderRadius: 2 }} /> Diseased
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#16a34a' }}>
                            <span style={{ width: 16, height: 3, background: '#16a34a', display: 'inline-block', borderRadius: 2 }} /> Unaffected
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
