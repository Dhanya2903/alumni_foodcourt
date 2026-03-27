import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import OrderConfirmation from './pages/OrderConfirmation';

const PrivateRoute = ({ children, role }) => {
    const auth = React.useContext(AuthContext) || {};
    const { user, loading } = auth;
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.userType !== role) return <Navigate to="/dashboard" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-vh-100 d-flex flex-column bg-light">
                        <Navbar />
                        <main className="flex-grow-1 py-4">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/admin-login" element={<AdminLogin />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                                <Route path="/admin" element={<PrivateRoute role="Admin"><AdminDashboard /></PrivateRoute>} />
                                <Route path="/confirmation" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
                                <Route path="/" element={<Navigate to="/login" />} />
                            </Routes>
                        </main>
                        <footer className="py-3 bg-white text-center text-muted border-top mt-auto shadow-sm">
                            <div className="container">
                                <p className="mb-0 small">© 2026 Campus Eats. All rights reserved.</p>
                            </div>
                        </footer>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
