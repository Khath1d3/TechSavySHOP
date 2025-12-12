import React,{useState, useEffect} from "react";
import "../componentStyle/invoicestyle.css";
import InvoiceCard from "./invoicecard";
import { getData } from "./ApiService";
import { useLoader } from "../assets/LoaderContext";

function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    
    useEffect(() => {
        const fetchInvoices = async () => {
            showLoader();
            try {
                const response = await getData("GetInvoice");
                console.log("Fetched invoices:", response);
                if (response.success) {
                    setInvoices(response.data);
                }
            } catch (error) {
                console.error("Error fetching invoices:", error);
            } finally {
                hideLoader();
            }
        };
        
        fetchInvoices();
    }, []);

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
         key={invoice.orderID}
         invoice={invoice} />
       ))}
    </div>
    </div>

    );
}
export default Invoices;