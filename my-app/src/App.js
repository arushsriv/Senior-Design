// import './App.css';
import Preferences from './Preferences';
import Register from './Register';
import Login from './Login';
import CardOffers from './cardOffers';
import MainPage from './mainPage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
      <Routes>
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/card-offers" element={<CardOffers />} />
          <Route path="/" element={<MainPage />} />
       </Routes>
      </div>
    </Router>
    

  );
}

export default App;
 