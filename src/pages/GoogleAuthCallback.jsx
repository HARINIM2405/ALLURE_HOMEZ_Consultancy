import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the authorization code from the URL (query parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Extract 'code' from URL query parameters

    if (code) {
      console.log('Google login successful, received code:', code);

      // 1. Send this code to your backend to get the access token and user data
      fetch('http://localhost:5000/api/auth/google', { // Backend endpoint for handling Google login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Send the 'code' to your server
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle response (store user info, etc.)
          console.log('User data received:', data);
          if (data.success) {
            // Redirect user to a user dashboard or another page after successful login
            navigate('/usercheck');
          } else {
            console.log('Google login failed', data.message);
          }
        })
        .catch((error) => {
          console.error('Error during Google login:', error);
        });
    } else {
      // Handle the case when no 'code' is received (Google login failed)
      console.log('Google login failed, no code found in URL');
      navigate('/login'); // Optionally redirect to login page if failed
    }
  }, [navigate]);

  return <div>Loading...</div>; // Show loading while the OAuth process completes
};

export default GoogleAuthCallback;
