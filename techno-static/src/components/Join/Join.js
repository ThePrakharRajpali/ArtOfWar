import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../Technothlon_full_logo.png';

import './Join.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className= "">
            <span>
                <Navbar expand="lg" variant="dark" bg="dark">
                    <Navbar.Brand className='mx-auto' href=""><img src={logo} alt='Technothlon_full_logo'></img></Navbar.Brand>
                </Navbar>
            </span>
            {/* <div classname='joinOuterContainer'> */}
                <div className="joinOuterContainer">
                    <h1 className="heading">Join</h1>
                    <div><input placeholder="UserName" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}/></div>
                    <div><input placeholder="RoomCode" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)}/></div>
                    {/* <Link onClick={event => (!name||!room) ? event.preventDefault():null} to={'/game?:name='+name+'&:room='+room}>
                        <button className="button mt-20" type="submit">Sign In</button>
                    </Link> */}
                    <Link 
                        onClick={(e) => (!name || !room ? e.preventDefault() : null)}
                        to={{
                            pathname: "/game",
                            state: {
                                name: name,
                                roomid: room,
                            },
                        }}>
                            <button className="button mt-20" type="submit">Sign In</button>
                    </Link>
                </div>
            {/* </div> */}
        </div>   
    )
}

export default Join;