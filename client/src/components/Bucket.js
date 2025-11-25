import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MyContext } from "../context/AppContext";
import ItemLink from './ItemLink';
import ItemForm from './ItemForm';
import { useNavigate } from 'react-router-dom';

function Bucket() {
  const [bucket, setBucket] = useState({
    items: []
  })
  const [formFlag, setFormFlag] = useState(false)
  const {user, loggedIn, userBuckets} = useContext(MyContext);
  const {id} = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    if (loggedIn){
      const selectedBucket = userBuckets.find(b => b.id === parseInt(id))
      if (selectedBucket){
        setBucket(selectedBucket)
      } else {
        navigate('/')
      }
    }
  }, [loggedIn, user, bucket, id, navigate, userBuckets])

  const handleClick = () => {
    setFormFlag(formFlag => !formFlag)
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