import React from 'react'
import { Link } from "react-router-dom";
// import Search from "./Search";

const Navbar = () => {
  return (
    <>
      <nav>
        <ul>
          <li><a href={'/'}>Weeb Komik</a></li>
        </ul>
        <ul>
          <li><Link to={'/popular'} >Popular</Link></li>
          <li>
          </li>
        </ul>
      </nav>
      {/* <Search /> */}
    </>
  )
}

export default Navbar