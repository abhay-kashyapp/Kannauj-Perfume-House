import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ScentProfiler from './components/ScentProfiler';
import LayeringStudio from './components/LayeringStudio';
import HeritageJourney from './components/HeritageJourney';
import Store from './components/Store';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';

function App() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState(null); // stores order details on success

  // Fetch Perfumes from backend API on mount
  useEffect(() => {
    fetch('/api/perfumes')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load perfume catalog.');
        return res.json();
      })
      .then(data => {
        setPerfumes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item._id === product._id);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, {
          _id: product._id,
          name: product.name,
          price: product.price,
          imagePath: product.imagePath,
          isCustomBlend: product.isCustomBlend || false,
          blendDetails: product.blendDetails || null,
          quantity
        }];
      }
    });
    // Auto-open cart to show user item was added
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item._id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="app-wrapper">
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartOpen={() => setIsCartOpen(true)} 
      />

      <main>
        <Hero />
        
        <ScentProfiler 
          perfumes={perfumes} 
          onAddToCart={addToCart} 
        />
        
        <LayeringStudio 
          onAddToCart={addToCart} 
        />
        
        <HeritageJourney />
        
        <Store 
          perfumes={perfumes} 
          loading={loading} 
          error={error}
          onSelectProduct={setSelectedProduct} 
          onAddToCart={addToCart} 
        />
      </main>

      <Footer />

      {/* Cart Slider Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        setOrderSuccessModal={setOrderSuccessModal}
      />

      {/* Product Details & Review Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart} 
        />
      )}

      {/* Checkout Success Modal Overlay */}
      {orderSuccessModal && (
        <div className="modal-overlay active" onClick={() => setOrderSuccessModal(null)}>
          <div className="product-modal glass-panel checkout-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setOrderSuccessModal(null)}>&times;</button>
            <div className="success-icon-wrapper">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <h2>Order Confirmed!</h2>
            <p>
              Thank you for choosing Kannauj Perfume House, <strong>{orderSuccessModal.customerDetails.name}</strong>.<br />
              Your order for <strong>₹{orderSuccessModal.totalAmount}</strong> has been received. Our master distillers will prepare your scents shortly.
            </p>
            <button className="btn btn-primary" onClick={() => setOrderSuccessModal(null)}>Continue Exploring</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
