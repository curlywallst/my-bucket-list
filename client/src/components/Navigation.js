import React, { useContext } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { UserContext } from "./User";

const link = {
    width: '100px',
    padding: '12px',
    margin: '0 6px 6px',
    textDecoration: 'none',
    color: 'white',
    background: "blue"
}

const Navigation = () => {
    const {user, logout, loggedIn} = useContext(UserContext);
    const navigate = useNavigate()

    const logoutUser = () => {
      fetch('/logout', {
        method: 'DELETE'
      })
      logout()
      navigate('/')
    }

    if (loggedIn){
        return (
        <div>
            <h1>Hello {user.username}</h1>
            <br/>

            <button onClick={logoutUser} style={link} >Logout</button>
                

            <NavLink
                to="/"
                style={link}
            >Home</NavLink>

            <NavLink
                to="/buckets"
                style={link}
            >All Buckets</NavLink>
        </div>
        )
    } else {
        return (
            <div>
                <br/>
                <NavLink 
                to="/signup"
                style={link}
                >Signup</NavLink>

                <NavLink 
                to="/login"
                style={link}
                >Login</NavLink>
            </div>
        )
    }
}

export default Navigation