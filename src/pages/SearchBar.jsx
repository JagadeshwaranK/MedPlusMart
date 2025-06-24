// SearchBar.jsx
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Fetch suggestions based on the query
    if (query) {
      const fetchedSuggestions = ['Ibuprofen', 'Paracetamol', 'Aspirin', 'Amoxicillin', 'Ciprofloxacin'].filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(fetchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    onSearch(suggestion); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery); 
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Form className="d-flex" onSubmit={handleSearchSubmit}>
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '20px',
            border: '1px solid #ccc',
          }}
        />
        <Button variant="outline-dark" type="submit" style={{ padding: '10px 20px', borderRadius: '20px' }}>
          Search
        </Button>
      </Form>
      {suggestions.length > 0 && (
        <div className="suggestions-dropdown" style={{ position: 'absolute', zIndex: 1000, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', width: '300px', marginTop: '5px' }}>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)} style={{ padding: '10px', cursor: 'pointer' }}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;