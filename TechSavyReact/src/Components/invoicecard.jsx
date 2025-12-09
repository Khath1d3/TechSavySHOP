import React from "react";

function InvoiceCard({ordernumber, orderdate, orderimage}) {

    return(
        <>
            <div className="invoice-card">
        <div className="invoice-details">
            <p className="order-number">Order #{ordernumber} , placed on  {new Date(orderdate).toLocaleDateString('en-GB')}</p>
            <button className="view-invoice-btn">View Invoices</button>
        </div>
        <div className="invoice-image">
            <img src={orderimage} alt="Invoice item" />
        </div>
        </div>
        </>
    );
}
export default InvoiceCard;