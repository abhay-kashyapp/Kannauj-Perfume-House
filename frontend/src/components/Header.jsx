import React, { useState, useEffect } from 'react';

function Header({ cartCount, onCartOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      <div className="container header-container">
        <a href="#" className="brand-logo" onClick={closeMobileMenu}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C11.5 2 10 3.8 10 5.5C10 6.6 10.9 7.5 12 7.5C13.1 7.5 14 6.6 14 5.5C14 3.8 12.5 2 12 2ZM12 9C7.6 9 4 12.6 4 17C4 19.8 6.2 22 9 22H15C17.8 22 20 19.8 20 17C20 12.6 16.4 9 12 9ZM12 20C10.3 20 9 18.7 9 17C9 15.3 10.3 14 12 14C13.7 14 15 15.3 15 17C15 18.7 13.7 20 12 20Z" />
          </svg>
          Kannauj Perfume House
        </a>

        {/* Navigation Links with mobile active state */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#profiler" onClick={closeMobileMenu}>Scent Quiz</a></li>
          <li><a href="#layering" onClick={closeMobileMenu}>Layering Studio</a></li>
          <li><a href="#heritage" onClick={closeMobileMenu}>Our Craft</a></li>
          <li><a href="#store" onClick={closeMobileMenu}>Catalog</a></li>
        </ul>

        <div className="header-actions">
          <button 
            className="cart-icon-btn" 
            onClick={() => { closeMobileMenu(); onCartOpen(); }}
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

          {/* Hamburger Menu Toggle Button */}
          <button 
            className="menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              // Close icon
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // Hamburger icon
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

