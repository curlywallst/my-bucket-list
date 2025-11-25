import React, { useState, useContext }  from 'react'
import { MyContext } from "../context/AppContext";
import {useNavigate} from "react-router-dom"

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const {signup} = useContext(MyContext)
  const [error, setError] = useState("")
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        password_confirmation: passwordConfirmation,
      }),
    })
    .then(r =>  r.json())
    .then(data => {
        if (!data.error) {
            signup(data)
            navigate('/')
        } else {
          setUsername("")
          setPassword("")
          setError(data.error)
        }})
    
  }

  return (
    <div>
      <h3>Signup</h3>
      <form onSubmit={handleSubmit}>
        <br/>
        <label htmlFor="username">Username</label>
        <br/>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br/>
        <br/>
        <label htmlFor="password">Password</label>
        <br/>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <br/>
        <br/>
        <label htmlFor="password">Password Confirmation</label>
        <br/>
        <input
          type="password"
          id="password_confirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          autoComplete="current-password"
        />
        <br/>
        <br/>
        <button type="submit">Sign Up</button>
      </form>
      <div>{error}</div>
    </div>
  );
}

export default SignUp;