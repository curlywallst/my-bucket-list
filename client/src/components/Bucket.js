import React, { useContext, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from "./User";
import ItemLink from './ItemLink';
import ItemForm from './ItemForm';
import { useNavigate } from 'react-router-dom';

function Bucket() {
  const [bucket, setBucket] = useState({
    items: []
  })
  const [formFlag, setFormFlag] = useState(false)
  const {user, loggedIn, deleteItem} = useContext(UserContext);
  const {id} = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    if (loggedIn){
      const selectedBucket = user.buckets.find(b => b.id == id)
      if (selectedBucket){
        setBucket(selectedBucket)
      } else {
        navigate('/buckets')
      }
    }
  }, [loggedIn, user, bucket])

  const handleClick = () => {
    setFormFlag(formFlag => !formFlag)
  }

  const handleDelete = (item) => {
    deleteItem(item)
    const updatedBucket = {...bucket, items: bucket.items.filter(i => i.id != item.id)}
    if (updatedBucket.items.length > 0) {
      setBucket(updatedBucket)
    } else {
      navigate('/')
    }
  }

  if (!loggedIn){
    return(<div>Please login or signup</div>)
  }

  const bucketItems = bucket.items.map(item => <ItemLink item={item} key={item.id} />)

  return (
    <>
      <h3>{bucket.name}</h3>
      {bucketItems}
      <br/>
      {formFlag ? <ItemForm setFormFlag={setFormFlag} bucket={bucket}/> : <button onClick={handleClick} >Add Item</button>}
    </>
  )
}

export default Bucket