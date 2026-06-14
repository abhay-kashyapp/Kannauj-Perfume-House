import React from 'react';

function Store({ perfumes, loading, error, onSelectProduct, onAddToCart }) {
  
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<span key={i}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: 'var(--text-muted)' }}>★</span>);
      }
    }
    return stars;
  };

  return (
    <section id="store" className="store-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Curated Collection</span>
          <h2 className="section-title">Pure Heritage Attars</h2>
          <p className="section-desc">
            Explore our range of 100% natural, steam-distilled single notes and legacy blends. Hand-cured in traditional leather bottles.
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gold)' }}>
            <p>Gathering standard distillations... Please wait.</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-rose)' }}>
            <p>Error loading catalog: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="products-grid">
            {perfumes.map(product => (
              <div key={product._id} className="product-card glass-panel">
                <div 
                  className="product-img-box" 
                  onClick={() => onSelectProduct(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={product.imagePath} 
                    alt={product.name} 
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                  <div className="product-img-overlay">
                    <span className="btn-text">Discover Notes</span>
                  </div>
                  {product.rating >= 4.9 && <span className="product-badge">Best Seller</span>}
                </div>

                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 
                    className="product-title"
                    onClick={() => onSelectProduct(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.name}
                  </h3>
                  
                  <div className="product-rating">
                    {renderStars(product.rating)}
                    <span>({product.rating})</span>
                  </div>

                  <div className="product-price-row">
                    <span className="product-price">₹{product.price}</span>
                    <button 
                      className="add-cart-btn-circle" 
                      onClick={() => onAddToCart(product, 1)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Store;
