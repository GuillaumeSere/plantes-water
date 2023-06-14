import React from 'react'
import logo from '../images/logo.png'

const Header = () => {
  return (
    <div className='header'>
      <img src={logo} alt="logo" />
      <h1 className='title'>Plantes-Water</h1>
    </div>
  )
}

export default Header
