import React, { useEffect, useState } from 'react';
import './Portfolio.css';
import ProductShowcaseTabs from './ProductShowcaseTabs';
import { BASE_URL } from '../config'; // Adjust path if needed
import { Button } from '@mui/material'; // Import MUI Button
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const contentFont = { fontFamily: 'Montserrat, sans-serif' };
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        setPortfolio(data);
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
      }
    };

    fetchPortfolio();
  }, []);

  if (!portfolio) return <p style={{ textAlign: 'center' }}>Loading portfolio...</p>;

  const handleEnquiryClick = () => {
    // Placeholder - replace with navigation or modal open
    alert('Enquiry button clicked!');
  };

  return (
    <section className="portfolio-section" style={contentFont}>

      {/* Enquiry Button fixed top-right */}
      <Button
  component={Link}
  to="/enquiry"
  sx={{
    marginTop: '60px',
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 1000,
    textTransform: 'none',
    fontWeight: 'bold',
    borderRadius: '0px',
    px: 3,
    py: 1.2,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: '#222',
      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
    },
  }}
>
  𝐄𝐧𝐪𝐮𝐢𝐫𝐲
</Button>

      <div className="portfolio-intro" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontWeight: 'bold',
            color: 'black',
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            marginBottom: '30px',
          }}
        >
          {portfolio.introTitle || 'Our Portfolio'}
        </h1>
        <p>{portfolio.introText}</p>
      </div>

      <div
        className="portfolio-content"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '2rem',
        }}
      >
        <div className="portfolio-text" style={{ flex: 1 }}>
          <h2>{portfolio.materialTitle}</h2>
          <p>{portfolio.materialDescription}</p>
          <ul>
            {portfolio.materials?.map((mat, idx) => (
              <li key={idx}>
                <strong>{mat.name}</strong>
                <br />
                <br />
                {mat.description}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="portfolio-images"
          style={{ flex: 1, display: 'flex', gap: '1rem', marginTop: '70px' }}
        >
          <img
            src="port_s1.jpg"
            alt="Main Left"
            style={{ width: '60%', borderRadius: '8px', objectFit: 'cover', height: '100%' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '40%' }}>
            <img
              src="port_s3.jpg"
              alt="Top Right"
              style={{ width: '100%', height: '50%', borderRadius: '8px', objectFit: 'cover' }}
            />
            <img
              src="port_s4.jpg"
              alt="Bottom Right"
              style={{ width: '100%', height: '50%', borderRadius: '8px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      <br />
      <br />

      {/* Product Showcase */}
      <section className="showcase-section" style={{ marginTop: '2rem' }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 'bold',
            fontSize: '2rem',
            textAlign: 'left',
            marginBottom: '2rem',
            color: 'black',
          }}
        >
          𝐏𝐫𝐨𝐝𝐮𝐜𝐭 𝐒𝐡𝐨𝐰𝐜𝐚𝐬𝐞
        </h2>
        <ProductShowcaseTabs />
      </section>

      {/* Dealers */}
      <section className="dealers-section" style={{ marginTop: '4rem' }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 'bold',
            fontSize: '2rem',
            textAlign: 'left',
            marginBottom: '1rem',
            color: 'black',
            borderBottom: '3px solid #2dd4bf',
            display: 'inline-block',
            paddingBottom: '0.3rem',
          }}
        >
          {portfolio.dealersTitle}
        </h2>

        <p
          style={{
            fontSize: '1rem',
            marginBottom: '2.5rem',
            color: '#444',
          }}
        >
          {portfolio.dealersText}
        </p>

        <div
          className="dealers-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {portfolio.dealers?.map((dealer, idx) => (
            <div key={idx}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1rem',
                  borderRadius: '50%',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                {dealer.initial}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>{dealer.name}</p>
                <p style={{ marginTop: '0.2rem', color: '#666', fontSize: '0.9rem' }}>
                  {dealer.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects-section" style={{ marginTop: '4rem' }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 'bold',
            fontSize: '2rem',
            textAlign: 'left',
            marginBottom: '2rem',
            color: '#111',
            borderBottom: '3px solid #00b4aa',
            display: 'inline-block',
            paddingBottom: '0.5rem',
          }}
        >
          𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐝 𝐏𝐫𝐨𝐣𝐞𝐜𝐭𝐬
        </h2>

        {portfolio.featuredProjects?.map((project, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3rem',
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              maxWidth: '100%',
              marginBottom: '2rem',
            }}
          >
            <img
              src={project.imageUrl ? `${BASE_URL}${project.imageUrl}` : 'fallback.jpg'}
              alt={project.title || 'Project Image'}
              style={{ width: '50%', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem' }}>
                {project.title || 'Untitled'}
              </h3>
              <p
                style={{
                  marginBottom: '1rem',
                  color: '#444',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                {project.description || 'No description available.'}
              </p>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
};

export default Portfolio;
