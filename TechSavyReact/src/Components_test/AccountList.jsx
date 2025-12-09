import React from "react";
import { Link } from "react-router-dom";
import ProtectedLink from "../assets/ProtectedLink";

function AccountList({ closeMobileMenu }){
    const handleClick = () => {
        if (closeMobileMenu) {
            closeMobileMenu();
        }
    };

    return (
           <>            
                <ProtectedLink to="/account?open=personalDetails" onClick={handleClick}>
                    <li>Personal Details</li>
                </ProtectedLink>
                <ProtectedLink to="/account?open=orders" onClick={handleClick}>
                    <li>Track Order</li>
                </ProtectedLink>
                <ProtectedLink to="/account?open=invoices" onClick={handleClick}>
                    <li>Invoices</li>
                </ProtectedLink>
                <ProtectedLink to="/account?open=securitySettings" onClick={handleClick}>
                    <li>Security Settings</li>
                </ProtectedLink>
           </>
    );
}
export default AccountList;