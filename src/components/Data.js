import React, { useState, useEffect } from 'react';
import socket from './socket';
import '../styles/Data.css'

const categorieAutorise = ['flop', 'racisme', 'nerd', 'nbSessionVanne', 'cervo'];

function Data() {
  const [listPrenom, setListPrenom] = useState([]);
  const [selectCategorie, setSelectCategorie] = useState('');
  const [selectPrenom, setSelectPrenom] = useState('');
  const [data, setData]= useState('');

  useEffect(() => {
    socket.emit('recupName');

    socket.on('prenom', (prenom) => {
      setListPrenom(prenom);
    });

    return () => {
      socket.off('prenom');
    };
  }, []);

  const handleButton = (e) =>{
    e.preventDefault()

    socket.emit("recupData",selectPrenom,selectCategorie);
    socket.on("sendData",(data)=>{
        setData(data);
    })
  }

  return (
    <div className='centerBox'>
        <div className='containerData'>
            <form onSubmit={handleButton}>
                <select value={selectPrenom} onChange={(e) => setSelectPrenom(e.target.value)} id='selectPrenom'required>
                    <option value="">Sélectionnez une personne</option>
                    {listPrenom.map((prenom, index) => (
                    <option key={index} value={prenom.prenom}>
                        {prenom.prenom}
                    </option>
                    ))}
                </select>
                <select value={selectCategorie} onChange={(e) => setSelectCategorie(e.target.value)} id='selectCategorie'required>
                    <option value="">Sélectionnez une catégorie</option>
                    {categorieAutorise.map((categorie, index) => (
                    <option key={index} value={categorie}>
                        {categorie}
                    </option>
                    ))}
                </select>
                <button type='submit'>Regarder les Datas</button>
            </form>
            <div className='DataGrid'>
                {Array.isArray(data) && data.map((data, index) => (
                    <div key={index} className='data'>
                        <p>{data.commentaire}</p>
                        <p>{data.dateAjout}</p>
                    </div>
                ))}    
            </div>
        </div>
    </div>

  );
}

export default Data;
