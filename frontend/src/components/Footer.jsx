import React from 'react';

function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to the Kannauj Gazette!');
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <a href="#" className="brand-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'var(--color-gold)', width: '24px' }}>
                <path d="M12 2C11.5 2 10 3.8 10 5.5C10 6.6 10.9 7.5 12 7.5C13.1 7.5 14 6.6 14 5.5C14 3.8 12.5 2 12 2ZM12 9C7.6 9 4 12.6 4 17C4 19.8 6.2 22 9 22H15C17.8 22 20 19.8 20 17C20 12.6 16.4 9 12 9ZM12 20C10.3 20 9 18.7 9 17C9 15.3 10.3 14 12 14C13.7 14 15 15.3 15 17C15 18.7 13.7 20 12 20Z" />
              </svg>
              Kannauj Perfume House
            </a>
            <p>
              Precious natural attars distilled in copper pots since 1911. We support local botanical farmers and traditional artisans of Kannauj, Uttar Pradesh.
            </p>
          </div>

          <div className="footer-col">
            <h3>Navigation</h3>
            <ul className="footer-links">
              <li><a href="#profiler">Scent Quiz</a></li>
              <li><a href="#layering">Layering Studio</a></li>
              <li><a href="#heritage">Deg-Bhapka Craft</a></li>
              <li><a href="#store">Legacy Store</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Attars</h3>
            <ul className="footer-links">
              <li><a href="#store">Mitti Attar</a></li>
              <li><a href="#store">Ruh Khus</a></li>
              <li><a href="#store">Ruh Gulab</a></li>
              <li><a href="#store">Shamama Attar</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Subscribe</h3>
            <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
              <p className="footer-subscribe-desc">
                Subscribe to receive seasonal notes, heritage stories, and first access to limited distillations.
              </p>
              <div className="subscribe-input-group">
                <input 
                  type="email" 
                  className="subscribe-input" 
                  placeholder="Enter email address" 
                  required
                />
                <button type="submit" className="subscribe-btn">Join</button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Kannauj Perfume House. Handcrafted in India. All Rights Reserved.</p>
          <div className="social-links">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="YouTube">YouTube</a>
            <a href="#" aria-label="Journal">Journal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
