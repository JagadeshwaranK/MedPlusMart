import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {
  Button,
  Container,
  Paper,
  TextField,
  Divider,
  Typography,
  Box,
  CircularProgress,
  Alert,
  MenuItem,
  Snackbar
} from '@mui/material';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '448185632803-o10moscguqnt788vorlr5e3o68gqq2vb.apps.googleusercontent.com'

// Country code options
const COUNTRY_CODES = [
  { value: '+1', label: '+1 (US)' },
  { value: '+91', label: '+91 (IN)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+86', label: '+86 (CN)' }
];

const Login = () => {
  const [formData, setFormData] = useState({
    countryCode: '+1',
    mobileNumber: '',
    otp: ''
  });
  const [uiState, setUiState] = useState({
    showOtpField: false,
    isLoading: false,
    otpCountdown: 0,
    snackbar: {
      open: false,
      message: '',
      severity: 'info'
    }
  });
  const [errors, setErrors] = useState({
    mobile: '',
    otp: '',
    login: ''
  });
  
  const navigate = useNavigate();

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (uiState.otpCountdown > 0) {
      timer = setTimeout(() => {
        setUiState(prev => ({ ...prev, otpCountdown: prev.otpCountdown - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [uiState.otpCountdown]);

  const validateMobileNumber = (number) => {
    const mobileRegex = /^\d{8,15}$/;
    return mobileRegex.test(number);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mobileNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      
      setErrors(prev => ({
        ...prev,
        mobile: validateMobileNumber(digitsOnly) ? '' : 'Please enter 8-15 digits'
      }));
    } 
    else if (name === 'otp') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      
      setErrors(prev => ({
        ...prev,
        otp: digitsOnly.length === 6 ? '' : 'OTP must be 6 digits'
      }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const showSnackbar = (message, severity = 'error') => {
    setUiState(prev => ({
      ...prev,
      snackbar: { open: true, message, severity }
    }));
  };

  const sendOtp = async () => {
    if (!validateMobileNumber(formData.mobileNumber)) {
      setErrors(prev => ({ ...prev, mobile: 'Invalid mobile number' }));
      return;
    }

    setUiState(prev => ({ ...prev, isLoading: true }));
    setErrors(prev => ({ ...prev, login: '' }));

    try {
      const fullNumber = `${formData.countryCode}${formData.mobileNumber}`;
      console.log('Sending OTP to:', fullNumber);
      
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phoneNumber: fullNumber
      });

      if (response.data.success) {
        setUiState(prev => ({
          ...prev,
          showOtpField: true,
          otpCountdown: 120,
          isLoading: false
        }));
        
        if (response.data.otp) {
          console.log('Development OTP:', response.data.otp);
          showSnackbar(`OTP sent: ${response.data.otp}`, 'info');
        } else {
          showSnackbar('OTP sent successfully', 'success');
        }
      } else {
        throw new Error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP send error:', error);
      const message = error.response?.data?.message || error.message;
      setErrors(prev => ({ ...prev, login: message }));
      showSnackbar(message);
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    
    if (formData.otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Invalid OTP' }));
      return;
    }

    setUiState(prev => ({ ...prev, isLoading: true }));
    setErrors(prev => ({ ...prev, login: '' }));

    try {
      const fullNumber = `${formData.countryCode}${formData.mobileNumber}`;
      console.log('Verifying OTP for:', fullNumber);
      
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        phoneNumber: fullNumber,
        otp: formData.otp
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        showSnackbar('Login successful!', 'success');
        setTimeout(() => navigate('/'), 1000);
      } else {
        throw new Error(response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const message = error.response?.data?.message || error.message;
      setErrors(prev => ({ ...prev, login: message }));
      showSnackbar(message);
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setUiState(prev => ({ ...prev, isLoading: true }));
    setErrors(prev => ({ ...prev, login: '' }));

    try {
      console.log('Google auth credential:', credentialResponse);
      
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        credential: credentialResponse.credential
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        showSnackbar('Google login successful!', 'success');
        setTimeout(() => navigate('/'), 1000);
      } else {
        throw new Error(response.data.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      const message = error.response?.data?.message || error.message;
      setErrors(prev => ({ ...prev, login: message }));
      showSnackbar(message);
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoogleError = () => {
    const message = 'Google login failed';
    setErrors(prev => ({ ...prev, login: message }));
    showSnackbar(message);
  };

  return (
    <Container maxWidth="xs" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue
          </Typography>
        </Box>
        
        {errors.login && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.login}
          </Alert>
        )}

        {!uiState.showOtpField ? (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                sx={{ width: 120 }}
              >
                {COUNTRY_CODES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="mobileNumber"
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
                fullWidth
                placeholder="1234567890"
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={sendOtp}
              disabled={uiState.isLoading || !formData.mobileNumber || !!errors.mobile}
              sx={{ py: 1.5 }}
            >
              {uiState.isLoading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={verifyOtp}>
            <TextField
              name="otp"
              label="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              error={!!errors.otp}
              helperText={errors.otp}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 6 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {uiState.otpCountdown > 0 ? `Resend OTP in ${uiState.otpCountdown}s` : ''}
              </Typography>
              <Button
                size="small"
                onClick={sendOtp}
                disabled={uiState.otpCountdown > 0 || uiState.isLoading}
              >
                Resend OTP
              </Button>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={uiState.isLoading || !formData.otp || !!errors.otp}
              sx={{ py: 1.5 }}
            >
              {uiState.isLoading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }}>OR</Divider>

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="100%"
              size="large"
              shape="rectangular"
            />
          </Box>
        </GoogleOAuthProvider>
      </Paper>

      <Snackbar
        open={uiState.snackbar.open}
        autoHideDuration={6000}
        onClose={() => setUiState(prev => ({
          ...prev,
          snackbar: { ...prev.snackbar, open: false }
        }))}
      >
        <Alert 
          severity={uiState.snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {uiState.snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;