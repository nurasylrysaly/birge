import React, { useState } from 'react';

function SignupForm({onSignup}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleFormSubmit(event) {
    event.preventDefault();

    const requestBody = {
      name: name,
      email: email,
      password: password,
    };
  
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          alert('Registration Successful!');
        } else {
          alert('Registration failed. Please try again.');
        }
      })
      .catch(error => {
        console.error(error);
        alert('Registration failed. Please try again.');
      });
  }

  return (
    <div className='container' id='signup'>
    <form onSubmit={handleFormSubmit}>

      <h1>REGISTER</h1>
      <label><b>Name</b></label>
      <input type="text"  placeholder="Enter Name" name="name" id="name" value={name} onChange={event => setName(event.target.value)} />

      <label><b>Email</b></label>
      <input type="email" placeholder="Enter Email" name="email" id="email" value={email} onChange={event => setEmail(event.target.value)} />

      <label><b>Password</b></label>
      <input type="password"   placeholder="Enter Password" name="psw" id="psw" value={password} onChange={event => setPassword(event.target.value)} />

      <button type="submit" class="registerbtn">Sign up</button>
    </form>
    </div>
  );
}

export default SignupForm;