import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MyContext } from "../context/AppContext";

function Item(){
    const [item, setItem] = useState({
        title: '',
        content: ''
    })
    
    const {user, loggedIn, userBuckets} = useContext(MyContext);
    const {bucket_id, id} = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedIn){
          const selectedBucket = userBuckets.find(b => b.id === parseInt(bucket_id))
          if (selectedBucket){
              const selectedItem = selectedBucket.items.find(i => i.id === parseInt(id))
              setItem(selectedItem)
          }
        }
      }, [loggedIn, bucket_id, id, userBuckets])

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