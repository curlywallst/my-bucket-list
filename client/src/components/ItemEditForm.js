import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from "./User";
import { useParams } from 'react-router-dom';

const ItemEditForm = ({item, setFormFlag}) => {
  const [title, setTitle] = useState(item.title)
  const [content, setContent] = useState(item.content)
  const {loggedIn, editItem} = useContext(UserContext);

  const handleSubmit = (e) => {
      e.preventDefault()
      const updatedItem = 
          {
              id: item.id,
              title: title,
              content: content,
              bucket_id: item.bucket_id
          }

      console.log(updatedItem)
      editItem(updatedItem)
      setTitle("")
      setContent("")
      setFormFlag(false)
  }

  return (
      <form onSubmit={handleSubmit}>
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
          />
          <br/>
          <input type="submit"/>
      </form>
  )
}



export default ItemEditForm