import React, { useState, useEffect } from 'react';

function LayeringStudio({ onAddToCart }) {
  const [baseNote, setBaseNote] = useState('');
  const [topNote, setTopNote] = useState('');
  const [blendResult, setBlendResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Map ingredient names to hex colors for the fluid liquid blending overlay
  const baseColors = {
    'Mitti Attar': '#c85a32', // Clay terracotta
    'Ruh Khus': '#34613b',      // Vetiver green
    'Shamama Attar': '#aa8513'   // Amber spice gold
  };

  const topColors = {
    'Ruh Gulab': '#a8324a',     // Rose red
    'Royal Jasmine': '#eedc82', // Cream jasmine yellow
    'Citrus': '#e08027',        // Orange citrus
    'Saffron': '#800020'        // Burgundy saffron crimson
  };

  // Fetch blend results when selections change
  useEffect(() => {
    if (baseNote && topNote) {
      setLoading(true);
      fetch('/api/layering/blend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseNote, topNote })
      })
        .then(res => {
          if (!res.ok) throw new Error('Error calculating custom blend.');
          return res.json();
        })
        .then(data => {
          setBlendResult(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setBlendResult(null);
    }
  }, [baseNote, topNote]);

  // Determine liquid height and color gradient
  const hasBase = !!baseNote;
  const hasTop = !!topNote;
  
  let liquidHeight = '0%';
  if (hasBase && hasTop) liquidHeight = '75%';
  else if (hasBase || hasTop) liquidHeight = '35%';

  // Dynamic CSS gradient blending base & top colors
  const liquidBg = hasBase && hasTop 
    ? `linear-gradient(0deg, ${baseColors[baseNote] || '#d4af37'} 0%, ${topColors[topNote] || '#a8324a'} 100%)`
    : hasBase 
      ? baseColors[baseNote]
      : topColors[topNote] || 'rgba(212,175,55,0.3)';

  const handleAddBlend = () => {
    if (!blendResult) return;
    
    // Construct custom blend item
    const customProduct = {
      _id: `custom-blend-${baseNote.replace(/\s+/g, '-')}-${topNote.replace(/\s+/g, '-')}`,
      name: blendResult.name,
      price: blendResult.price,
      imagePath: '/assets/custom_blend.png',
      isCustomBlend: true,
      blendDetails: {
        baseNote,
        topNote,
        ratio: "50:50"
      }
    };
    
    onAddToCart(customProduct, 1);
  };

  return (
    <section id="layering" className="layering-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">The Attar Alchemist</span>
          <h2 className="section-title">Virtual Layering Studio</h2>
          <p className="section-desc">
            Attars are meant to be layered. Select a grounding base note distilled in clay, and layer it with a blooming floral or spice top note to forge your own custom Indian attar.
          </p>
        </div>

        <div className="layering-grid">
          {/* Workspace - Blending Chamber */}
          <div className="layering-workspace">
            {/* Liquid Background Auras */}
            <div className="layering-visualizer">
              <div 
                className="fluid-glow fluid-base"
                style={{ backgroundColor: baseNote ? baseColors[baseNote] : '#aa8513', opacity: baseNote ? 0.35 : 0.05 }}
              ></div>
              <div 
                className="fluid-glow fluid-top"
                style={{ backgroundColor: topNote ? topColors[topNote] : '#a8324a', opacity: topNote ? 0.35 : 0.05 }}
              ></div>
            </div>

            <div className="layering-bench">
              <div className="bench-flacon-container">
                {/* SVG Flacon Silhouette Frame */}
                <svg className="flacon-overlay" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                  {/* Flacon Cap */}
                  <rect x="42" y="10" width="16" height="12" rx="4" fill="none" stroke="#d4af37" strokeWidth="2.5" />
                  {/* Neck */}
                  <rect x="46" y="22" width="8" height="10" fill="none" stroke="#d4af37" strokeWidth="2.5" />
                  {/* Body */}
                  <path d="M50 32 C25 32, 20 40, 20 60 C20 95, 25 105, 50 105 C75 105, 80 95, 80 60 C80 40, 75 32, 50 32 Z" fill="none" stroke="#d4af37" strokeWidth="2.5" />
                </svg>

                {/* Liquid Contents inside Bottle */}
                <div className="liquid-contents">
                  <div 
                    className="liquid-color-fill"
                    style={{ 
                      height: liquidHeight, 
                      background: liquidBg 
                    }}
                  >
                    {/* Bubbling animations when both notes selected */}
                    {hasBase && hasTop && (
                      <div className="bubbles">
                        <div className="bubble" style={{ left: '15%', width: '6px', height: '6px', animationDelay: '0.1s', animationDuration: '2.5s' }}></div>
                        <div className="bubble" style={{ left: '40%', width: '4px', height: '4px', animationDelay: '0.6s', animationDuration: '3.2s' }}></div>
                        <div className="bubble" style={{ left: '60%', width: '8px', height: '8px', animationDelay: '0.3s', animationDuration: '2.8s' }}></div>
                        <div className="bubble" style={{ left: '75%', width: '5px', height: '5px', animationDelay: '1.2s', animationDuration: '3.5s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <span className="alchemy-status-badge">
                {!hasBase && !hasTop && "Chamber Empty • Select Notes"}
                {hasBase && !hasTop && "Pouring Base Note..."}
                {!hasBase && hasTop && "Pouring Top Note..."}
                {hasBase && hasTop && (loading ? "Distilling Blend..." : "Scent Cured")}
              </span>
            </div>
          </div>

          {/* Controls - Selectors */}
          <div className="layering-controls">
            {/* Base Notes Selector */}
            <div className="note-selector-group">
              <label>Step 1: Choose Your Base Note (Grounding)</label>
              <div className="options-flex">
                {Object.keys(baseColors).map(name => (
                  <button
                    key={name}
                    className={`note-btn ${baseNote === name ? 'active' : ''}`}
                    data-type="base"
                    onClick={() => setBaseNote(baseNote === name ? '' : name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Notes Selector */}
            <div className="note-selector-group">
              <label>Step 2: Choose Your Top Note (Accent)</label>
              <div className="options-flex">
                {Object.keys(topColors).map(name => (
                  <button
                    key={name}
                    className={`note-btn ${topNote === name ? 'active' : ''}`}
                    onClick={() => setTopNote(topNote === name ? '' : name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Blending Result Panel */}
            {blendResult && !loading && (
              <div className="alchemy-result-panel active glass-panel" style={{ padding: '2rem' }}>
                <div className="alchemy-title-row">
                  <h3 className="alchemy-blend-name">{blendResult.name}</h3>
                  <span className="alchemy-blend-price">₹{blendResult.price}</span>
                </div>
                <p className="alchemy-blend-desc">{blendResult.description}</p>
                <div className="alchemy-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleAddBlend}
                    style={{ width: '100%' }}
                  >
                    Add Custom Blend to Cart
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="alchemy-result-panel active glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-gold)' }}>Blending the oils in our copper stills... Please wait.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LayeringStudio;
