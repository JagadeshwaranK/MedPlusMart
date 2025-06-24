import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const CountryCodeSelector = ({ value, onChange }) => {
  const countryCodes = [
    { code: '+1', label: 'USA' },
    { code: '+91', label: 'India' },
    { code: '+44', label: 'UK' },
    // Add more country codes as needed
  ];

  return (
    <TextField
      select
      label="Country Code"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      fullWidth
    >
      {countryCodes.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          {country.code} {country.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CountryCodeSelector;
