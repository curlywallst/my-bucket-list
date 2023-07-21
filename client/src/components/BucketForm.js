import React, { useState, useContext } from 'react'
import { UserContext } from "./User";
import { useFormik } from "formik";
import * as yup from "yup";

const BucketForm = ({ setFormFlag }) => {
  const {addBucket} = useContext(UserContext)
  const [refreshPage, setRefreshPage] = useState(false);
  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted

  const formSchema = yup.object().shape({
    name: yup.string().required("Must enter a name").max(50)
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: formSchema,
    onSubmit: (value) => {
        addBucket(value)
        setFormFlag(false)
        setRefreshPage(refreshPage => !refreshPage)
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <label htmlFor="name">Name</label>
        <br />
        <input
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <p style={{ color: "red" }}> {formik.errors.name}</p>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BucketForm