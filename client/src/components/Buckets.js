import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from "./User";
import BucketLink from './BucketLink';
import BucketForm from './BucketForm';

function Buckets() {
  const [displayBuckets, setDisplayBuckets] = useState([])
  const [formFlag, setFormFlag] = useState(false)
  const {user, loggedIn, buckets} = useContext(UserContext);


  useEffect(()=> {
    const bucketList = buckets.map(b => <h4 key={b.id} >{b.name}</h4>)    
    setDisplayBuckets(bucketList)
  }, [loggedIn, buckets, user])

  const handleClick = () => {
    setFormFlag(formFlag => !formFlag)
  }

  if (!loggedIn){
    return(<div>Please login or signup</div>)
  }
  return (
    <div>
      {displayBuckets}
      <br/>
      <br/>
      
      {formFlag ? <BucketForm setFormFlag={setFormFlag} /> : <button onClick={handleClick} >Add Bucket</button>}
    </div>
  )
}

export default Buckets
