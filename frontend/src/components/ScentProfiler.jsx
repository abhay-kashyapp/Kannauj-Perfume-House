import React, { useState } from 'react';

const quizQuestions = [
  {
    id: 1,
    title: "Select your current mood",
    subtitle: "What is your soul seeking today?",
    options: [
      { text: "Meditative & Mysterious", desc: "Drawn to warmth, shadows, and introspection", weight: { "Shamama Attar": 3, "Ruh Khus": 1 } },
      { text: "Vibrant & Radiant", desc: "Energy, confidence, and solar notes", weight: { "Royal Jasmine": 2, "Ruh Gulab": 2 } },
      { text: "Romantic & Elegant", desc: "Poetic, delicate, and deeply expressive", weight: { "Ruh Gulab": 3, "Royal Jasmine": 1 } },
      { text: "Grounded & Earthy", desc: "Connection to soil, rain, and trees", weight: { "Mitti Attar": 3, "Ruh Khus": 2 } }
    ]
  },
  {
    id: 2,
    title: "Which season speaks to your soul?",
    subtitle: "Olfactory elements of nature's cycles.",
    options: [
      { text: "Monsoon Rains", desc: "The aroma of clouds meeting parched soil", weight: { "Mitti Attar": 4 } },
      { text: "Summer Nights", desc: "Cool breezes carrying heavy sweet floral notes", weight: { "Royal Jasmine": 3, "Ruh Khus": 2 } },
      { text: "Winter Mist", desc: "Warm blankets, woodsmoke, and spices", weight: { "Shamama Attar": 4 } },
      { text: "Spring Blooms", desc: "Fresh dew on petals and wild honey", weight: { "Ruh Gulab": 4 } }
    ]
  },
  {
    id: 3,
    title: "Select your intensity preference",
    subtitle: "How do you want your sillage (trail) to feel?",
    options: [
      { text: "Subtle & Close-to-skin", desc: "A personal bubble, felt only by those near", weight: { "Royal Jasmine": 2, "Mitti Attar": 2 } },
      { text: "Moderate & Noticeable", desc: "Leaves a gentle, natural trail as you move", weight: { "Ruh Khus": 3, "Mitti Attar": 1 } },
      { text: "Deep & Long-lasting", desc: "Powerful, resinous, and extremely enduring", weight: { "Shamama Attar": 3, "Ruh Gulab": 3 } }
    ]
  },
  {
    id: 4,
    title: "What environment makes you feel alive?",
    subtitle: "Your sanctuary in nature.",
    options: [
      { text: "A walk in the rain", desc: "Damp gravel, lightning, clay dust", weight: { "Mitti Attar": 3 } },
      { text: "A sandalwood forest", desc: "Dry leaves, sweet bark, green roots", weight: { "Ruh Khus": 3, "Royal Jasmine": 1 } },
      { text: "A blooming rose garden", desc: "Dawn breeze, fresh petals, morning dew", weight: { "Ruh Gulab": 3 } },
      { text: "A warm spice market", desc: "Cardamom, warm smoke, and resins", weight: { "Shamama Attar": 3 } }
    ]
  }
];

function ScentProfiler({ perfumes, onAddToCart }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 3 for questions, 4 for result
  const [selections, setSelections] = useState([]); // Selected option indices
  const [recommendation, setRecommendation] = useState(null);

  const handleOptionSelect = (optionIndex) => {
    const newSelections = [...selections];
    newSelections[currentStep] = optionIndex;
    setSelections(newSelections);
  };

  const handleNext = () => {
    if (selections[currentStep] === undefined) return; // Prevent next without selecting
    
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate results
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResult = () => {
    const scores = {};
    
    // Iterate over selections and aggregate weights
    selections.forEach((selectedIdx, questionIdx) => {
      const option = quizQuestions[questionIdx].options[selectedIdx];
      Object.entries(option.weight).forEach(([perfumeName, weightValue]) => {
        scores[perfumeName] = (scores[perfumeName] || 0) + weightValue;
      });
    });

    // Find the highest scoring perfume name
    let recommendedName = "";
    let maxScore = -1;
    Object.entries(scores).forEach(([name, score]) => {
      if (score > maxScore) {
        maxScore = score;
        recommendedName = name;
      }
    });

    // Match recommendedName with the actual product object from DB
    const match = perfumes.find(p => p.name === recommendedName) || perfumes[0];
    setRecommendation(match);
    setCurrentStep(quizQuestions.length); // go to result step
  };

  const handleReset = () => {
    setSelections([]);
    setRecommendation(null);
    setCurrentStep(0);
  };

  // Progress percentage
  const progressPercent = ((currentStep) / quizQuestions.length) * 100;

  return (
    <section id="profiler" className="quiz-section section-bg-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Fragrance Finder</span>
          <h2 className="section-title">The Scent Profiler</h2>
          <p className="section-desc">
            Answer a few sensory questions to reveal the traditional Kannauj perfume that matches your mood, skin, and spirit.
          </p>
        </div>

        <div className="quiz-wrapper glass-panel" style={{ padding: '3rem' }}>
          {currentStep < quizQuestions.length ? (
            // Quiz Step
            <div>
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>

              <div className="quiz-card active">
                <span className="quiz-question-number">Question {quizQuestions[currentStep].id} of {quizQuestions.length}</span>
                <h3 className="quiz-question-title">{quizQuestions[currentStep].title}</h3>
                
                <div className="quiz-options-grid">
                  {quizQuestions[currentStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      className={`quiz-option ${selections[currentStep] === idx ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(idx)}
                    >
                      <div className="option-dot"></div>
                      <div className="option-details">
                        <h4>{option.text}</h4>
                        <p>{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="quiz-nav-buttons">
                <button 
                  className="btn btn-outline" 
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  style={{ opacity: currentStep === 0 ? 0.3 : 1, cursor: currentStep === 0 ? 'not-allowed' : 'pointer' }}
                >
                  Back
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleNext}
                  disabled={selections[currentStep] === undefined}
                  style={{ opacity: selections[currentStep] === undefined ? 0.5 : 1 }}
                >
                  {currentStep === quizQuestions.length - 1 ? "Reveal Scent" : "Next Question"}
                </button>
              </div>
            </div>
          ) : (
            // Result Step
            <div className="quiz-result active">
              <div className="result-grid">
                <div className="result-image-wrapper">
                  <img 
                    src={recommendation?.imagePath} 
                    alt={recommendation?.name} 
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                </div>
                <div>
                  <span className="result-tag">Your Perfect Match</span>
                  <h3 className="result-name">{recommendation?.name}</h3>
                  <p className="result-desc">{recommendation?.description}</p>
                  
                  <div className="result-notes">
                    <div className="result-note-item">
                      <span>Top Notes</span>
                      <p>{recommendation?.notes.top}</p>
                    </div>
                    <div className="result-note-item">
                      <span>Heart Notes</span>
                      <p>{recommendation?.notes.heart}</p>
                    </div>
                    <div className="result-note-item">
                      <span>Base Notes</span>
                      <p>{recommendation?.notes.base}</p>
                    </div>
                  </div>

                  <div className="result-buttons">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => recommendation && onAddToCart(recommendation, 1)}
                    >
                      Add Signature Bottle — ₹{recommendation?.price}
                    </button>
                    <button className="btn btn-outline" onClick={handleReset}>Retake Quiz</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ScentProfiler;
