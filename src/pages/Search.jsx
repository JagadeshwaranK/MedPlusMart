import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import products from '../components/Product/ProductData'; // Import product data

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get("query");
  const [pincode, setPincode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    if (searchQuery) {
      // Filter products based on the search query
      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Map the results to the desired format
      const formattedResults = results.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        ingredients: product.activeIngredients
      }));

      setSearchResults(formattedResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-3">
        <button onClick={() => navigate(-1)} className="btn btn-secondary me-2">← Back</button>
        <h2>Search Results for "{searchQuery}"</h2>
      </div>
      <hr />
      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <div key={product.id} className="product">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ₹{product.price.toFixed(2)}</p>
            <p>Stock: {product.stock}</p>
            <p>Ingredients: {product.ingredients}</p>
            <Link to={`/productdetail/${product.id}`}>
              <button>Show More</button>
            </Link>
          </div>
        ))
      ) : (
        <h3>No products found</h3>
      )}
    </div>
  );
};

export default Search;
