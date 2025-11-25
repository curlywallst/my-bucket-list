import React, { useState, useContext, useEffect } from 'react'
import { MyContext } from "../context/AppContext";
import { useFormik } from "formik";
import { useParams } from 'react-router-dom';
import BucketForm from './BucketForm';
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const ItemForm = ({bucket}) => {
    const { id } = useParams()
    const {addItem, buckets, setBuckets, loggedIn, bucketError, bucketFormFlag, setBucketFormFlag} = useContext(MyContext)
    // const [bucketFormFlag, setBucketFormFlag] = useState(false)
    const [itemInputFlag, setItemInputFlag] = useState(true)
    const navigate = useNavigate();

    useEffect(()=> {
        if (!loggedIn){
            console.log('not logged in')
            navigate('/login')
        }
        if (!id) {
            fetch("/buckets")
            .then(r => r.json())
            .then(data => {
                console.log(data)
                setBuckets(data)
            })
        }
    }, [])

    const formSchema = yup.object().shape({
        title: yup.string().required("Must enter a title").max(50),
        content: yup.string().required("Must Content").max(250),
    });

    const togglebBucketFormFlag = () => {
        setBucketFormFlag(true)
        // setItemInputFlag(false)
    }

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            bucket_id: id ? id : null,
        },
        validationSchema: formSchema,
        onSubmit: (value) => {
            addItem({...value, bucket_id: parseInt(value.bucket_id)})
            setBucketFormFlag(false)
        },
    });

    const bucketOptions = buckets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)

    return (
        <div>
                <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
                    {!id ? 
                        <div>
                            <br/>
                            <h4>Add New Item to Any Bucket in All Available Buckets</h4>
                            <label htmlFor="bucket">Bucket</label>
                            <br/>
                            <select name="bucket_id" 
                                onChange={formik.handleChange} defaultValue={"placeholder"} required>
                                <option value={formik.value}>Choose Bucket</option>
                                {bucketOptions}
                            </select>
                            <hr/>
                        </div>
                        : 
                        <h4>Add New Item to {bucket.name} Bucket</h4>
                    }
                    <br/>
                    {itemInputFlag ?
                    <div>
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
                        <button type="submit">Submit</button>
                    </div>
                    : null
                    }
                    </form>
                    {!id ?
                            !bucketFormFlag ? 

                                    <div>
                                        <hr/>
                                        <h4>Don't see the bucket you want?</h4>
                                        <p>You can add it here so it will appear in the dropdown</p>
                                        <button onClick={togglebBucketFormFlag}>Add Bucket</button> 
                                    </div>
                                    : 
                                    <div>
                                        <h4>New Bucket</h4>
                                        <BucketForm />
                                        <p style={{ color: "red" }}> {bucketError}</p>
                                    </div>                           
                        : null
                    }


 
        </div>
    );
};

export default ItemForm