import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Home from './Home'
import Navigation from './Navigation'
import Buckets from './Buckets'
import Bucket from './Bucket'
import SignUp from './SignUp';
import Login from './Login';
import Item from './Item'
import { UserProvider } from "./User";
import ItemForm from './ItemForm';



function App() {

  return (
    <Router>
      <UserProvider>
        <Navigation />
        <br />
        <hr />
        <div className="App">
          <Routes>
            <Route path="/signup" element={<SignUp  />} />
            <Route path="/login" element={<Login  />} />   
            <Route exact path="/" element={< Home/>} />
            <Route path="/buckets" element={ <Buckets  />} />
            <Route path="/buckets/:id" element={ <Bucket  />}  />
            <Route path="buckets/:bucket_id/items/:id" element={ <Item /> } />
            <Route path="/items/:new" element={ <ItemForm  />}  />
          </Routes>
        </div>
      </UserProvider>
  </Router>
  );
}

export default App;