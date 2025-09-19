import React, { useContext } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import PurchaseForm from './components/PurchaseForm.jsx'
import TransactionsList from './components/TransactionsList.jsx'
import CashManagement from './components/CashManagement.jsx'
import Reports from './components/Reports.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Bowser from './pages/Bowser.jsx';
import { AuthContext } from './context/AuthContext.jsx'
import './index.css'

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "0px" }}>
      {/* Only show navbar if user is logged in */}
      {user && (
        <nav style={{
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "20px",
          padding: "`18px",
          backgroundColor: "#000000",
          borderBottom: "2px solid #e7e7e7"
        }}>
          <div className='relative top-[6px] flex gap-5'>
          <Link to="/" className='whitespace-nowrap text-2xl'>Suneth Latex (Pvt) Ltd</Link>|{" "}
          <Link to="/">Purchase</Link> |{" "}
          <Link to="/transactions">Transactions</Link> |{" "}
          <Link to="/cash">Cash</Link> |{" "}
          <Link to="/reports">Reports</Link> |{" "}
          <Link to="/bowser" style={{ color: '#fff' }}>Profit</Link>

          </div>
          <button onClick={logout} style={{ 
            marginLeft: "595px", 
            color: "white", 
            background: "red", 
            border: "none", 
            cursor: "pointer", 
            padding: "5px 10px",
            borderRadius: "5px"}}>
            Logout
          </button>
        </nav>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <PurchaseForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <TransactionsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/cash"
          element={
            <PrivateRoute>
              <CashManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route path="/bowser" element={<Bowser />} />

      </Routes>
    </div>
  );
}