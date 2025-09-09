import React, { useState, useContext } from 'react';
import api from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.token); // save in context
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email}
             onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password}
             onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
