import React, { useContext } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import PurchaseForm from './components/PurchaseForm.jsx'
import TransactionsList from './components/TransactionsList.jsx'
import CashManagement from './components/CashManagement.jsx'
import Reports from './components/Reports.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { AuthContext } from './context/AuthContext.jsx'
import './index.css'

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ marginBottom: '20px' }}>
        {user ? (
          <>
            <Link to="/">Purchase</Link> |{' '}
            <Link to="/transactions">Transactions</Link> |{' '}
            <Link to="/cash">Cash</Link> |{' '}
            <Link to="/reports">Reports</Link> |{' '}
            <button onClick={logout} style={{ marginLeft: "10px" }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> |{' '}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes */}
        <Route path="/" element={<PrivateRoute><PurchaseForm /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><TransactionsList /></PrivateRoute>} />
        <Route path="/cash" element={<PrivateRoute><CashManagement /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      </Routes>
    </div>
  )
}
