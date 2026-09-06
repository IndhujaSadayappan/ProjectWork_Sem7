import React from 'react';

export default function FieldVisit() {
    return (
        <div className="animate-fade-in">
            <h1>Field Visit & Hardware Setup</h1>
            <p>Visual documentation of the device deployment and testing in the field.</p>

            <div className="grid grid-cols-1">
                {/* ── Field Visit Video ── */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{
                            background: '#dcfce7', color: '#15803d',
                            borderRadius: '6px', padding: '0.2rem 0.6rem',
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em'
                        }}>FIELD VISIT VIDEO</span>
                        <h3 style={{ margin: 0 }}>Field Visit Video</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <video
                            controls
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: '100%',
                                maxWidth: '800px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}>
                            <source src="/fieldvisit/fieldvisit.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2">
                {/* ── Hardware Setup Image 1 ── */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{
                            background: '#f1f5f9', color: '#475569',
                            borderRadius: '6px', padding: '0.2rem 0.6rem',
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em'
                        }}>HARDWARE</span>
                        <h3 style={{ margin: 0 }}>Setup Image 1</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/fieldvisit/setup1.png"
                            alt="Hardware Setup 1"
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}
                        />
                    </div>
                </div>

                {/* ── Hardware Setup Image 2 ── */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{
                            background: '#f1f5f9', color: '#475569',
                            borderRadius: '6px', padding: '0.2rem 0.6rem',
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em'
                        }}>HARDWARE</span>
                        <h3 style={{ margin: 0 }}>Setup Image 2</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/fieldvisit/setup2.png"
                            alt="Hardware Setup 2"
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
