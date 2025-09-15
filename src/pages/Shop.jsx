import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate(); // Correct placement inside the component

  const [activeTab, setActiveTab] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState({
    All: [],
    Curtains: [],
    Cushions: [],
    Bedding: [],
    Kitchen: [],
    Towel: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const allProducts = response.data;

        const categorized = {
          All: allProducts,
          Curtains: allProducts.filter(p => p.category === 'Curtains'),
          Cushions: allProducts.filter(p => p.category === 'Cushions'),
          Bedding: allProducts.filter(p => p.category === 'Bedding'),
          Kitchen: allProducts.filter(p => p.category === 'Kitchen'),
          Towel: allProducts.filter(p => p.category === 'Towel'),
        };

        setProducts(categorized);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // UI Styles
  const tabButtonStyle = (tab) => ({
    padding: '1rem 2.5rem',
    margin: '0.5rem',
    backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: '#2b2b2b',
    transition: 'all 0.3s ease',
    boxShadow: activeTab === tab ? '0 0 10px rgba(148, 204, 244, 0.3)' : 'none',
  });

  const cardStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '340px',
    boxSizing: 'border-box',
  };

  const imageContainerStyle = {
    height: 200,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', marginTop: '100px', padding: '0 1rem' }}>
      {/* Tabs */}
      <div
        style={{
          marginBottom: '2rem',
          marginLeft: '200px',
          position: 'relative',
          top: 0,
          zIndex: 10,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          padding: '0.7rem 1rem',
          borderRadius: '0 0 12px 12px',
          flexWrap: 'wrap',
          maxWidth: '1000px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {Object.keys(products).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={tabButtonStyle(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div
        style={{
          marginLeft: '10px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '2rem',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        {products[activeTab]?.length === 0 ? (
          <p
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              fontSize: '1.1rem',
              color: '#777',
            }}
          >
            No products available in {activeTab}.
          </p>
        ) : (
          products[activeTab].map((product, index) => (
            <div key={index} style={cardStyle}>
              <div style={imageContainerStyle}>
                <img
                  src={
                    product.image?.startsWith('http')
                      ? product.image
                      : `http://localhost:5000${product.image || product.imageUrl}`
                  }
                  alt={product.name}
                  style={imgStyle}
                />
              </div>
              <h3 style={{ marginTop: 12, fontWeight: 600, fontSize: '1rem', textAlign: 'center' }}>
                {product.name}
              </h3>
              <p style={{ color: '#555', fontSize: 13, margin: '8px 0', flexGrow: 1, textAlign: 'center' }}>
                {product.details?.length > 60
                  ? product.details.slice(0, 60) + '...'
                  : product.details}
              </p>
              <p style={{ fontWeight: 600, color: '#1976d2', marginBottom: 8 }}>₹{product.price}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedProduct(product)}
                  style={{
                    backgroundColor: '#64b5f6',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Details
                </button>
                
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '95%',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              position: 'relative',
              display: 'flex',
              gap: '2rem',
              padding: '1.5rem',
              boxSizing: 'border-box',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#1976d2',
              }}
              aria-label="Close Details"
            >
              ✖
            </button>

            <div
              style={{
                flex: '1 1 0',
                height: '350px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={
                  selectedProduct.image?.startsWith('http')
                    ? selectedProduct.image
                    : `http://localhost:5000${selectedProduct.image || selectedProduct.imageUrl}`
                }
                alt={selectedProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>{selectedProduct.name}</h2>
              <p style={{ color: '#555', marginBottom: '1rem', whiteSpace: 'pre-line', flexGrow: 1 }}>
                {selectedProduct.details}
              </p>
              <p style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Price: ₹{selectedProduct.price}</p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() =>
                    navigate(`/checkout/${selectedProduct._id}`, {
                      state: { product: selectedProduct },
                    })
                  }

                  style={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  Buy Now
                </button>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
