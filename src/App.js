import React from 'react'
import Home from './screens/Home'
import Hello from './screens/Hello'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div>
    <Sidebar/>
    <div className={`flex-1 p-4`}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<Hello/>} />
      </Routes>
    </div>
  </div>
  )
}

export default App
