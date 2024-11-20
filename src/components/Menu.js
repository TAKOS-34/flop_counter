import React ,{useState,useEffect} from 'react'
import socket from './socket';
import '../styles/Menu.css'
import { Link } from 'react-router-dom';

function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClose, setIsClose] = useState(true);

    const [listPrenom, setListPrenom] = useState([]);
    const itemsPerPage = 2;
    const numberOfPages = Math.ceil(listPrenom.length / itemsPerPage);

    useEffect(() => {
        socket.on('affichageMenu', () => {
          socket.emit('recupName');
          socket.on('prenom', (prenom) => {
            setListPrenom(prenom);
          });
          setIsOpen(true);
        });
    
        return () => {
          socket.off('affichageMenu');
          socket.off('prenom');
        };
      }, []);

    const toggleMenu = () => {
        setIsClose(false);
        setTimeout(() => {
            setIsOpen(false);
            setIsClose(true);
          }, 600);
    };

    const getPageItems = (page) => {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return listPrenom.slice(startIndex, endIndex);
    };

    return (
        <>
            <div className={`menu ${isOpen ? 'visibleMenu' : 'hidden'} ${isClose ? '' : 'reverseAnim'}` }>
                <div className={`hamburger-btn ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                </div>
                <div className='nameDudes'>
                    {Array.from({ length: numberOfPages }, (_, page) => (
                    <ul key={page}>
                        {getPageItems(page).map((prenom, index) => (
                            <li key={index} className='prenomClickable' onClick={toggleMenu}>
                                <Link to={`/Ajout/${prenom.prenom}`}>
                                    {prenom.prenom}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Menu