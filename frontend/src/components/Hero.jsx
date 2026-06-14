import React from 'react';

function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-tagline">Est. 1911 • Kannauj, India</span>
          <h1 className="hero-title">
            Scent of the Rain.
            <span>Soul of the Soil.</span>
          </h1>
          <p className="hero-desc">
            Discover the ancient art of natural attars hydro-distilled in traditional copper pots. Experience olfactory poetry crafted from damp earth, blooming damask roses, and warm spices.
          </p>
          <div className="hero-buttons">
            <a href="#profiler" className="btn btn-primary">Find Your Scent</a>
            <a href="#layering" className="btn btn-outline">Layering Studio</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img 
              src="/assets/hero_bottle.png" 
              alt="Luxury Kannauj Attar Bottle" 
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600";
              }}
            />
          </div>
          
          <div className="hero-floating-badge">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            </svg>
            <div className="badge-text">
              <h4>Mitti Attar</h4>
              <p>Monsoon scent preserved in liquid sandalwood base.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
