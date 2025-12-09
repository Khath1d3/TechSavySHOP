import React,{useEffect,useState} from "react";
import { useLocation,Link, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Header2 from "../../Components/Header2";
import Footer from "../../Components/Footer";
import './AccountStyle.css'
import Invoices from "../../Components/invoices"
import Orders from "../../Components/orders"
import Reviews from "../../Components/reviews"
import PersonalDetails from "../../Components/personalDetails"
import AddressBook from "../../Components/addressBook"
import SecuritySettings from "../../Components/securitySettings"

function Account() {

    const subRoutesOrders = [
        {name: "Invoices",path:"invoice", component: <Invoices/>},
        {name: "Orders",path:"orders", component: <Orders/>},
        {name: "Reviews",path:"reviews", component: <Reviews/>}

    ];

    const subRoutesProfile = [
        {name: "Personal Details",path:"personalDetails", component: <PersonalDetails/>},
        {name: "Address Book",path:"addressBook", component: <AddressBook/>},
        {name: "Security Settings",path:"securitySettings", component: <SecuritySettings/>},
    ];

    const [currentComponent, setCurrentComponent] = useState("Invoices");
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
       
    const handlenavigation=(path)=>{
        const selectedRoute =[...subRoutesOrders,...subRoutesProfile].find(route=>route.path===path);
        if(selectedRoute){
            setCurrentComponent(selectedRoute.component);
            setIsMenuOpen(false); // Close menu after selection
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

  useEffect(() => {
    const params = new URLSearchParams(location.hash.split('?')[1]);
    const openTab = params.get('open');
    console.log(params.get('open'));
    // Find the route object from either orders or profile routes
    const foundOrderroute = subRoutesOrders.find(r => r.path === openTab);
    const foundProfroute = subRoutesProfile.find(r => r.path === openTab);
    const found = foundOrderroute || foundProfroute;

    if (found) {
      setCurrentComponent(found.component);
    } else {
      setCurrentComponent(subRoutesOrders[0].component); // Default to the first component if none found
    }

  }, []);
    
    return(
        <>
            <Header2/>

            {/* Floating Menu Button */}
            <button className="floating-menu-btn" onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
                <span>Account</span>
            </button>

           <main className="AccountContainer">
           <section className={`Left Section ${isMenuOpen ? 'menu-open' : ''}`}>
                <h1>Account</h1>
                <div className="subcont Orders">
                    <h2>Orders</h2>
                    <ul>
                        {subRoutesOrders.map((route) => (
                            <li 
                                key={route.path} 
                                onClick={() => handlenavigation(route.path)} 
                                className={currentComponent.type === route.component.type ? 'active' : ''}
                            >
                              {route.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="subcont Profile">
                    <h2>Profile</h2>
                    <ul>
                        {subRoutesProfile.map((route) => (
                            <li 
                                key={route.path} 
                                onClick={() => handlenavigation(route.path)} 
                                className={currentComponent.type === route.component.type ? 'active' : ''}
                            >
                                {route.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Overlay for mobile menu */}
            {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

            <section className="Right Section">
            {currentComponent}
            </section>
           </main>

            <Footer/> 
        </>
    )
}
export default Account;