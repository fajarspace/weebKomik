import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav>
        <ul>
          <li><strong>Brand</strong></li>
        </ul>
        <ul>
          <li><Link to={'/popular'} >Popular</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar