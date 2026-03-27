import React, { useState, useEffect } from 'react';
import { getAllFood, addFood, editFood, deleteFood, getAllOrders, updateOrderStatus } from '../api';

const AdminDashboard = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [editingFood, setEditingFood] = useState(null);
    const [newFood, setNewFood] = useState({ name: '', price: '', description: '', category: 'Both', dietaryType: 'Veg', imageUrl: '' });
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'food'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: foodData } = await getAllFood();
            const { data: orderData } = await getAllOrders();
            setFoodItems(foodData);
            setOrders(orderData);
        } catch (err) {
            console.error('Failed to fetch data');
        }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            await addFood(newFood);
            setNewFood({ name: '', price: '', description: '', category: 'Both', dietaryType: 'Veg', imageUrl: '' });
            fetchData();
            alert('Food item added successfully!');
        } catch (err) {
            alert('Failed to add food');
        }
    };

    const handleEditFood = async (e) => {
        e.preventDefault();
        try {
            await editFood(editingFood._id, editingFood);
            setEditingFood(null);
            fetchData();
            alert('Food item updated successfully!');
        } catch (err) {
            alert('Failed to edit food');
        }
    };

    const handleDeleteFood = async (id) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            try {
                await deleteFood(id);
                fetchData();
            } catch (err) {
                alert('Failed to delete food');
            }
        }
    };

    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await updateOrderStatus(id, { orderStatus: status });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const downloadExcel = () => {
        if (orders.length === 0) return alert('No orders to export');
        
        // CSV Header
        const headers = ['Order Code', 'Date', 'Student Name', 'Type', 'Items', 'Total Bill', 'Payment', 'Status'];
        
        // CSV Data
        const csvData = orders.map(order => [
            order.orderCode,
            new Date(order.createdAt).toLocaleString(),
            order.userId?.name,
            order.userType,
            order.items.map(item => `${item.foodId?.name} (x${item.quantity})`).join('; '),
            order.totalBill || order.totalAmount,
            order.paymentMethod,
            order.orderStatus
        ]);

        const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Orders_Report_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalBill || order.totalAmount), 0);
    const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered').length;

    return (
        <div className="container-fluid px-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Admin Control Center</h2>
                <div>
                    <button className="btn btn-outline-success fw-bold shadow-sm" onClick={downloadExcel}>
                        <i className="bi bi-file-earmark-excel me-2"></i>Export Report
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card shadow-sm border-0 bg-primary text-white p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-uppercase small">Total Orders</h6>
                                <h3 className="mb-0 fw-bold">{orders.length}</h3>
                            </div>
                            <div className="fs-1 opacity-50"><i className="bi bi-bag-check"></i></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0 bg-success text-white p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-uppercase small">Total Revenue</h6>
                                <h3 className="mb-0 fw-bold">₹{totalRevenue}</h3>
                            </div>
                            <div className="fs-1 opacity-50"><i className="bi bi-currency-rupee"></i></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0 bg-warning text-dark p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-uppercase small">Pending Tasks</h6>
                                <h3 className="mb-0 fw-bold">{pendingOrders}</h3>
                            </div>
                            <div className="fs-1 opacity-50"><i className="bi bi-clock-history"></i></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0 bg-info text-white p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-uppercase small">Active Menu</h6>
                                <h3 className="mb-0 fw-bold">{foodItems.length} Items</h3>
                            </div>
                            <div className="fs-1 opacity-50"><i className="bi bi-list-ul"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <ul className="nav nav-tabs mb-4 border-0">
                <li className="nav-item">
                    <button className={`nav-link border-0 fw-bold px-4 ${activeTab === 'orders' ? 'active bg-white text-primary border-bottom' : 'text-muted'}`} onClick={() => setActiveTab('orders')}>
                        Order Management
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link border-0 fw-bold px-4 ${activeTab === 'food' ? 'active bg-white text-primary border-bottom' : 'text-muted'}`} onClick={() => setActiveTab('food')}>
                        Menu Management
                    </button>
                </li>
            </ul>

            {activeTab === 'orders' ? (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white py-3">
                        <h5 className="mb-0 fw-bold">Incoming & Active Orders</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Order Details</th>
                                        <th>Student Info</th>
                                        <th>Items Summary</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th className="pe-4 text-end">Update Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark fs-5">{order.orderCode}</div>
                                                <div className="small text-muted">{new Date(order.createdAt).toLocaleString()}</div>
                                            </td>
                                            <td>
                                                <div className="fw-bold">{order.userId?.name}</div>
                                                <span className={`badge rounded-pill bg-light text-dark border small`}>{order.userType}</span>
                                                {order.hostelName && <div className="small text-info">{order.hostelName} - {order.roomNumber}</div>}
                                            </td>
                                            <td>
                                                <div className="small">
                                                    {order.items.map(item => `${item.foodId?.name} (x${item.quantity})`).join(', ')}
                                                </div>
                                            </td>
                                            <td className="fw-bold text-primary">₹{order.totalBill || order.totalAmount}</td>
                                            <td>
                                                <div className="small fw-bold text-dark">{order.paymentMethod}</div>
                                                <span className={`badge bg-${order.paymentStatus === 'Completed' ? 'success' : 'warning'} small`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge bg-${
                                                    order.orderStatus === 'Delivered' ? 'success' : 
                                                    order.orderStatus === 'Ready' ? 'info' : 
                                                    order.orderStatus === 'Packed' ? 'primary' :
                                                    order.orderStatus === 'Preparing' ? 'warning' : 'secondary'
                                                }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <select className="form-select form-select-sm d-inline-block w-auto" value={order.orderStatus} onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}>
                                                    <option value="Ordered">Ordered</option>
                                                    <option value="Preparing">Preparing</option>
                                                    <option value="Packed">Packed</option>
                                                    <option value="Ready">Ready</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0 fw-bold">{editingFood ? 'Edit Food Item' : 'Add New Item'}</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={editingFood ? handleEditFood : handleAddFood}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Food Name</label>
                                        <input type="text" className="form-control" value={editingFood ? editingFood.name : newFood.name} onChange={(e) => editingFood ? setEditingFood({ ...editingFood, name: e.target.value }) : setNewFood({ ...newFood, name: e.target.value })} required />
                                    </div>
                                    <div className="row">
                                        <div className="col-6 mb-3">
                                            <label className="form-label small fw-bold">Price (₹)</label>
                                            <input type="number" className="form-control" value={editingFood ? editingFood.price : newFood.price} onChange={(e) => editingFood ? setEditingFood({ ...editingFood, price: e.target.value }) : setNewFood({ ...newFood, price: e.target.value })} required />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <label className="form-label small fw-bold">Dietary Type</label>
                                            <select className="form-select" value={editingFood ? editingFood.dietaryType : newFood.dietaryType} onChange={(e) => editingFood ? setEditingFood({ ...editingFood, dietaryType: e.target.value }) : setNewFood({ ...newFood, dietaryType: e.target.value })} required>
                                                <option value="Veg">Veg</option>
                                                <option value="Non-Veg">Non-Veg</option>
                                                <option value="Snacks">Snacks</option>
                                                <option value="Dessert">Dessert</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Category</label>
                                        <select className="form-select" value={editingFood ? editingFood.category : newFood.category} onChange={(e) => editingFood ? setEditingFood({ ...editingFood, category: e.target.value }) : setNewFood({ ...newFood, category: e.target.value })} required>
                                            <option value="Both">Both Students</option>
                                            <option value="Hosteler">Hosteler Only</option>
                                            <option value="Day Scholar">Day Scholar Only</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Description</label>
                                        <textarea className="form-control" rows="2" value={editingFood ? editingFood.description : newFood.description} onChange={(e) => editingFood ? setEditingFood({ ...editingFood, description: e.target.value }) : setNewFood({ ...newFood, description: e.target.value })} required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold">Image URL</label>
                                        <input type="text" className="form-control" value={editingFood ? editingFood.imageUrl : newFood.imageUrl} onChange={(e) => editingFood ? setEditingFood({ ...editingFood, imageUrl: e.target.value }) : setNewFood({ ...newFood, imageUrl: e.target.value })} />
                                    </div>
                                    <button type="submit" className={`btn w-100 fw-bold ${editingFood ? 'btn-warning' : 'btn-primary'}`}>
                                        {editingFood ? 'Save Changes' : 'Publish to Menu'}
                                    </button>
                                    {editingFood && <button type="button" className="btn btn-link w-100 mt-2 text-muted text-decoration-none" onClick={() => setEditingFood(null)}>Cancel Edit</button>}
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0 fw-bold">Live Menu Items</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-4">Item</th>
                                                <th>Category</th>
                                                <th>Diet</th>
                                                <th>Price</th>
                                                <th className="pe-4 text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {foodItems.map(food => (
                                                <tr key={food._id}>
                                                    <td className="ps-4">
                                                        <div className="d-flex align-items-center">
                                                            <img src={food.imageUrl || 'https://via.placeholder.com/50'} className="rounded me-3" width="45" height="45" alt={food.name} style={{objectFit: 'cover'}} />
                                                            <div>
                                                                <div className="fw-bold">{food.name}</div>
                                                                <div className="small text-muted text-truncate" style={{maxWidth: '150px'}}>{food.description}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><small>{food.category}</small></td>
                                                    <td>
                                                        <span className={`badge bg-light text-${
                                                            food.dietaryType === 'Veg' ? 'success' : 
                                                            food.dietaryType === 'Non-Veg' ? 'danger' : 
                                                            food.dietaryType === 'Dessert' ? 'info' :
                                                            'warning'
                                                        } border small`}>
                                                            {food.dietaryType}
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold">₹{food.price}</td>
                                                    <td className="pe-4 text-end">
                                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditingFood(food); window.scrollTo(0, 0); }} title="Edit">
                                                            <i className="bi bi-pencil"></i> Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteFood(food._id)} title="Delete">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
