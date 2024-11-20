import React from 'react';
import Classement from './Classement';
import Header from './Header';
import Menu from './Menu';
import Profil from './Profil'
import Data from './Data';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Camembert from './Camembert';

function App() {

  return (
    <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Classement />} />
          <Route path="/data" element={<Data />} />
          <Route path="/camembert" element={<Camembert />} />
          <Route path="/Ajout/:prenom" element={<Profil />} />
        </Routes>
        <Menu/>
    </Router>
  );
}

export default App;