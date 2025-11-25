import React, { useContext, useState, useEffect } from 'react'
import { MyContext } from "../context/AppContext";
import BucketForm from './BucketForm';
import { useNavigate } from "react-router-dom";

function Buckets() {
  const [displayBuckets, setDisplayBuckets] = useState([])

  const {loggedIn, buckets, bucketError, bucketFormFlag, setBucketFormFlag} = useContext(MyContext);
  const navigate = useNavigate();
  
  useEffect(()=> {
    if (loggedIn === false){
        console.log('not logged in')
        navigate('/login')
    }
    if (loggedIn === true){
      fetch("/buckets")
      .then(r => r.json())
      .then(data => {
          const bucketList = data.map(b => <h4 key={b.id} >{b.name}</h4>)    
          setDisplayBuckets(bucketList)
      })
    } 
  }, [buckets, navigate, loggedIn])

  const handleClick = () => {
    setBucketFormFlag(true)
  }
  
  return (
    <div>
      {displayBuckets}
      <br/>
      <br/>
      {bucketFormFlag ? <BucketForm /> : <button onClick={handleClick} >Add Bucket</button>}
      <p style={{ color: "red" }}> {bucketError}</p>
    </div>
  )
}

export default Buckets
