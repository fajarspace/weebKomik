import React from 'react'
import { Link } from "react-router-dom";
// import Search from "./Search";
import Logo from "../static/img/logo.png";

const Navbar = () => {
  return (
    <>
      <nav style={{ borderBottom: "1px solid lightgrey", marginBottom: "1em" }}>
        <ul>
          <li><a href={'/'}>&emsp; <img width={'50px'} src={Logo} alt="logo" /> <b> W</b>eeb<b>K</b>omik </a></li>
        </ul>
      </nav>
      {/* <Search /> */}
    </>
  )
}

export default Navbar