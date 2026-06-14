import React, { useState, useEffect } from 'react';

function ProductModal({ product, onClose, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'reviews'
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Review form states
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch reviews for this perfume
  useEffect(() => {
    if (product) {
      setReviewsLoading(true);
      fetch(`/api/perfumes/${product._id}/reviews`)
        .then(res => {
          if (!res.ok) throw new Error('Could not load reviews.');
          return res.json();
        })
        .then(data => {
          setReviews(data);
          setReviewsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setReviewsLoading(false);
        });
    }
  }, [product]);

  // Handle Review Submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!authorName || !comment) {
      setSubmitError('Please fill out all fields.');
      return;
    }
    
    setSubmittingReview(true);
    setSubmitError(null);

    fetch(`/api/perfumes/${product._id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: authorName, rating, comment })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error submitting your review.');
        return res.json();
      })
      .then(newReview => {
        // Update local reviews state list
        setReviews(prev => [newReview, ...prev]);
        setSubmittingReview(false);
        
        // Reset form fields
        setAuthorName('');
        setComment('');
        setRating(5);
      })
      .catch(err => {
        console.error(err);
        setSubmitError(err.message);
        setSubmittingReview(false);
      });
  };

  const renderDots = (value) => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <span 
          key={i} 
          style={{ 
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: i <= value ? 'var(--color-gold)' : 'var(--text-muted)',
            marginRight: '6px'
          }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="product-modal glass-panel modal-grid" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose} aria-label="Close Modal">&times;</button>
        
        {/* Left Side - Image */}
        <div className="modal-image-box">
          <img 
            src={product.imagePath} 
            alt={product.name} 
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600";
            }}
          />
        </div>

        {/* Right Side - Content */}
        <div className="modal-content">
          <span className="modal-category">{product.category}</span>
          <h2 className="modal-title">{product.name}</h2>
          
          <div className="modal-rating-row">
            <span style={{ color: 'var(--color-gold)' }}>★</span>
            <span>{product.rating} / 5.0</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span>{reviews.length} Customer Reviews</span>
          </div>

          <div className="modal-price">₹{product.price}</div>

          {/* Tabs Navigation */}
          <div className="modal-tabs">
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details & Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content 1: Details */}
          <div className={`tab-content ${activeTab === 'details' ? 'active' : ''}`}>
            <p className="modal-desc">{product.description}</p>
            
            <div className="perfume-pyramid">
              <div className="pyramid-level">
                <strong>Top Notes</strong>
                <span>{product.notes.top}</span>
              </div>
              <div className="pyramid-level">
                <strong>Heart Notes</strong>
                <span>{product.notes.heart}</span>
              </div>
              <div className="pyramid-level">
                <strong>Base Notes</strong>
                <span>{product.notes.base}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Longevity</span>
                <div>{renderDots(product.longevity)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Sillage</span>
                <div>{renderDots(product.sillage)}</div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  onAddToCart(product, 1);
                  onClose();
                }}
                style={{ width: '100%' }}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Tab Content 2: Reviews */}
          <div className={`tab-content ${activeTab === 'reviews' ? 'active' : ''}`}>
            <div className="reviews-container">
              {reviewsLoading && <p style={{ color: 'var(--color-gold)' }}>Loading feedback...</p>}
              
              {!reviewsLoading && reviews.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No reviews yet. Be the first to review this attar!</p>
              )}
              
              {!reviewsLoading && reviews.map(rev => (
                <div key={rev._id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{rev.author}</span>
                    <span className="review-rating">
                      {Array.from({ length: rev.rating }).map((_, i) => <span key={i}>★</span>)}
                    </span>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Share Your Experience
              </h4>
              
              {submitError && <p style={{ color: 'var(--color-rose)', fontSize: '0.8rem' }}>{submitError}</p>}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rev-name">Name</label>
                  <input 
                    type="text" 
                    id="rev-name" 
                    className="form-input" 
                    value={authorName} 
                    onChange={e => setAuthorName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rev-rating">Rating</label>
                  <select 
                    id="rev-rating" 
                    className="form-input" 
                    value={rating} 
                    onChange={e => setRating(Number(e.target.value))}
                    style={{ background: '#110e0c' }}
                  >
                    <option value="5">5 Stars — Divine</option>
                    <option value="4">4 Stars — Very Good</option>
                    <option value="3">3 Stars — Moderate</option>
                    <option value="2">2 Stars — Weak</option>
                    <option value="1">1 Star — Poor</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="rev-comment">Review Content</label>
                <textarea 
                  id="rev-comment" 
                  className="form-input" 
                  value={comment} 
                  onChange={e => setComment(e.target.value)}
                  placeholder="How does this attar feel on your skin?"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-outline" 
                disabled={submittingReview}
                style={{ alignSelf: 'flex-start', padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
