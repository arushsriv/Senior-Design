// import './App.css';
import Preferences from './Preferences';
import Signup from './Signup';
import CardOffers from './pages/cardOffers';
import MainPage from './pages/mainPage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
      <Routes>
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/card-offers" element={<CardOffers />} />
          <Route path="/" element={<MainPage />} />
       </Routes>
      </div>
    </Router>
    

  );
}

export default App;
