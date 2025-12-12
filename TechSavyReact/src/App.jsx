import './App.css'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './Pages/LandingPage/LandingPage.jsx'
import Product from './Pages/ProductPage/ProductPage.jsx'
import CartPage from './Pages/CartPage/CartPage.jsx'
import ViewItemPage from './Pages/ViewItemPage/ViewItemPage.jsx'
import ReviewOrderPage from './Pages/ReviewOrderPage/ReviewOrderPage.jsx'
import AboutUs from './Pages/AboutUsPage/AboutUs.jsx'
import CustomerCare from './Pages/CustomerCarePage/CustomerCare.jsx'
import Scrolltotop from './Components_test/scrolltotop.jsx'
import Account from './Pages/Account/Account.jsx'
import React, { useEffect, useState } from "react";
import Loader from "./Components_test/loader.jsx";
import Header from './Components_test/Header.jsx'
import TokenWatcher from "./Components_test/TokenWatcher.jsx";
import ProtectedRoute from "./assets/ProtectedRoute.jsx";


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
            <Route path='/cart' element={<ProtectedRoute><CartPage/></ProtectedRoute>} />
            <Route path='/viewitem/:id' element={<ViewItemPage/>} />
            <Route path='/review-order' element={<ProtectedRoute><ReviewOrderPage/></ProtectedRoute>} />
            <Route path='/account/*' element={<ProtectedRoute><Account/></ProtectedRoute>} />
            <Route path='/about-us' element={<AboutUs/>} />
            <Route path='/customer-care' element={<CustomerCare/>} />
          </Routes>
       </Router>
  </>)
}

export default App
