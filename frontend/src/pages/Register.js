import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Hosteler');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerApi({ name, email, password, userType });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'An unknown error occurred';
            alert('Registration failed: ' + errorMsg);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center mb-0">Student Registration</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Are you a Hosteler or Day Scholar?</label>
                                    <select className="form-select" value={userType} onChange={(e) => setUserType(e.target.value)} required>
                                        <option value="Hosteler">Hosteler</option>
                                        <option value="Day Scholar">Day Scholar</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                            <div className="mt-3 text-center">
                                <p className="mb-0">Already have an account? <a href="/login" className="text-decoration-none">Login here</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
