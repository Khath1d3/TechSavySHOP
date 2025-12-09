import React,{useState, useEffect} from "react";
import "../componentStyle/invoicestyle.css";
import InvoiceCard from "./invoicecard";

function Invoices() {
    const [invoices, setInvoices] = useState([]);
    useEffect(() => {

        const dummyInvoices = [
            {ordernumber: 1, orderdate: "2024-01-01", orderimage: "https://picsum.photos/200?random=1"},
            {ordernumber: 2, orderdate: "2024-01-02", orderimage: "https://picsum.photos/200?random=2"},
            {ordernumber: 3, orderdate: "2024-01-03", orderimage: "https://picsum.photos/200?random=3"},
            {ordernumber: 4, orderdate: "2024-01-04", orderimage: "https://picsum.photos/200?random=4"},
            {ordernumber: 5, orderdate: "2024-01-05", orderimage: "https://picsum.photos/200?random=5"},
        ];
        setInvoices(dummyInvoices);
    }
    , []);

    return (
    <div className="invoice-section">
    <div className="invoice-header">
        <h2>Invoices</h2>
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
       {invoices.map((invoice) => (
        <InvoiceCard
         key={invoice.ordernumber}
         ordernumber={invoice.ordernumber}
         orderdate={invoice.orderdate} 
         orderimage={invoice.orderimage} />
       ))}
    </div>
    </div>

    );
}
export default Invoices;