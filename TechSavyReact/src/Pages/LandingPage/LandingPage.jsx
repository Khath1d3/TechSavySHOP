import React from 'react'
// import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '../../Components_test/Header.jsx'
import MainSection from '../../Components_test/mainsection.jsx'
import Footer from '../../Components_test/Footer.jsx'
import  "./Landingpagestyle.css"


function LandingPage() {
  return (
   <>
    <Helmet>
      <title>TechSavy - Buy Laptops, Smartphones & Electronics Online in South Africa</title>
      <meta name="description" content="Shop the latest tech products including laptops, smartphones, tablets, and accessories. Quality electronics at competitive prices with fast delivery across South Africa." />
      <meta name="keywords" content="tech shop South Africa, buy laptops online, smartphones, tablets, electronics, TechSavy" />
    </Helmet>
    <Header isLandingPage={true} />
    <MainSection/>
    <Footer/>
   </>
  );
}
export default LandingPage;