import React, { useState } from 'react';

function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onClearCart, setOrderSuccessModal }) {
  const [checkoutMode, setCheckoutMode] = useState(false);
  
  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      setOrderError('All shipping fields are required.');
      return;
    }

    setSubmittingOrder(true);
    setOrderError(null);

    const orderPayload = {
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isCustomBlend: item.isCustomBlend,
        blendDetails: item.blendDetails
      })),
      totalAmount: subtotal,
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress
      }
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to place order.');
        return res.json();
      })
      .then(data => {
        // Trigger success modal on main App component
        setOrderSuccessModal(data.order);
        
        // Reset local cart and local forms
        onClearCart();
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCustomerAddress('');
        setCheckoutMode(false);
        onClose(); // close drawer
        setSubmittingOrder(false);
      })
      .catch(err => {
        console.error(err);
        setOrderError(err.message);
        setSubmittingOrder(false);
      });
  };

  const handleClose = () => {
    setCheckoutMode(false);
    onClose();
  };

  return (
    <>
      {/* Background Dim Overlay */}
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`} 
        onClick={handleClose}
      />

      {/* Cart Drawer */}
      <div className={`cart-drawer ${isOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h2>{checkoutMode ? "Shipping Details" : "Your Cart"}</h2>
          <button 
            className="close-cart-btn" 
            onClick={handleClose}
            aria-label="Close Cart"
          >
            &times;
          </button>
        </div>

        {/* CART VIEW MODE */}
        {!checkoutMode ? (
          <>
            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="empty-cart-message">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>
                  </svg>
                  <p>Your copper receiver is empty.</p>
                  <button className="btn btn-outline" onClick={handleClose}>Start Exploring</button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-img">
                      <img 
                        src={item.imagePath} 
                        alt={item.name} 
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=200";
                        }}
                      />
                    </div>
                    
                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.name}</h4>
                      
                      {item.isCustomBlend && item.blendDetails && (
                        <p className="cart-item-desc">
                          Base: {item.blendDetails.baseNote} | Top: {item.blendDetails.topNote}
                        </p>
                      )}
                      
                      {!item.isCustomBlend && (
                        <p className="cart-item-desc">Pure Heritage Single Note</p>
                      )}
                      
                      <button 
                        className="remove-item-btn" 
                        onClick={() => onRemoveItem(item._id)}
                      >
                        Remove
                      </button>

                      <div className="cart-item-bottom">
                        <div className="cart-item-qty">
                          <button 
                            className="qty-btn" 
                            onClick={() => onUpdateQuantity(item._id, -1)}
                          >
                            -
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => onUpdateQuantity(item._id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span style={{ color: 'var(--color-vetiver)', fontWeight: '600' }}>FREE</span>
                </div>
                <div className="cart-summary-row total">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <button 
                  className="btn btn-primary checkout-btn" 
                  onClick={() => setCheckoutMode(true)}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        ) : (
          /* CHECKOUT SHIPPING FORM MODE */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flexGrow: 1, padding: '2rem', overflowY: 'auto' }}>
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Please supply your shipping details below to place your order. Payment is Cash on Delivery (COD) for your convenience.
                </p>

                {orderError && <p style={{ color: 'var(--color-rose)', fontSize: '0.85rem' }}>{orderError}</p>}

                <div className="form-group">
                  <label htmlFor="ship-name" style={{ color: 'var(--color-gold)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Full Name</label>
                  <input 
                    type="text" 
                    id="ship-name" 
                    className="form-input" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ship-email" style={{ color: 'var(--color-gold)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Email Address</label>
                  <input 
                    type="email" 
                    id="ship-email" 
                    className="form-input" 
                    value={customerEmail} 
                    onChange={e => setCustomerEmail(e.target.value)} 
                    placeholder="name@example.com" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ship-phone" style={{ color: 'var(--color-gold)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    id="ship-phone" 
                    className="form-input" 
                    value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)} 
                    placeholder="+91 99999 99999" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ship-address" style={{ color: 'var(--color-gold)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Shipping Address</label>
                  <textarea 
                    id="ship-address" 
                    className="form-input" 
                    value={customerAddress} 
                    onChange={e => setCustomerAddress(e.target.value)} 
                    placeholder="House/Street, City, State, ZIP code" 
                    required 
                  />
                </div>
              </form>
            </div>

            <div className="cart-footer">
              <div className="cart-summary-row total" style={{ marginBottom: '1.2rem' }}>
                <span>Order Total</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setCheckoutMode(false)}
                  style={{ flex: 1 }}
                >
                  Back to Cart
                </button>
                <button 
                  type="submit" 
                  form="checkout-form"
                  className="btn btn-primary" 
                  disabled={submittingOrder}
                  style={{ flex: 1.5 }}
                >
                  {submittingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
