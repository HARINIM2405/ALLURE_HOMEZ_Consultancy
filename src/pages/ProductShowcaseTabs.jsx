import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductShowcaseTabs = () => {
  const [activeTab, setActiveTab] = useState(null); // Start with no tab selected
  const [productShowcase, setProductShowcase] = useState({
    Curtains: [],
    Cushions: [],
    Bedding: [],
    Kitchen: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/portfolio');
        if (res.data && res.data.productShowcase) {
          setProductShowcase(res.data.productShowcase);
        }
      } catch (error) {
        console.error('Failed to fetch product showcase data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', marginTop: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#f3f6f6',
          padding: '0.5rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {Object.keys(productShowcase).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
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
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
          }}
        >
          {productShowcase[activeTab]?.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                display: 'flex',
                gap: '1.5rem',
                minHeight: '180px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ width: '160px', height: '160px', backgroundColor: '#eee', borderRadius: '10px' }}>
                {item.imageUrl ? (
                  <img
                    src={
                      item.imageUrl.startsWith('http')
                        ? item.imageUrl
                        : `http://localhost:5000${item.imageUrl}`
                    }
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: '0.9rem',
                      color: '#999',
                      display: 'block',
                      textAlign: 'center',
                      lineHeight: '160px',
                    }}
                  >
                    No Image
                  </span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.4rem', margin: 0 }}>{item.title}</h3>
                <p style={{ margin: '0.3rem 0', fontWeight: 500, fontSize: '1.1rem' }}>{item.subtitle}</p>
                <p style={{ marginTop: '0.7rem', color: '#444', fontSize: '1rem' }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductShowcaseTabs;
