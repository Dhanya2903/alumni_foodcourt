import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../api';

const Cart = () => {
    const auth = useContext(AuthContext) || {};
    const { user } = auth;
    const cartContext = useContext(CartContext) || {};
    const { 
        cart, removeFromCart, updateQuantity, totalAmount, clearCart, 
        orderType, deliveryFee, totalBill 
    } = cartContext;
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [hostelName, setHostelName] = useState('');
    const [roomNo, setRoomNo] = useState('');
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Your cart is empty');
        setShowPayment(true);
    };

    const processPayment = async () => {
        if (orderType === 'Hostel') {
            if (!hostelName || !roomNo) {
                alert('Please enter your Hostel Name and Room Number for Hostel Delivery');
                return;
            }
        }

        if (paymentMethod === 'UPI') {
            try {
                // Initialize Razorpay
                const orderData = {
                    amount: totalBill,
                    currency: 'INR'
                };
                
                console.log('Initiating payment request to backend:', orderData);
                const { data: razorpayOrder } = await createRazorpayOrder(orderData);
                console.log('Razorpay order received from backend:', razorpayOrder);
                
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: "Campus Eats",
                    description: "Food Court Order Payment",
                    order_id: razorpayOrder.id,
                    handler: async function (response) {
                        // Payment successful, now create the order in our database
                        try {
                            const verifyData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            };
                            
                            await verifyRazorpayPayment(verifyData);
                            
                            const orderPayload = {
                                userId: user.id,
                                items: cart.map(item => ({ foodId: item._id, quantity: item.quantity, price: item.price })),
                                totalAmount,
                                deliveryCharges: deliveryFee,
                                totalBill,
                                paymentMethod: 'Razorpay',
                                userType: user.userType,
                                hostelName: orderType === 'Hostel' ? hostelName : '',
                                roomNumber: orderType === 'Hostel' ? roomNo : '',
                                paymentStatus: 'Paid',
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id
                            };
                            
                            const { data } = await createOrder(orderPayload);
                            clearCart();
                            alert('Order placed successfully!');
                            navigate('/confirmation', { state: { order: data } });
                        } catch (err) {
                            alert("Payment verification failed. Please contact support.");
                            console.error(err);
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                    },
                    theme: {
                        color: "#0d6efd"
                    }
                };
                
                const rzp = new window.Razorpay(options);
                rzp.open();
                
            } catch (err) {
                const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
                alert(`Could not initiate payment: ${errorMsg}`);
                console.error(err);
            }
        } else {
            // COD Logic
            try {
                const orderData = {
                    userId: user.id,
                    items: cart.map(item => ({ foodId: item._id, quantity: item.quantity, price: item.price })),
                    totalAmount,
                    deliveryCharges: deliveryFee,
                    totalBill,
                    paymentMethod: 'COD',
                    userType: user.userType,
                    hostelName: orderType === 'Hostel' ? hostelName : '',
                    roomNumber: orderType === 'Hostel' ? roomNo : '',
                    paymentStatus: 'Pending'
                };

                const { data } = await createOrder(orderData);
                clearCart();
                alert('Order placed successfully!');
                navigate('/confirmation', { state: { order: data } });
            } catch (err) {
                console.error('Order Error:', err);
                const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
                alert('Failed to place order: ' + errorMsg);
            }
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="container mt-5 text-center py-5">
                <div className="card shadow-sm border-0 p-5">
                    <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
                    <h3>Your cart is empty</h3>
                    <p className="text-muted mb-4">Add some delicious items to get started!</p>
                    <Link to="/dashboard" className="btn btn-primary px-5 rounded-pill">Browse Menu</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4 fw-bold text-center">Your Shopping Cart</h2>
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Cart Items ({cart.length})</h5>
                        </div>
                        <div className="list-group list-group-flush">
                            {cart.map(item => (
                                <div key={item._id} className="list-group-item py-3 border-light">
                                    <div className="row align-items-center">
                                        <div className="col-md-2 col-4">
                                            <img src={item.imageUrl || 'https://via.placeholder.com/100'} className="img-fluid rounded" alt={item.name} />
                                        </div>
                                        <div className="col-md-4 col-8">
                                            <h6 className="mb-1 fw-bold">{item.name}</h6>
                                            <span className={`badge bg-light text-${item.dietaryType === 'Veg' ? 'success' : item.dietaryType === 'Non-Veg' ? 'danger' : 'warning'} border small mb-2`}>
                                                {item.dietaryType}
                                            </span>
                                            <div className="text-primary fw-bold">₹{item.price}</div>
                                        </div>
                                        <div className="col-md-3 col-6 mt-3 mt-md-0">
                                            <div className="input-group input-group-sm" style={{width: '120px'}}>
                                                <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                                <input type="text" className="form-control text-center bg-white" value={item.quantity} readOnly />
                                                <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-4 mt-3 mt-md-0 text-md-end fw-bold fs-5">
                                            ₹{item.price * item.quantity}
                                        </div>
                                        <div className="col-md-1 col-2 mt-3 mt-md-0 text-end">
                                            <button className="btn btn-link text-danger p-0" onClick={() => removeFromCart(item._id)}>
                                                <i className="bi bi-trash fs-5"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="card-footer bg-white py-3 border-0 d-flex justify-content-between">
                            <button className="btn btn-link text-muted text-decoration-none p-0" onClick={clearCart}>Clear Cart</button>
                            <Link to="/dashboard" className="btn btn-link text-primary text-decoration-none p-0">Add More Items</Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    {!showPayment ? (
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-header bg-white py-3 border-0">
                                <h5 className="mb-0 fw-bold">Order Summary</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="fw-bold">₹{totalAmount}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Delivery Type</span>
                                    <span className={`badge ${orderType === 'Hostel' ? 'bg-info' : 'bg-secondary'}`}>{orderType}</span>
                                </div>
                                {orderType === 'Hostel' && (
                                    <div className="d-flex justify-content-between mb-2 small text-info">
                                        <span>Hostel Delivery Fee</span>
                                        <span>+₹{deliveryFee}</span>
                                    </div>
                                )}
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <h5 className="fw-bold">Total Bill</h5>
                                    <h5 className="fw-bold text-primary">₹{totalBill}</h5>
                                </div>
                                <button className="btn btn-primary w-100 py-2 fw-bold rounded-pill" onClick={handleCheckout}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm rounded-3 animate-fade-in">
                            <div className="card-header bg-primary text-white py-3 border-0">
                                <h5 className="mb-0 fw-bold">Checkout & Payment</h5>
                            </div>
                            <div className="card-body">
                                {orderType === 'Hostel' && (
                                    <div className="alert alert-warning border-0 shadow-sm mb-4">
                                        <h6 className="fw-bold mb-3 small"><i className="bi bi-geo-alt-fill me-2"></i>Hostel Delivery Details</h6>
                                        <div className="row g-2">
                                            <div className="col-12 mb-2">
                                                <label className="form-label small fw-bold">Hostel Name</label>
                                                <select 
                                                    className="form-select form-select-sm" 
                                                    value={hostelName}
                                                    onChange={(e) => setHostelName(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Hostel</option>
                                                    <option value="Bhavani">Bhavani</option>
                                                    <option value="Kaveri">Kaveri</option>
                                                    <option value="Amaravati">Amaravati</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <input 
                                                    type="text" 
                                                    className="form-control form-control-sm" 
                                                    placeholder="Room Number"
                                                    value={roomNo}
                                                    onChange={(e) => setRoomNo(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase mb-3">Payment Method</label>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="radio" name="payMethod" id="simUpi" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <label className="form-check-label" htmlFor="simUpi">UPI (Manual Simulation)</label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="radio" name="payMethod" id="cod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <label className="form-check-label" htmlFor="cod">Cash on Delivery (COD)</label>
                                    </div>
                                </div>

                                <div className="bg-light p-3 rounded-3 mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="small text-muted">Amount Payable</span>
                                        <h4 className="mb-0 fw-bold text-primary">₹{totalBill}</h4>
                                    </div>
                                    <div className="small text-muted text-end">Incl. charges</div>
                                </div>

                                <button className="btn btn-success w-100 py-2 fw-bold rounded-pill mb-2" onClick={processPayment}>
                                    Confirm Order
                                </button>
                                <button className="btn btn-link w-100 text-muted text-decoration-none small" onClick={() => setShowPayment(false)}>
                                    Back to Summary
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
