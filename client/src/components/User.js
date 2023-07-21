// src/context/user.js
import React, { useState, useEffect } from "react";

// Create context
const UserContext = React.createContext(); 

// create a provider component
function UserProvider({ children }) {
    const [buckets, setBuckets] = useState([])
    const [user, setUser] = useState({
        buckets: []
      });
    const [loggedIn, setLoggedIn] = useState(false) 
    

    useEffect(() => {
    // auto-login
      fetch("/check_session").then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            login(data)
          });
        }
      });
    }, []);

    const fetchBuckets = () => {
      fetch('/buckets')
      .then(r => r.json())
      .then(data => {
          console.log(data)
          setBuckets(data)
      })
    }

    const logout = () => {
      setUser({
        buckets: []
      })
      setLoggedIn(false)
    }

    const login = (u) => {
      fetchBuckets()
      setUser(u)
      setLoggedIn(true)
    }

    const signup = (u) => {
      login(u)
    }

    const addBucket = (bucket) => {
      fetch('/buckets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bucket)
      })
      .then(r => r.json())
      .then(data => {
        setBuckets([...buckets, data])
      })
    }

    const addItem = (newItem) => {
      fetch('/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })
      .then(r => r.json())
      .then(data => {
        let userBuckets = [...user.buckets]
        let bucket = userBuckets.find(b => b.id == newItem.bucket_id)
        if (!bucket){
          bucket = buckets.find(b => b.id == newItem.bucket_id)
          bucket = {...bucket, items: []}
          userBuckets = [...user.buckets, {...bucket, items: []}]
        } 

        const updatedBucket = {...bucket, items: [...bucket.items, data]}
        const updatedUserBuckets = userBuckets.map(b => b.id == bucket.id ? updatedBucket : b)
        const updatedUser = {
          ...user,
          buckets: updatedUserBuckets
        }
        setUser(updatedUser)
      })
    }

    const deleteItem = (item) => {
      fetch(`/items/${item.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
      })
      let userBuckets = [...user.buckets]
      let bucket = userBuckets.find(b => b.id == item.bucket_id)
      const updatedItems = bucket.items.filter(i => i.id != item.id)
      const updatedBucket = {...bucket, items: updatedItems}
      const updatedUserBuckets = userBuckets.map(b => b.id == bucket.id ? updatedBucket : b)
      const filteredBuckets = updatedUserBuckets.filter(b => b.items.length > 0)

      const updatedUser = {
        ...user,
        buckets: filteredBuckets
      }
      setUser(updatedUser)
    }

    const editItem = (item) => {
      console.log(item)
      fetch(`/items/${item.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
      .then(res => res.json())
      .then(data => {
        let userBuckets = [...user.buckets]
        let bucket = userBuckets.find(b => b.id == item.bucket_id)
        const updatedItems = bucket.items.map(i => i.id != item.id ? i : data)
        const updatedBucket = {...bucket, items: updatedItems}
        const updatedUserBuckets = userBuckets.map(b => b.id == bucket.id ? updatedBucket : b)
  
        const updatedUser = {
          ...user,
          buckets: updatedUserBuckets
        }
        setUser(updatedUser)
      })
    }


    return (
      <UserContext.Provider value={{user, login, logout, signup, loggedIn, buckets, addBucket, addItem, deleteItem, editItem}}>
        {children}
      </UserContext.Provider>
    );
}
  
  export { UserContext, UserProvider }; 