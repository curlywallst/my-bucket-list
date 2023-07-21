import React, { useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from "./User";
import ItemEditForm from './ItemEditForm';


const ItemLink = ({item}) => {
    const [formFlag, setFormFlag] = useState(false)
    const {user, deleteItem} = useContext(UserContext);
    const {id} = useParams();


    return (
        <div>
            <Link to={`/buckets/${item.bucket_id}/items/${item.id}`} key={item.id}>
                {item.title}
            </Link><span>
                - <button onClick={() => deleteItem(item)} >X</button>   
                <button onClick={() => setFormFlag((formFlag) => !formFlag)} >Edit</button>
            </span>
            {formFlag ? <ItemEditForm item={item} setFormFlag={setFormFlag}/> : null}
        </div>
    )
}


export default ItemLink