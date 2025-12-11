import React from 'react'
// import { useState } from 'react'
import Header from '../../Components/Header'
import MainSection from '../../Components/mainsection.jsx'
import Footer from '../../Components/Footer'
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