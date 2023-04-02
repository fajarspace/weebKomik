import React from 'react'
import { Link } from "react-router-dom";
import Search from "./Search";

const Navbar = () => {
  return (
    <>
      <nav>
        <ul>
          <li><Link to={'/'}>Weeb Komik</Link></li>
        </ul>
        <ul>
          <li><Link to={'/popular'} >Popular</Link></li>
          <li>
            <Search />
          </li>
        </ul>
      </nav>
      <br /><br /><br />
    </>
  )
}

export default Navbar