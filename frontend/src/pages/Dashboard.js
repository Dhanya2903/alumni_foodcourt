import React, { useState, useEffect, useContext } from 'react';
import { getFoodByCategory, getUserOrders } from '../api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [dietaryFilter, setDietaryFilter] = useState('All');
    const [activeOrder, setActiveOrder] = useState(null);
    const [lastDeliveredOrder, setLastDeliveredOrder] = useState(null);
    const [showMenuImage, setShowMenuImage] = useState(false);
    const auth = useContext(AuthContext) || {};
    const { user } = auth;
    const { addToCart, cartCount, orderType, setOrderType } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const fetchFood = async () => {
            try {
                const { data } = await getFoodByCategory(user.userType);
                setFoodItems(data);
            } catch (err) {
                console.error('Failed to fetch food items');
            }
        };
        fetchFood();

        // Polling for active order status
        const fetchActiveOrder = async () => {
            try {
                const { data } = await getUserOrders(user.id);
                if (data && data.length > 0) {
                    // Sort by newest first
                    const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    const latestOrder = sortedOrders[0];

                    if (latestOrder.orderStatus !== 'Delivered') {
                        // Current action is active
                        setActiveOrder(latestOrder);
                        setLastDeliveredOrder(null); // Remove any old delivered notifications
                    } else {
                        // Latest order is delivered
                        setActiveOrder(null);
                        // Only show delivered message if it was recent (last 5 minutes)
                        const isRecent = (new Date() - new Date(latestOrder.updatedAt)) < 300000;
                        setLastDeliveredOrder(isRecent ? latestOrder : null);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch active order');
            }
        };
        fetchActiveOrder();
        const interval = setInterval(fetchActiveOrder, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [user.userType, user.id]);

    const filteredFoodItems = foodItems.filter(item => {
        if (dietaryFilter === 'All') return true;
        return item.dietaryType === dietaryFilter;
    });

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col-md-12">
                    <h2 className="mb-0">Welcome to {user.userType} Ordering, {user.name}!</h2>
                </div>
            </div>

            {activeOrder && (
                <div className="card border-0 shadow-sm mb-4 overflow-hidden">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="mb-1 fw-bold text-primary">Track Your Order</h5>
                                <p className="text-muted small mb-0">Order Code: <span className="fw-bold text-dark">{activeOrder.orderCode}</span></p>
                            </div>
                            <Link to="/confirmation" state={{ order: activeOrder }} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                <i className="bi bi-eye-fill me-1"></i>View Full Details
                            </Link>
                        </div>

                        {/* Visual Progress Tracker */}
                        <div className="order-tracking-wrapper position-relative">
                            <div className="progress" style={{ height: '4px', position: 'absolute', top: '15px', left: '10%', right: '10%', zIndex: 0 }}>
                                <div 
                                    className="progress-bar bg-success" 
                                    role="progressbar" 
                                    style={{ 
                                        width: 
                                            activeOrder.orderStatus === 'Ordered' ? '0%' :
                                            activeOrder.orderStatus === 'Preparing' ? '33%' :
                                            activeOrder.orderStatus === 'Packed' ? '66%' :
                                            activeOrder.orderStatus === 'Ready' ? '100%' : '100%'
                                    }}
                                ></div>
                            </div>
                            
                            <div className="d-flex justify-content-between position-relative" style={{ zIndex: 1 }}>
                                {[
                                    { status: 'Ordered', icon: 'bi-bag-check', label: 'Ordered' },
                                    { status: 'Preparing', icon: 'bi-fire', label: 'Preparing' },
                                    { status: 'Packed', icon: 'bi-box-seam', label: 'Packed' },
                                    { status: 'Ready', icon: 'bi-check2-circle', label: 'Ready for Pickup' }
                                ].map((step, index) => {
                                    const statusOrder = ['Ordered', 'Preparing', 'Packed', 'Ready', 'Delivered'];
                                    const currentIndex = statusOrder.indexOf(activeOrder.orderStatus);
                                    const stepIndex = statusOrder.indexOf(step.status);
                                    const isActive = currentIndex >= stepIndex;
                                    const isCurrent = currentIndex === stepIndex;

                                    return (
                                        <div key={index} className="text-center" style={{ width: '20%' }}>
                                            <div 
                                                className={`rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-2 ${isActive ? 'bg-success text-white' : 'bg-white text-muted border'}`}
                                                style={{ width: '35px', height: '35px', transition: 'all 0.3s ease' }}
                                            >
                                                <i className={`bi ${step.icon} ${isCurrent ? 'animate-bounce' : ''}`}></i>
                                            </div>
                                            <div className={`small fw-bold ${isActive ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                                                {step.label}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {activeOrder.orderStatus === 'Ready' && (
                        <div className="bg-success text-white text-center py-2 small fw-bold">
                            <i className="bi bi-info-circle-fill me-2"></i>
                            Your food is ready! Please collect it from the counter.
                        </div>
                    )}
                </div>
            )}

            {lastDeliveredOrder && !activeOrder && (
                <div className="alert alert-success border-0 shadow-sm d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <strong>Order Delivered!</strong> Your order <span className="badge bg-dark">{lastDeliveredOrder.orderCode}</span> was delivered successfully. Enjoy your meal!
                    </div>
                    <button className="btn btn-close" onClick={() => setLastDeliveredOrder(null)}></button>
                </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                {user.userType === 'Hosteler' && (
                    <div className="btn-group shadow-sm mt-2 mt-md-0">
                        <button 
                            className={`btn ${orderType === 'Normal' ? 'btn-primary' : 'btn-outline-primary'} px-4`}
                            onClick={() => setOrderType('Normal')}
                        >
                            <i className="bi bi-shop me-2"></i>Normal Order
                        </button>
                        <button 
                            className={`btn ${orderType === 'Hostel' ? 'btn-primary' : 'btn-outline-primary'} px-4`}
                            onClick={() => setOrderType('Hostel')}
                        >
                            <i className="bi bi-building me-2"></i>Hostel Order
                        </button>
                    </div>
                )}
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body py-3 d-flex justify-content-between align-items-center flex-wrap">
                            <div className="d-flex align-items-center">
                                <h5 className="mb-0 me-3 fw-bold">Available Food Menu</h5>
                                <button 
                                    className="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm"
                                    onClick={() => setShowMenuImage(true)}
                                >
                                    <i className="bi bi-image me-2"></i>View Price List
                                </button>
                            </div>
                            <div className="btn-group shadow-sm mt-2 mt-md-0">
                                <button className={`btn btn-sm ${dietaryFilter === 'All' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setDietaryFilter('All')}>All Items</button>
                                <button className={`btn btn-sm ${dietaryFilter === 'Veg' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setDietaryFilter('Veg')}>Veg Only</button>
                                <button className={`btn btn-sm ${dietaryFilter === 'Non-Veg' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setDietaryFilter('Non-Veg')}>Non-Veg</button>
                                <button className={`btn btn-sm ${dietaryFilter === 'Snacks' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setDietaryFilter('Snacks')}>Snacks</button>
                                <button className={`btn btn-sm ${dietaryFilter === 'Dessert' ? 'btn-info' : 'btn-outline-info'}`} onClick={() => setDietaryFilter('Dessert')}>Cakes</button>
                            </div>
                        </div>
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                        {filteredFoodItems.map(food => (
                            <div key={food._id} className="col">
                                <div className="card shadow-sm h-100 border-0 overflow-hidden hover-card">
                                    {/* Image section removed for text-only view */}
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-truncate" style={{maxWidth: '70%'}}>
                                                {food.name}
                                                <span className={`ms-2 badge small ${
                                                    food.dietaryType === 'Veg' ? 'bg-success' : 
                                                    food.dietaryType === 'Non-Veg' ? 'bg-danger' : 
                                                    food.dietaryType === 'Dessert' ? 'bg-info' :
                                                    'bg-warning text-dark'
                                                }`} style={{fontSize: '0.6rem'}}>
                                                    {food.dietaryType}
                                                </span>
                                            </span>
                                            <span className="text-primary fw-bold">₹{food.price}</span>
                                        </h5>
                                        <p className="card-text text-muted small flex-grow-1" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                            {food.description}
                                        </p>
                                        <button className="btn btn-primary w-100 mt-3 rounded-pill" onClick={() => addToCart(food)}>
                                            <i className="bi bi-plus-lg me-2"></i>Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredFoodItems.length === 0 && (
                        <div className="text-center py-5">
                            <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                            <p className="text-muted">No food items match your current filter.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Cart Button for Mobile */}
            {cartCount > 0 && (
                <Link to="/cart" className="btn btn-primary rounded-circle shadow-lg position-fixed bottom-0 end-0 m-4 p-3 d-lg-none" style={{zIndex: 1000}}>
                    <i className="bi bi-cart3 fs-3"></i>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}
                    </span>
                </Link>
            )}

            {/* Menu Price List Modal */}
            {showMenuImage && (
                <div 
                    className="modal fade show d-block" 
                    tabIndex="-1" 
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}
                    onClick={() => setShowMenuImage(false)}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Food Court Price List</h5>
                                <button type="button" className="btn-close" onClick={() => setShowMenuImage(false)}></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <img 
                                    src="/menu_price_list.jpg" 
                                    className="img-fluid rounded shadow-sm" 
                                    alt="Menu Price List" 
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = 'https://via.placeholder.com/800x600?text=Price+List+Image+Not+Found+in+/public/menu_price_list.jpg';
                                    }}
                                />
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowMenuImage(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
