import React from 'react'
import { Link } from "react-router-dom";
// import Search from "./Search";

const Navbar = () => {
  return (
    <>
      <nav style={{ borderBottom: "1px solid lightgrey" }}>
        <ul>
          <li><a href={'/'}>&emsp;Weeb Komik</a></li>
        </ul>
      </nav>
      {/* <Search /> */}
    </>
  )
}

export default Navbar