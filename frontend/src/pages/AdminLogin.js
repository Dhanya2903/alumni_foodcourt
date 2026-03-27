import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as loginApi } from '../api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = useContext(AuthContext) || {};
    const { login } = auth;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginApi({ email, password });
            if (data.user.userType !== 'Admin') {
                alert('Access denied. This page is for administrators only.');
                return;
            }
            login(data);
            navigate('/admin');
        } catch (err) {
            alert('Login failed: ' + (err.response?.data?.message || 'Invalid credentials'));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-dark text-white text-center py-4">
                            <h3 className="mb-0">Admin Portal</h3>
                            <small>Enter your credentials to manage the campus kitchen</small>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold">Admin Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="bi bi-person-badge"></i></span>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            placeholder="admin@campuseats.com"
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label fw-bold">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="••••••••"
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-dark w-100 py-2 fw-bold">
                                    Login to Dashboard
                                </button>
                            </form>
                        </div>
                        <div className="card-footer text-center py-3 bg-light border-0">
                            <a href="/login" className="text-decoration-none text-muted small">
                                <i className="bi bi-arrow-left me-1"></i> Back to Student Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
