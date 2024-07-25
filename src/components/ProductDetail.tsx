import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:3000/categories/Laptop/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError('Error fetching product details');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  return (
    <div className="product-detail">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {product && (
        <div>
          <h1>{product.productName}</h1>
          <p>Price: {product.price}</p>
          <p>Rating: {product.rating}</p>
          <p>Discount: {product.discount}</p>
          <p>Availability: {product.availability}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
