import './App.css'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './Pages/LandingPage/LandingPage.jsx'
import Product from './Pages/ProductPage/ProductPage.jsx'
import CartPage from './Pages/CartPage/CartPage.jsx'
import ViewItemPage from './Pages/ViewItemPage/ViewItemPage.jsx'
import ReviewOrderPage from './Pages/ReviewOrderPage/ReviewOrderPage.jsx'
import AboutUs from './Pages/AboutUsPage/AboutUs.jsx'
import CustomerCare from './Pages/CustomerCarePage/CustomerCare.jsx'
import Scrolltotop from './Components/scrolltotop.js'
import Account from './Pages/Account/Account.jsx'
import React, { useEffect, useState } from "react";
import Loader from "./Components/loader.js";
import Header from './Components/Header.jsx'
import Header2 from './Components/Header2.jsx'
import TokenWatcher from "./Components/TokenWatcher.jsx";


function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until everything (including images) is loaded
    const handleLoad = () => {
      setLoading(false);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);
  return(<>
      {loading && <Loader />}
      
       <Router>
          <TokenWatcher/>
          <Scrolltotop/>
          <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/product' element={<Product/>} />
            <Route path='/cart' element={<CartPage/>} />
            <Route path='/viewitem/:id' element={<ViewItemPage/>} />
            <Route path='/review-order' element={<ReviewOrderPage/>} />
            <Route path='/account/*' element={<Account/>} />
            <Route path='/about-us' element={<AboutUs/>} />
            <Route path='/customer-care' element={<CustomerCare/>} />
          </Routes>
       </Router>
  </>)
}

export default App
