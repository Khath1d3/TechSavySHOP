import React,{useState, useEffect} from "react";
import "../componentStyle/invoicestyle.css";
import OrderHistoryCard from "./OrderHistoryCard";
import { getData } from "./ApiService";
import { useLoader } from "../assets/LoaderContext";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const { showLoader, hideLoader } = useLoader();
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchOrders();
    }, [selectedYear]);

    const fetchOrders = async () => {
        try {
            showLoader();
            const response = await getData("GetOrderDetails");
            if (response.success) {
                // Data is already structured with OrderItems
                const orders = (response.data || []).map(order => ({
                    orderID: order.orderID,
                    orderDate: order.orderDate,
                    totalAmount: order.totalAmount,
                    status: order.status,
                    addressLine1: order.addressLine1,
                    addressLabel: order.addressLabel,
                    city: order.city,
                    country: order.country,
                    postalCode: order.postalCode,
                    paymentMethod: order.paymentMethod,
                    products: order.orderItems || []
                }));
                // Sort by date (newest first)
                orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                
                setOrders(orders);
            } else {
                setMessage("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setMessage("Error loading orders");
        } finally {
            hideLoader();
        }
    };

    return (
    <div className="invoice-section">
    <div className="invoice-header">
        <h2>Orders</h2>
        <div className="invoice-filter">
        <label htmlFor="year">Orders placed in:</label>
        <select 
            id="year" 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
        >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
        </select>
        </div>
    </div>
        
    {message && <p className="error-message">{message}</p>}
        
    <div className="invoice-list">
       {orders.length > 0 ? (
           orders.map((order) => (
            <OrderHistoryCard
             key={order.orderID}
             order={order}
            />
           ))
       ) : (
           <p className="no-orders">No orders found</p>
       )}
    </div>
    </div>

    );
}
export default OrderHistory;