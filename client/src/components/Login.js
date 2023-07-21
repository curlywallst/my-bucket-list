import React, { useState, useContext }  from 'react'
import { UserContext } from "./User";
import {useNavigate} from "react-router-dom"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)
  const navigate = useNavigate();
  const {login} = useContext(UserContext);

  const handleSubmit = (e) => {
      e.preventDefault()
      fetch("/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              username: username,
              password: password
          }) 
      })
      .then(r => r.json())
      .then(user => {
          if (!user.errors && !user.message) {
              login(user)
              navigate('/')
          } 
          else if (user.errors) {
              setError(user.errors)
          } else {
            setError(user.message)
          }
        })
      }
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error ? <div>{error}</div> : null}
    </div>
  );
}

export default Login;

// import React, { useState, useContext } from 'react'
// import { UserContext } from "./User";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import {useNavigate} from "react-router-dom"

// const Login = () => {
//   const {login} = useContext(UserContext)
//   const navigate = useNavigate();
//   const [refreshPage, setRefreshPage] = useState(false);
//   // Pass the useFormik() hook initial form values and a submit function that will
//   // be called when the form is submitted

//   const formSchema = yup.object().shape({
//     name: yup.string().required("Must enter a name"),
//     password: yup.string().required("Must enter a password")
//   });

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       password: ""
//     },
//     validationSchema: formSchema,
//     onSubmit: (value) => {
//         login(value)
//         navigate('/')
//         setRefreshPage(refreshPage => !refreshPage)
//     },
//   });

//   return (
//     <div>
//       <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
//         <label htmlFor="name">Name</label>
//         <br />
//         <input
//           id="name"
//           name="name"
//           onChange={formik.handleChange}
//           value={formik.values.name}
//         />
//         <p style={{ color: "red" }}> {formik.errors.name}</p>
//         <label htmlFor="password">Password</label>
//         <br />
//         <input
//           id="password"
//           name="password"
//           onChange={formik.handleChange}
//           value={formik.values.password}
//         />
//         <p style={{ color: "red" }}> {formik.errors.password}</p>

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default Login