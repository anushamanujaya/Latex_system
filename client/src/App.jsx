import React, { useContext } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import PurchaseForm from './components/PurchaseForm.jsx'
import TransactionsList from './components/TransactionsList.jsx'
import CashManagement from './components/CashManagement.jsx'
import Reports from './components/Reports.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Bowser from './pages/Bowser.jsx'
import { AuthContext } from './context/AuthContext.jsx'
import './index.css'

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-0">
      {/* ✅ Only show navbar if logged in */}
      {user && (
        <nav className="bg-black border-b-2 border-gray-200 mb-6">
          <div className="flex justify-between items-center px-6 py-4">
            
            {/* Left side - Brand + Links */}
            <div className="flex items-center gap-6 flex-wrap">
              <Link
                to="/"
                className="text-2xl font-bold text-white whitespace-nowrap hover:text-sky-400 ml-10"
              >
                Suneth Latex (Pvt) Ltd
              </Link>
              <Link to="/" className="text-xl text-gray-200 hover:text-sky-400 ml-50">
                Purchase
              </Link>
              <Link to="/transactions" className="text-xl text-gray-200 hover:text-sky-400 ml-5">
                Transactions
              </Link>
              <Link to="/cash" className="text-xl text-gray-200 hover:text-sky-400 ml-5">
                Cash
              </Link>
              <Link to="/reports" className="text-xl text-gray-200 hover:text-sky-400 ml-5">
                Reports
              </Link>
              <Link to="/bowser" className="text-xl text-white hover:text-sky-400 ml-5">
                Profit
              </Link>
            </div>

            {/* Right side - Logout */}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold mr-25 text-l text-center"
            >
              Logout
            </button>
          </div>
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