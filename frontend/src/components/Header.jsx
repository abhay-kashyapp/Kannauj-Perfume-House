import React, { useState, useEffect } from 'react';

function Header({ cartCount, onCartOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="container header-container">
        <a href="#" className="brand-logo">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C11.5 2 10 3.8 10 5.5C10 6.6 10.9 7.5 12 7.5C13.1 7.5 14 6.6 14 5.5C14 3.8 12.5 2 12 2ZM12 9C7.6 9 4 12.6 4 17C4 19.8 6.2 22 9 22H15C17.8 22 20 19.8 20 17C20 12.6 16.4 9 12 9ZM12 20C10.3 20 9 18.7 9 17C9 15.3 10.3 14 12 14C13.7 14 15 15.3 15 17C15 18.7 13.7 20 12 20Z" />
          </svg>
          Kannauj Perfume House
        </a>

        <ul className="nav-links">
          <li><a href="#profiler">Scent Quiz</a></li>
          <li><a href="#layering">Layering Studio</a></li>
          <li><a href="#heritage">Our Craft</a></li>
          <li><a href="#store">Catalog</a></li>
        </ul>

        <div className="header-actions">
          <button 
            className="cart-icon-btn" 
            onClick={onCartOpen}
            aria-label="Open Cart"
            id="cart-btn"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
