import React from 'react'
// import { useNavigate } from 'react-router-dom'
import Rekomen from "./Rekomen";
import Search from "../components/Search";
// import Navbar from "../components/Navbar";

const Home = () => {
  // const navigate = useNavigate()
  return (
    <>
      {/* <Navbar /> */}
      <Search />
      <Rekomen />
    </>
  )
}

export default Home