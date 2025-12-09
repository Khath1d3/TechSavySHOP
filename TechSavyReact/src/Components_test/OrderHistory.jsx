import React,{useState, useEffect} from "react";
import "../componentStyle/invoicestyle.css";
import OrderHistoryCard from "./OrderHistoryCard";

function OrderHistory() {
    const [Order, SetOrder] = useState([]);
    useEffect(() => {

        const dummyOrders = [
            {ordernumber: 1, DeliveryDate: "2024-01-01", orderimage: "https://via.placeholder.com/150", SignedBy: "John Doe"},
            {ordernumber: 2, DeliveryDate: "2024-01-02", orderimage: "https://via.placeholder.com/150", SignedBy: "Jane Smith"},
            {ordernumber: 3, DeliveryDate: "2024-01-03", orderimage: "https://via.placeholder.com/150", SignedBy: "Alice Johnson"},
            {ordernumber: 4, DeliveryDate: "2024-01-04", orderimage: "https://via.placeholder.com/150", SignedBy: "Bob Brown"},
            {ordernumber: 5, DeliveryDate: "2024-01-05", orderimage: "https://via.placeholder.com/150", SignedBy: "Charlie Davis"},
        ];
        SetOrder(dummyOrders);
    }
    , []);

    return (
    <div className="invoice-section">
    <div className="invoice-header">
        <h2>Orders</h2>
        <div className="invoice-filter">
        <label htmlFor="year">Orders placed in:</label>
        <select id="year">
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
        </select>
        </div>
    </div>
        
    <div className="invoice-list">
       {dummyOrders.map((Order) => (
        <OrderHistoryCard
         key={Order.ordernumber}
         DeliveryDate={Order.DeliveryDate}
         SignedBy={Order.SignedBy} 
         orderimage={Order.orderimage} />
       ))}
    </div>
    </div>

    );
}
export default OrderHistory;