import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CardOffers from './pages/cardOffers';
import MainPage from './pages/mainPage';

import './css/PostLoginScreen.css'; // Create this CSS file for styling if needed

function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
          <Route path="/card-offers" element={<CardOffers />} />
          <Route path="/" element={<MainPage />} />
       </Routes>
      </div>
    </Router>

  );
}

export default App;
