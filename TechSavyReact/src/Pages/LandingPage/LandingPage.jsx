import React from 'react'
// import { useState } from 'react'
import Header from '../../Components_test/Header.jsx'
import MainSection from '../../Components_test/mainsection.jsx'
import Footer from '../../Components_test/Footer.jsx'
import  "./Landingpagestyle.css"


function LandingPage() {
  return (
   <>
    <Header isLandingPage={true} />
    <MainSection/>
    <Footer/>
   </>
  );
}
export default LandingPage;