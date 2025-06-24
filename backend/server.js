/* eslint-disable no-undef */
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import speakeasy from 'speakeasy';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Rate limiting
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many OTP requests from this IP, please try again later'
});

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.options('*', cors()); // Handle preflight requests

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const otpStore = new Map();

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// OTP Endpoints
app.post('/api/auth/send-otp', otpLimiter, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number is required' 
      });
    }

    // Generate OTP
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 300 // 5 minutes
    });

    // Store OTP (in production, use Redis or database)
    otpStore.set(phoneNumber, {
      secret: secret.base32,
      token,
      expires: Date.now() + 300000, // 5 minutes
      attempts: 0
    });

    console.log(`OTP for ${phoneNumber}: ${token}`);

    return res.status(200).json({ 
      success: true,
      message: 'OTP sent successfully',
      otp: NODE_ENV === 'development' ? token : null
    });
    
  } catch (error) {
    console.error('OTP generation error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to generate OTP'
    });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number and OTP are required' 
      });
    }

    const storedOtp = otpStore.get(phoneNumber);
    
    if (!storedOtp) {
      return res.status(404).json({ 
        success: false,
        message: 'OTP not found or expired' 
      });
    }

    // Increment attempt counter
    storedOtp.attempts += 1;
    otpStore.set(phoneNumber, storedOtp);

    if (storedOtp.attempts > 3) {
      otpStore.delete(phoneNumber);
      return res.status(429).json({ 
        success: false,
        message: 'Too many attempts. Please request a new OTP.' 
      });
    }

    if (Date.now() > storedOtp.expires) {
      otpStore.delete(phoneNumber);
      return res.status(401).json({ 
        success: false,
        message: 'OTP expired' 
      });
    }

    // Allow direct OTP comparison in development
    const isValid = NODE_ENV === 'development' 
      ? otp === storedOtp.token
      : speakeasy.totp.verify({
          secret: storedOtp.secret,
          encoding: 'base32',
          token: otp,
          window: 1
        });

    if (!isValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 3 - storedOtp.attempts
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { phoneNumber, role: 'Customer' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    otpStore.delete(phoneNumber);
    
    return res.status(200).json({ 
      success: true,
      token,
      user: { phoneNumber }
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'OTP verification failed'
    });
  }
});

// Google Auth Endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ 
        success: false,
        message: 'No credential provided' 
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload.email_verified) {
      return res.status(403).json({ 
        success: false,
        message: 'Email not verified' 
      });
    }

    const token = jwt.sign(
      {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: 'Customer'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.status(200).json({ 
      success: true,
      token,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Authentication failed'
    });
  }
});

// Error handling middleware
app.use((err, req, res) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
  console.log('Google OAuth Client ID:', GOOGLE_CLIENT_ID ? 'Configured' : 'Missing');
});