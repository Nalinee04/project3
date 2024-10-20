// app/reset-password/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // ช่องกรอกยืนยันรหัสผ่าน
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // ดึงโทเค็นจาก URL

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // ตรวจสอบความยาวของรหัสผ่าน
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          router.push('/login'); // Redirect to login page after successful reset
        }, 2000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {token ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      ) : (
        <p style={{ color: 'red' }}>{error}</p>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPasswordPage;
