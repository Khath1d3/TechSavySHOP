import Footer from "../../Components_test/Footer";
import Header from "../../Components_test/Header";
import DeviceList from "../../Components_test/DeviceList";
import React, { useEffect } from "react";
import { Helmet } from 'react-helmet-async';

function Product() {

  return (
   <>
   <Helmet>
     <title>Shop Tech Products - Laptops, Smartphones & More | TechSavy</title>
     <meta name="description" content="Browse our wide selection of laptops, smartphones, tablets, and tech accessories. Find the perfect device at the best prices in South Africa." />
     <meta name="keywords" content="laptops, smartphones, tablets, tech products, electronics store, buy tech online South Africa" />
   </Helmet>
   <Header/>
    <DeviceList/>
   <Footer/>
   </>
  );
}
export default Product;