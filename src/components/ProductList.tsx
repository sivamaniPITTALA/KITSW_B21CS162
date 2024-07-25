import React, {useState,useEffect} from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState('Laptop');
  const [company, setCompany] = useState('AMZ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:3000/categories/${category}/products`);
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products');
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, company]);

  return (
    <div className="product-list">
      <h1>Top Products</h1>
      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Laptop">Laptop</option>
          <option value="Phone">Phone</option>
          <option value="Tablet">Tablet</option>
        </select>
        <select value={company} onChange={(e) => setCompany(e.target.value)}>
          <option value="AMZ">AMZ</option>
          <option value="FLP">FLP</option>
          <option value="SNP">SNP</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h2>{product.productName}</h2>
            <p>Price: {product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Discount: {product.discount}</p>
            <p>Availability: {product.availability}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
