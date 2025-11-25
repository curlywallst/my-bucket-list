import React, { useContext } from 'react'
import { MyContext } from "../context/AppContext";
import { useFormik } from "formik";
import * as yup from "yup";

const ItemEditForm = ({item, setFormFlag}) => {

    const {editItem} = useContext(MyContext)

    const formSchema = yup.object().shape({
        title: yup.string().required("Must enter a title").max(50),
        content: yup.string().required("Must Content").max(250),
    });

    const formik = useFormik({
        initialValues: {
            id: item.id,
            title: item.title,
            content: item.content,
            bucket_id: item.bucket_id,
        },
        validationSchema: formSchema,
        onSubmit: (value) => {
            editItem(value)
            setFormFlag(false)
        },
    });

    return (
        <div>
        <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
            <label htmlFor="title">Title</label>
            <br />
            <input
            id="title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            />
            <p style={{ color: "red" }}> {formik.errors.title}</p>

            <label htmlFor="content">Content</label>
            <br />
            <input
            id="content"
            name="content"
            onChange={formik.handleChange}
            value={formik.values.content}
            />
            <p style={{ color: "red" }}> {formik.errors.content}</p>

            <button type="submit">Edit Item</button>
        </form>
        </div>
    );
    };

export default ItemEditForm