import React from 'react'
// import { useNavigate } from 'react-router-dom'
import Rekomen from "./Rekomen";
import Popular from "./Popular";
import Search from "../components/Search";
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
      </div>
    </>
  )
}

export default Home