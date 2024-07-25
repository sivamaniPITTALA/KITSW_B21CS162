const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const BASE_URL = 'http://20.244.56.144/test/companies';
const AUTH_HEADERS = {
  'clientID': 'ca31b60a-83ac-4ed7-9253-bc85356a5043',
  'clientSecret': 'FEKNJpkbNqHrhWfP'
};

const COMPANIES = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
const CATEGORIES = [
  'Phone', 'Computer', 'TV', 'Earphone', 'Tablet', 'Charger',  'Mouse', 'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker', 'Headset', 'Laptop', 'PC'
];
app.use(express.json());

app.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params;
  const { company = 'AMZ', n = 10, page = 1, sort, order = 'asc', minPrice, maxPrice } = req.query;

  if (!CATEGORIES.includes(categoryname)) {
    return res.status(400).json({ error: 'Invalid category name' });
  }

  if (!COMPANIES.includes(company)) {
    return res.status(400).json({ error: 'Invalid company name' });
  }

  const limit = parseInt(n);
  const startIndex = (parseInt(page) - 1) * limit;

  try {
    const response = await axios.get(`${BASE_URL}/${company}/categories/${categoryname}/products`, {
      params: { top: limit, minPrice, maxPrice },
      headers: AUTH_HEADERS
    });
    let products = response.data;

    console.log(`Fetched ${products.length} products from ${company}`);
    products = products.map(product => ({ ...product, id: uuidv4() }));

    if (sort) {
      products.sort((a, b) => {
        if (order === 'asc') {
          return a[sort] > b[sort] ? 1 : -1;
        } else {
          return a[sort] < b[sort] ? 1 : -1;
        }
      });
    }
    const paginatedProducts = products.slice(startIndex, startIndex + limit);
    res.json(paginatedProducts);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/categories/:categoryname/products/:productid', async (req, res) => {
  const { categoryname, productid } = req.params;

  try {
    const responses = await Promise.all(COMPANIES.map(company => 
      axios.get(`${BASE_URL}/${company}/categories/${categoryname}/products`, {
        headers: AUTH_HEADERS
      })
    ));

    let product = null;
    responses.forEach(response => {
      const found = response.data.find(p => p.id === productid);
      if (found) product = found;
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
