import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import SignupForm from '../components/SignupForm';
import Login from '../components/Login';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/about">About</Link>      

      <h1 className='route'>7.Sign In</h1>
      <SignupForm />

      <h1 className='route'>8.Log Up</h1>
      <Login />
    </div>
  );
}

export default HomePage;