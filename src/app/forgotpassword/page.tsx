"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from 'emailjs-com'; // นำเข้า emailjs-com

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // ตรวจสอบอีเมล
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    // เรียกใช้ EmailJS ส่งอีเมล
    emailjs.send('service_czuhh5b', 'template_2u34l2v', { email }, 'LptTg4CJuNL63rQJ0')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setMessage('Check your email for the reset link!');
      }, (err) => {
        console.error('FAILED...', err);
        setError('Failed to send email. Please try again later.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1E1E1E' }}>
      <div style={{ width: '500px', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '20px', textAlign: 'center' }}>Forgot Your Password?</h1>
        <p style={{ fontSize: '1rem', textAlign: 'center', marginBottom: '20px' }}>
          Please enter your email address to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            style={{ width: '100%', padding: '15px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => router.push('/login')}
              style={{
                backgroundColor: '#f5f6f7',
                color: '#4b4f56',
                border: '1px solid #dfe3ee',
                padding: '12px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#2c2c3c',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Reset
            </button>
          </div>
        </form>
        {message && <p style={{ color: 'green', marginTop: '20px', textAlign: 'center' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
