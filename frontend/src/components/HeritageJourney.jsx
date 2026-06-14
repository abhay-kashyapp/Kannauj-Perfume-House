import React from 'react';

const heritageSteps = [
  {
    num: "I",
    title: "The Copper Degs",
    desc: "Plucked blossoms (like damask roses) or baked river clay are placed in large copper cauldrons called Degs. The cauldrons are sealed with clay and cotton ropes, then heated over an open wood fire.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M19.07 4.93l-1.41 1.41C19.1 7.79 20 9.79 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-2.21.9-4.21 2.34-5.66L4.93 4.93C3.12 6.74 2 9.24 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07zM12 6c-3.31 0-6 2.69-6 6 0 1.66.67 3.16 1.76 4.24l1.42-1.42C8.44 14.13 8 13.12 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.12-.44 2.13-1.18 2.82l1.42 1.42C17.33 15.16 18 13.66 18 12c0-3.31-2.69-6-6-6zm0 4c-1.1 0-2 .9-2 2 0 .55.22 1.05.59 1.41l1.41-1.41V10z"/>
      </svg>
    )
  },
  {
    num: "II",
    title: "Bamboo Chongas",
    desc: "Steam containing the captured fragrance travel through hollow bamboo pipes (Chongas) sealed with mud, leading from the Deg down into the receiver.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    )
  },
  {
    num: "III",
    title: "The Bhapka (Receiver)",
    desc: "The receiver (Bhapka) contains pure base oil, typically liquid Sandalwood oil, and is kept partially submerged in a cold water bath. The incoming vapor condenses here, slowly infusing the sandwood base with the perfume oil.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.57 10.48 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
      </svg>
    )
  },
  {
    num: "IV",
    title: "Curing in Kuppis",
    desc: "The distilled blend of perfume and base oil is separated from excess water and poured into Kuppis — hand-crafted camel leather bottles. The leather slowly breathes out remaining moisture, concentrating the pure, rich attar over time.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 21.29 21.29 19.86 19.86 18.43 22 16.29z"/>
      </svg>
    )
  }
];

function HeritageJourney() {
  return (
    <section id="heritage" className="heritage-section section-bg-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">A Century-Old Craft</span>
          <h2 className="section-title">The Deg-Bhapka Journey</h2>
          <p className="section-desc">
            Kannauj attars are crafted using no alcohol, no chemicals, and no electricity. We preserve the traditional hydro-distillation method passed down through generations.
          </p>
        </div>

        <div className="timeline-container">
          {heritageSteps.map((step, index) => (
            <div key={index} className="timeline-step">
              <div className="timeline-node">{step.num}</div>
              <div className="timeline-content-wrapper">
                <div className="timeline-card glass-panel">
                  <div className="timeline-step-icon">
                    {step.icon}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeritageJourney;
