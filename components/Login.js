import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  

  const handleSubmit = (event) => {
  event.preventDefault();
  const data = { email: email, password: password };
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setSuccessMessage("Log in successfully");
      window.location.reload(); // reload the page
    })
    .catch((error) => {
      console.error(error);
      setErrorMessage("Invalid email or password");
    });
};

  return (

    <form onSubmit={handleSubmit}>
      <div class="container" id="login">
      <h1>LOG IN</h1>
        <label><b>Email</b></label>
        <input type="email" placeholder="Enter Email" name="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        
        <br />
        <label for="psw"><b>Password</b></label>
          <input
            type="password"  placeholder="Enter Password" name="psw" id="psw"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        <br />
        <button  type="submit" class="registerbtn">Login</button>
        {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
      </div>
              

    </form>
  );
}

export default Login;
