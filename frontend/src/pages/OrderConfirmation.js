import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) return <div className="container mt-5 text-center"><h2>No Order Found</h2><Link to="/dashboard" className="btn btn-primary mt-3">Go to Dashboard</Link></div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg text-center p-4">
                        <div className="card-body">
                            <div className="mb-4">
                                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h1 className="text-success mb-3">Order Confirmed!</h1>
                            <p className="lead mb-4">Your order has been placed successfully. Thank you for using Campus Eats!</p>
                            
                            <div className="alert alert-info py-3 px-4">
                                <div className="text-center mb-3">
                                    <div className="small text-muted text-uppercase fw-bold">Verification Code</div>
                                    <div className="display-4 fw-bold text-dark">{order.orderCode}</div>
                                    <div className="small text-muted">Show this at the pickup counter</div>
                                </div>
                                <hr />
                                <div className="row text-start">
                                    <div className="col-sm-6 mb-2">
                                        <p className="mb-1 text-muted small">Total Bill</p>
                                        <p className="fw-bold mb-0 text-primary">₹{order.totalBill || order.totalAmount}</p>
                                    </div>
                                    <div className="col-sm-6 mb-2">
                                        <p className="mb-1 text-muted small">Order Type</p>
                                        <p className="fw-bold mb-0">{order.userType}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <p className="mb-1 text-muted small">Payment Method</p>
                                        <p className="fw-bold mb-0">{order.paymentMethod}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <p className="mb-1 text-muted small">Current Status</p>
                                        <p className={`fw-bold mb-0 ${order.orderStatus === 'Delivered' ? 'text-success' : 'text-primary'}`}>{order.orderStatus}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-2">
                                <Link to="/dashboard" className="btn btn-primary btn-lg px-5">Back to Dashboard</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
