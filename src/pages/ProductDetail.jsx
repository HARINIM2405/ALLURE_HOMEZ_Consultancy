import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem', marginTop: '100px' }}>
      <h1>{product.name}</h1>
      <p><strong>Category:</strong> {product.category}</p>
      <img
        src={
          product.image?.startsWith('http')
            ? product.image
            : `http://localhost:5000${product.image || product.imageUrl}`
        }
        alt={product.name}
        style={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: '12px' }}
      />
      <p style={{ marginTop: '1rem' }}>{product.details}</p>
      <h3 style={{ color: '#1976d2' }}>₹{product.price}</h3>
      <button style={{
        marginTop: '1rem',
        padding: '10px 20px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
      }}>
        Buy Now
      </button>
    </div>
  );
};

export default ProductDetail;
