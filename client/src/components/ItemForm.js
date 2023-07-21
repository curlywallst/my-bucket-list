import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from "./User";
import { useParams } from 'react-router-dom';

const ItemForm = ({bucket, setFormFlag}) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [selectedBucket, setSelectedBucket] = useState('Select Bucket')
    const {buckets, loggedIn, addItem} = useContext(UserContext);
    const {id} = useParams()

    const handleSubmit = (e) => {
        e.preventDefault()
        const newItem = id ? 
            {
                title: title,
                content: content,
                bucket_id: id
            }
            :
            {
                title: title,
                content: content,
                bucket_id: selectedBucket
            }
        console.log(newItem)
        addItem(newItem)
        setTitle("")
        setContent("")
        setFormFlag(false)
    }

    const handleChange = (e) => {
        setSelectedBucket(e.target.value)
    }

    const bucketOptions = buckets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)

    return (
        <form onSubmit={handleSubmit}>
            {!id ? 
                <div>
                    <br/>
                    <h4>Add New Item to Any Bucket in All Available Buckets</h4>
                    <label>Bucket: </label>
                    <select name="bucket" onChange={handleChange} defaultValue={"placeholder"} required>
                        <option value="placeholder">Choose Bucket</option>
                        {bucketOptions}
                    </select>
                </div>
                : 
                <h4>Add New Item to {bucket.name} Bucket</h4>
            }
            <label>Title: </label>
            <input 
                type="text"
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            /> <br/>
            <label>Content: </label>
            <textarea
                id="content" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
            /> <br/>

            <br/>
            <input type="submit"/>
        </form>
    )
}

export default ItemForm