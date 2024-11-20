import React,{useState,useEffect} from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import '../styles/Profil.css';
import socket from './socket';

const prenomsAutorises = ['Ramy', 'Etienne', 'Lucas', 'Adrien', 'Franck', 'Elliot', 'Cengizhan', 'Flavio', 'Hugo', 'Mathox', 'Nicolas', 'Kylian', 'Clement', 'Elouand', 'Yanis', 'Thibaud'];

function Profil() {
    const { prenom } = useParams();
    const [selectCategorie, setSelectCategorie] = useState('');
    const [commentaire, setCommentaire] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!prenomsAutorises.includes(prenom)) {
          alert('Prénom Inconnu. Redirection vers la page d\'accueil.');
          navigate('/');
        }
      }, [prenom,navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectCategorie) {
            alert('Veuillez sélectionner une catégorie');
            return;
        }
        if (!commentaire) {
            alert('Veuillez écrire un commentaire');
            return;
        }
        if (commentaire.length > 999) {
            alert('Veuillez écrire un commentaire moins long (999 caractère)');
            return;
        }
        socket.emit('envoyerDonnees', {prenom,selectCategorie,commentaire});

        setSelectCategorie('');
        setCommentaire('');
    };

    return (
        <>
            <div className='centerBox'>
                <div className='profilDude'>
                    <h2>{prenom}</h2>
                    <p>Incrémenter un compteur </p>
                    <form className='formulaire' onSubmit={handleSubmit}>
                        <div id="center">
                            <select value={selectCategorie} onChange={(e) => setSelectCategorie(e.target.value)} required id='ChooseCategorie'>
                                    <option value="">Sélectionnez une catégorie</option>
                                    <option value="flop">Flop</option>
                                    <option value="racisme">Racisme</option>
                                    <option value="nerd">Nerd</option>
                                    <option value="nbSessionVanne">NbSessionVanne</option>
                                    <option value="cervo">Cervo</option>
                                </select>
                        </div>
                        <textarea placeholder='Commentaire' value={commentaire} onChange={(e) => setCommentaire(e.target.value)} required></textarea>
                        <div id="center">
                            <button type='submit'>Envoyer</button>
                        </div>
                    </form>
                </div>

            </div>
        </>

    );
}

export default Profil;
