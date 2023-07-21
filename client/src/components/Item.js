import React, { useContext, useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { UserContext } from "./User";
import ItemLink from './ItemLink';



const Item = () => {
    const [item, setItem] = useState({
        title: '',
        content: ''
    })
    
    const {user, loggedIn} = useContext(UserContext);
    const {bucket_id, id} = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedIn){
          const selectedBucket = user.buckets.find(b => b.id == bucket_id)
          const selectedItem = selectedBucket.items.find(i => i.id == id)
          setItem(selectedItem)
        }
      }, [loggedIn])

    const handleClick = () => {
        navigate(-1)
    }
  
    return (
        <div>
            <h3>{item.title}</h3>
            <h5>{item.content}</h5>

            <br/>
            <button onClick={handleClick} >Back</button>
        </div>
    )
}

export default Item