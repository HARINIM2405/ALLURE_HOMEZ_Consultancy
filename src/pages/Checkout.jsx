import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const location = useLocation();
  const product = location.state?.product;
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    name: '',
    email: '',
    contact: '',
    location: '',
    address: '',
    orderInstructions: '',
    quantity: 1,
  });

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const orderData = { ...form, product };
      await axios.post('http://localhost:5000/api/orders', orderData);
      setMessage('✅ Order placed successfully!');

      // Reset form
      setForm({
        name: '',
        email: '',
        contact: '',
        location: '',
        address: '',
        orderInstructions: '',
        quantity: 1,
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setMessage('❌ Failed to place order. Please try again.');
      console.error('Order submission error:', error);
    }
    setLoading(false);
  };

  if (!product)
    return <p style={{ textAlign: 'center', marginTop: '3rem' }}>No product selected.</p>;

  return (
    <div style={containerStyle}>
      {/* Form Section */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: '2rem', color: '#1976d2' }}>Enter Your Details</h2>

        <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="contact" type="tel" placeholder="Contact Number" value={form.contact} onChange={handleChange} required style={inputStyle} />
        <input name="location" type="text" placeholder="Location / City" value={form.location} onChange={handleChange} required style={inputStyle} />
        <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} required rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
        <textarea name="orderInstructions" placeholder="Order Instructions (optional)" value={form.orderInstructions} onChange={handleChange} rows={5} style={{ ...inputStyle, resize: 'vertical' }} />

        {message && (
          <div
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
              color: message.includes('successfully') ? '#155724' : '#721c24',
              border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '8px',
              fontWeight: '600',
              marginTop: '1rem',
            }}
          >
            {message}
          </div>
        )}
      </form>

      {/* Product Section */}
      <div style={productCardStyle}>
        <div style={imageWrapperStyle}>
          <img
            src={
              product.image?.startsWith('http')
                ? product.image
                : `http://localhost:5000${product.image || product.imageUrl}`
            }
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="quantity" style={{ fontWeight: '700', fontSize: '1.1rem', color: '#444' }}>Quantity</label>
          <input id="quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} style={inputStyle} />
        </div>

        <button
          disabled={loading}
          type="submit"
          onClick={handleSubmit}
          style={{
            marginTop: 'auto',
            width: '100%',
            padding: '1.25rem',
            backgroundColor: loading ? '#999' : '#1976d2',
            color: '#fff',
            fontWeight: '800',
            fontSize: '1.3rem',
            border: 'none',
            borderRadius: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          {loading ? 'Processing...' : `Proceed to Buy ₹${product.price * form.quantity}`}
        </button>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: 'flex',
  gap: '3rem',
  width: '100vw',
  height: '100vh',
  padding: '3rem 4rem',
  boxSizing: 'border-box',
  fontFamily: "'Montserrat', sans-serif",
  backgroundColor: '#f0f2f5',
};

const formStyle = {
  flex: '2 1 0',
  backgroundColor: '#fff',
  padding: '3rem',
  borderRadius: '20px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  overflowY: 'auto',
  minWidth: 0,
};

const productCardStyle = {
  flex: '1 1 0',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  padding: '3rem',
  borderRadius: '20px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  alignItems: 'center',
  gap: '2rem',
  width: '100px',
  overflowY: 'auto',
};

const imageWrapperStyle = {
  width: '100px',
  height: '400px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
};

const inputStyle = {
  padding: '1rem 1.5rem',
  borderRadius: '12px',
  border: '1px solid #ddd',
  fontSize: '1.1rem',
  outline: 'none',
  transition: 'border-color 0.3s ease',
  minWidth: 0,
};

export default Checkout;
