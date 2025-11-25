import React, { createContext, useState, useEffect } from 'react';

const MyContext = createContext();

function MyProvider({ children }){
    const [buckets, setBuckets] = useState([])
    const [userBuckets, setUserBuckets] = useState([])
    const [user, setUser] = useState({})
    const [loggedIn, setLoggedIn] = useState("init") 
    const [bucketError, setBucketError] = useState(null)
    const [bucketFormFlag, setBucketFormFlag] = useState(false)      

    
    useEffect(() => {
        // auto-login
        fetch("/check_session").then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    setLoggedIn(true)
                    fetchBuckets()
                    setUser({
                        id: data.id,
                        username: data.username
                    })
                    setUserBuckets(data.buckets)
                    console.log({
                        id: data.id,
                        username: data.username
                    })
                    console.log(data.buckets)

                });
            } else {
                setLoggedIn(false)
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


    const login = (data) => {
        fetchBuckets()
        setUser({
            id: data.id,
            username: data.username
        })
        setUserBuckets(data.buckets)
        setLoggedIn(true)
    }

    const logout = () => {
        setUser({})
        setUserBuckets([])
        setLoggedIn(false)
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
            if (!data.error) {
                setBuckets([...buckets, data])
                setBucketError(null)
                setBucketFormFlag(false)
            } else {
                setBucketError(data.error)
            }
            // setBuckets([...buckets, data])
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
            let bucket = userBuckets.find(b => b.id === newItem.bucket_id)
            let userBucketsWithNew = [...userBuckets]
            if (!bucket){
                bucket = buckets.find(b => b.id === newItem.bucket_id)
                bucket = {...bucket, items: []}
                userBucketsWithNew = [...userBucketsWithNew, {...bucket, items: []}]  
            } 

            const updatedBucket = {...bucket, items: [...bucket.items, data]}
            const updatedUserBuckets = userBucketsWithNew.map(b => b.id === bucket.id ? updatedBucket : b)
            setUserBuckets(updatedUserBuckets)
        })
    }
    
    const deleteItem = (item) => {
        fetch(`/items/${item.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
        })
        let bucket = userBuckets.find(b => b.id === item.bucket_id)
        const updatedItems = bucket.items.filter(i => i.id !== item.id)
        const updatedBucket = {...bucket, items: updatedItems}
        const updatedUserBuckets = userBuckets.map(b => b.id === bucket.id ? updatedBucket : b)
        const filteredBuckets = updatedUserBuckets.filter(b => b.items.length > 0)
        setUserBuckets(filteredBuckets)
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
            let bucket = userBuckets.find(b => b.id === item.bucket_id)
            const updatedItems = bucket.items.map(i => i.id !== item.id ? i : data)
            const updatedBucket = {...bucket, items: updatedItems}
            const updatedUserBuckets = userBuckets.map(b => b.id === bucket.id ? updatedBucket : b)
            setUserBuckets(updatedUserBuckets)
        })
    }


    return (
        <MyContext.Provider value={{ user, userBuckets, login, logout, signup, loggedIn, bucketError, buckets, setBuckets, addBucket, addItem, deleteItem, editItem, bucketFormFlag, setBucketFormFlag }}>
        {children}
        </MyContext.Provider>
    );
}


export { MyContext, MyProvider }