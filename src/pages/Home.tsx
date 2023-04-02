import React from 'react'
// import { useNavigate } from 'react-router-dom'
import Rekomen from "./Rekomen";
import Popular from "./Popular";
import Search from "../components/Search";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";

const Home = () => {
  // const navigate = useNavigate()
  return (
    <>
      {/* <Navbar /> */}
      <div className='container'>
        <Search />
        <Popular />
        <Rekomen />
        {/* <Footer /> */}
      </div>
    </>
  )
}

export default Home