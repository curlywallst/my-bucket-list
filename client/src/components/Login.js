

import { useState, useContext } from 'react'
import { MyContext } from "../context/AppContext";
import { useFormik } from "formik";
import * as yup from "yup";
import {useNavigate} from "react-router-dom"

const Login = () => {
  const {login} = useContext(MyContext)
  const navigate = useNavigate();
  const [error, setError] = useState("")

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username"),
    password: yup.string().required("Must enter a password")
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: formSchema,
    onSubmit: (user, {resetForm}) => {
        fetch("/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              username: user.username,
              password: user.password
          }) 
        })
      .then(r => r.json())
      .then(u => {
        if (!u.error){
          login(u)
          navigate('/')
        } else {
          resetForm({ values: '' })
          setError(u.error)
        }
      })
    }
  });

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        <p style={{ color: "red" }}> {formik.errors.username}</p>
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          type="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <p style={{ color: "red" }}> {formik.errors.password}</p>

        <button type="submit">Login</button>
      </form>
      <div>{error}</div>
    </div>
  );
};

export default Login