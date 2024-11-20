import React from 'react';
import '../styles/Header.css'
import socket from './socket';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const toggleMenu = () => {
    socket.emit("afficheMenu");
  };

  const handleClick = () =>{
    navigate('/');
  }
  
  return (
    <>
        <div className="header">
            <div className='buttonHeader'>
              <button onClick={handleClick}>Accueil</button>
            </div>
            <div className='buttonHeader'>
              <Link to={`/data`}>
                <button>Data</button>
              </Link>
            </div>
            <div className='buttonHeader'>
              <Link to={`/camembert`}>
                <button>Camembert</button>
              </Link>
            </div>
            <div className='centerbutton'>
              <div className="hamburger-btn" onClick={toggleMenu}>
                  <div className="hamburger-line"></div>
                  <div className="hamburger-line"></div>
                  <div className="hamburger-line"></div>
              </div>
            </div>

        </div>
    </>

  );
}

export default Header;