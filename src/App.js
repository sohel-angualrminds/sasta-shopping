import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from './Components/Home'
import Cart from './Components/Cart'
import Placeorder from './Components/PlaceOrder'

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/*" element={<Navigate to="/home" />} />
                <Route exact path="/home" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/placeorder" element={<Placeorder />} />
            </Routes>
        </Router>
    )
}

export default App
