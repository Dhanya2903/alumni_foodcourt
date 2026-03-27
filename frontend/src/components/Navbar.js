import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const auth = useContext(AuthContext) || {};
    const { user, logout } = auth;
    const cart = useContext(CartContext) || {};
    const { cartCount } = cart;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">Campus Eats</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {!user ? (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link btn btn-light text-primary ms-lg-2 px-3" to="/register">Register</Link></li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to={user.userType === 'Admin' ? '/admin' : '/dashboard'}>Dashboard</Link></li>
                                {user.userType !== 'Admin' && (
                                    <li className="nav-item">
                                        <Link className="nav-link position-relative px-3" to="/cart">
                                            <i className="bi bi-cart3 fs-5"></i>
                                            {cartCount > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item"><span className="nav-link text-white ms-2">Welcome, {user.name}</span></li>
                                <li className="nav-item"><button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Logout</button></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
