

import React, { useContext } from 'react'
import { MyContext } from "../context/AppContext";
import { useFormik } from "formik";
import * as yup from "yup";

const BucketForm = () => {
  const {addBucket} = useContext(MyContext)


  const formSchema = yup.object().shape({
    name: yup.string().required("Must enter a name").max(50)
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: formSchema,
    onSubmit: (value, { resetForm }) => {
        resetForm()
        addBucket(value)    
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