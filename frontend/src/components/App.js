import React, { useEffect, useState } from 'react';
import HomePage from './HomePage';
import CreateRoomPage from './CreateRoomPage';
import JoinRoomPage from './JoinRoomPage';
import Room from './Room';
import {BrowserRouter as Router, Route, Link, Redirect, Routes, useNavigate} from 'react-router-dom';

const App = () => {

    return (
        <div className='center'>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/join" element={<JoinRoomPage/>}/>
                <Route path="/create" element={<CreateRoomPage/>}/>
                <Route
                    path="/room/:roomCode"
                    element={<Room/>}
                />
            </Routes>
        </div>
    )
}

export default App;