import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Person, Email, Phone, Message } from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// 🔍 Suggest email domain corrections
const suggestEmailCorrection = (email) => {
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const parts = email.split('@');
  if (parts.length !== 2) return null;

  const domain = parts[1].toLowerCase();
  let closestMatch = null;
  let minDistance = Infinity;

  const getLevenshteinDistance = (a, b) => {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[a.length][b.length];
  };

  for (const common of commonDomains) {
    const distance = getLevenshteinDistance(domain, common);
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = common;
    }
  }

  return minDistance <= 2 ? `${parts[0]}@${closestMatch}` : null;
};

const Enquiry = () => {
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    phone: '',
    message: '',
    agree: false,
  });

  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailFromGoogle, setEmailFromGoogle] = useState(false);

  useEffect(() => {
    document.title = 'Enquiry | Your Company Name';
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?\d{10,15}$/.test(phone);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'email') {
      const isValid = validateEmail(value);
      const suggestion = suggestEmailCorrection(value);

      if (!isValid) {
        setEmailError('Invalid email format');
      } else if (suggestion && suggestion !== value) {
        setEmailError(`Did you mean "${suggestion}"?`);
      } else {
        setEmailError('');
      }

      setEmailFromGoogle(false);
    }

    if (name === 'phone') {
      setPhoneError(validatePhone(value) ? '' : 'Invalid phone number');
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) {
      alert('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    if (!validateEmail(form.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(form.phone)) {
      alert('Please enter a valid phone number.');
      return;
    }

    try {
      const response = await fetch('/api/inquiries/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.firstName,
          email: form.email,
          contact: form.phone,
          inquiryMessage: form.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inquiry submitted successfully!');
        setForm({
          firstName: '',
          email: '',
          phone: '',
          message: '',
          agree: false,
        });
        setEmailError('');
        setPhoneError('');
        setEmailFromGoogle(false);
      } else {
        alert('Failed to submit inquiry: ' + data.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting the inquiry.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: 2,
        mt: 8,
        marginLeft: '450px',
        backgroundColor: '#f5f7fa'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 3,
          backgroundColor: '#fff'
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Enquiry Form
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            fullWidth
            name="firstName"
            label="Name"
            value={form.firstName}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
            variant="outlined"
            margin="dense"
            required
            disabled={emailFromGoogle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            name="phone"
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={!!phoneError}
            helperText={phoneError}
            variant="outlined"
            margin="dense"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            name="message"
            label="Message"
            value={form.message}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
            required
            multiline
            minRows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Message />
                </InputAdornment>
              )
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.agree}
                onChange={handleChange}
                name="agree"
                color="primary"
              />
            }
            label="I agree to the Terms of Service and Privacy Policy"
            sx={{ mt: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ px: 4, py: 1, fontSize: '0.9rem' }}
            >
              Submit
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              — or —
            </Typography>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log('Google user:', decoded);
                setForm((prev) => ({
                  ...prev,
                  email: decoded.email || '',
                  firstName: decoded.name || ''
                }));
                setEmailError('');
                setEmailFromGoogle(true);
              }}
              onError={() => {
                alert('Google Sign-In failed');
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mt: 4 }}
        >
          You can also reach us at: <br />
          <strong>info@allurehomez.com</strong> | <strong>(665) 123-4567</strong>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Enquiry;
