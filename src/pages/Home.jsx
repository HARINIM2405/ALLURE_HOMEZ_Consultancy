import React from "react";
import "./Home.css"; // Link to Home page-specific CSS for styles
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // For Manufacturing
import WorkIcon from '@mui/icons-material/Work'; // For Consulting
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Cardboard box style icon

const Home = () => {
  return (
    <div className="home-container">
      <section className="home-banner">
        <div className="banner-text" style={{ fontFamily: 'Montserrat, sans-serif', maxWidth: '600px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'black',
            marginBottom: '20px'
          }}>
            𝐀𝐥𝐥𝐮𝐫𝐞𝐇𝐨𝐦𝐞𝐳
          </h1>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '500',
            color: '#333',
            marginBottom: '20px'
          }}>
            Elegant Textiles for Your Home
          </h2>
          <p style={{ fontSize: '18px', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            Premium fabrics and home furnishings to elevate your living{'\n'}
            spaces. From manufacturing to consulting, we bring elegance{'\n'}
            to your home.
          </p>
        </div>

        <div className="banner-image">
          <img src="/living.jpg" alt="Living room setup" style={{ width: '600px', height: '450px' }} />
        </div>
      </section>

      <section className="services" style={{ padding: '60px 20px' }}>
        <h2 style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'black',
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          marginBottom: '30px'
        }}>
          Our Services
        </h2>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '30px'
        }}>
          {[
            {
              icon: <Inventory2Icon style={{ fontSize: 50, color: 'black', marginBottom: '10px' }} />,
              title: '𝐌𝐚𝐧𝐮𝐟𝐚𝐜𝐭𝐮𝐫𝐢𝐧𝐠',
              text: 'Custom-made textiles for your specific requirements. Quality fabrics manufactured with attention to detail.'
            },
            {
              icon: <WorkIcon style={{ fontSize: 50, color: 'black', marginBottom: '10px' }} />,
              title: '𝐂𝐨𝐧𝐬𝐮𝐥𝐭𝐢𝐧𝐠',
              text: 'Expert advice on fabric selection, design, and implementation. Transform your ideas into beautiful home furnishings.'
            },
            {
              icon: <CheckCircleIcon style={{ fontSize: 50, color: 'black', marginBottom: '10px' }} />,
              title: '𝐒𝐡𝐨𝐩',
              text: ' Your one-stop destination for exclusive products and seamless shopping experience.'
            }
          ].map((service, index) => (
            <div key={index}
              style={{
                maxWidth: '300px',
                textAlign: 'center',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              {service.icon}
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 'bold', fontSize: '1.5rem' }}>{service.title}</h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#444' }}>{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products" style={{ padding: '60px 0' }}>
        <h2 style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'black',
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          marginBottom: '40px'
        }}>
          Featured Products
        </h2>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '30px'
        }}>
          {[
            { image: '/ambernest_cushion.jpg', name: 'AmberNest', category: 'Cushion' },
            { image: '/cloudwrap_blanket.jpg', name: 'CloudWrap', category: 'Blanket' },
            { image: '/rosydrift_towel.jpg', name: 'RosyDrift', category: 'Towel' }
          ].map((product, index) => (
            <div key={index} style={{
              width: '340px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s ease',
              color: 'black'
            }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
            >
              <img src={product.image} alt={product.name} style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '6px',
                marginBottom: '15px'
              }} />
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 'bold',
                fontSize: '1.2rem',
                marginBottom: '5px'
              }}>
                {product.name}
              </div>
              <div style={{
                fontFamily: 'Montserrat, sans-serif',
                color: 'black',
                marginBottom: '15px'
              }}>
                {product.category}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => window.location.href = "/portfolio"}
                  style={{
                    border: '1px solid black',
                    padding: '6px 14px',
                    background: 'transparent',
                    fontWeight: 500,
                    fontFamily: 'Montserrat, sans-serif',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: 'black'
                  }}
                >
                  More Items
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transform Section */}
      <section className="transform" style={{
        marginTop: '100px',
        textAlign: 'center',
        padding: '0 20px',
        fontFamily: 'Montserrat, sans-serif',
        color: 'black'
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold',
          fontSize: '2.5rem',
          marginBottom: '15px'
        }}>
          Transform Your Space Today
        </h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Discover our premium collection of textiles and home furnishings at AllureHomez.
          Quality fabrics designed to elevate your living spaces.
        </p>
      </section>

      {/* Footer Section */}
      <section className="footer" style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginTop: '60px',
        marginBottom: '-100px',
        color: 'black'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'left'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ color: '#5DADE2' }}>AllureHomez</h4>
            <p>Quality textiles and home furnishings for your space.<br />
              Bringing elegance and comfort to homes since 2010.</p>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ color: '#5DADE2' }}>Look Here For</h4>
            <p>Home</p>
            <p>Portfolio</p>
            <p>Shop</p>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ color: '#5DADE2' }}>Product Categories</h4>
            <p>Curtains</p>
            <p>Kitchen</p>
            <p>Cushions</p>
            <p>Bedding</p>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ color: '#5DADE2' }}>Contact Info</h4>
            <p>123 Textile Street</p>
            <p>Fabric City, FC 12345</p>
            <p>Phone: (665) 123-4567</p>
            <p>Email: info@allurehomez.com</p>
          </div>
        </div>

        <p style={{ marginTop: '40px', fontSize: '13px', color: '#aaa' }}>
          © 2025 AllureHomez. All rights reserved.
        </p>
      </section>
    </div>
  );
};

export default Home;