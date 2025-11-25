import React from 'react';
import './App.css';
import Navigation from './Navigation'

import { Outlet } from 'react-router-dom'
import { MyProvider } from '../context/AppContext';



function App() {
  return (
        <div className="App">
            <MyProvider>
                <Navigation />
                <br />
                <hr />
                <Outlet />
            </MyProvider>
        </div>

  );
}

export default App;

