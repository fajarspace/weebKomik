import React from 'react'
import { useNavigate } from 'react-router-dom'
import Rekomen from "./Rekomen";

const Home = () => {
  const navigate = useNavigate()
  return (
    <>
      <h1>wellcome</h1>
      <Rekomen />
    </>
  )
}

export default Home