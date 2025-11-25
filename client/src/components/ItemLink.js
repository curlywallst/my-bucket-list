import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { MyContext } from "../context/AppContext";
import ItemEditForm from './ItemEditForm';


const ItemLink = ({item}) => {
    const [formFlag, setFormFlag] = useState(false)
    const {deleteItem, editItem} = useContext(MyContext);


    return (
        <div>
            <Link to={`/buckets/${item.bucket_id}/items/${item.id}`} key={item.id}>
                {item.title}
            </Link><span>
                - <button onClick={() => deleteItem(item)} >X</button>   
                <button onClick={() => setFormFlag((formFlag) => !formFlag)} >Edit</button>
            </span>
            {formFlag ? <ItemEditForm item={item} editItem={editItem} setFormFlag={setFormFlag}/> : null}
        </div>
    )
}


export default ItemLink