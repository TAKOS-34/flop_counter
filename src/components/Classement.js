import React,{useState,useEffect} from 'react';
import '../styles/Classement.css';
import socket from './socket';

function Classement(){
    const [listClassement, setListClassement] = useState([]);


    useEffect(() => {
        orderByFlop();
    }, []);

    const orderByFlop = () =>{
        socket.emit('getClassement','flop');
    }

    const orderByRacisme = () =>{
        socket.emit('getClassement','racisme');
    }

    const orderByNerd = () =>{
        socket.emit('getClassement','nerd');
    }

    const orderByNbSessionVanne = () =>{
        socket.emit('getClassement','nbSessionVanne');
    }

    const orderByCervo = () =>{
        socket.emit('getClassement','cervo');
    }

    socket.on('seeClassement',(classement)=>{
        setListClassement(classement);
    });

    return (
        <>
            <div className='centerBox'>
                <div className="grid-container"> 
                    <div className='gridHeader'>
                        <h2>Classement</h2>
                        <div className='flop' onClick={orderByFlop}>Flop</div>
                        <div className='racisme' onClick={orderByRacisme}>Racisme</div>
                        <div className='nerd' onClick={orderByNerd}>Nerd</div>
                        <div className='nbSessionVanne' onClick={orderByNbSessionVanne}>Session vanne</div>
                        <div className='cervo' onClick={orderByCervo}>Cervo</div>
                    </div>
                    <div className='ClassementGrid'>
                        {listClassement.map((prenom, index) => (
                            <div key={index} className='prenom'>
                            <p>{index + 1}.</p>
                            <p>{prenom.prenom}</p>
                            <div className='flop'>{prenom.flop}</div>
                            <div className='racisme'>{prenom.racisme}</div>
                            <div className='nerd'>{prenom.nerd}</div>
                            <div className='nbSessionVanne'>{prenom.nbSessionVanne}</div>
                            <div className='cervo'>{prenom.cervo}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Classement;