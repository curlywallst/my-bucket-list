
import React, { useContext, useState, useEffect }  from 'react'
import { UserContext } from "./User";
import BucketLink from './BucketLink';
import ItemForm from './ItemForm';


const Home = () => {
    const [displayBuckets, setDisplayBuckets] = useState([])
    const [formFlag, setFormFlag] = useState(false)

    const {user, loggedIn} = useContext(UserContext);

    useEffect(()=> {
        const bucketList = user.buckets.map(b => <div key={b.id} ><BucketLink bucket={b} /></div>)
        setDisplayBuckets(bucketList)
      }, [loggedIn, user])

    const handleClick = () => {
    setFormFlag(formFlag => !formFlag)
    }

    if (!loggedIn) {
        return (<h3>Please Login or Signup</h3>)
    } else {
        return (
            <div>
                <h1>My Buckets</h1> 
                <hr/>
                
                {displayBuckets}
                <br/>
                {formFlag ? <ItemForm setFormFlag={setFormFlag} /> : <button onClick={handleClick} >Add Item</button>}
            </div>
        )
    }
}

export default Home