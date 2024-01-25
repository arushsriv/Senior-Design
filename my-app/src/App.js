// import './App.css';
import Preferences from './Preferences';
import Register from './Register';
import Login from './Login';
import CardOffers from './cardOffers';
import MainPage from './MainPage';
import MonthlyBreakdown from './MonthlyBreakdown';
import Profile from './Profile';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BudgetGraphs from './BudgetGraphs';
import NewBudget from './newBudget';

function App() {

  return (
    <Router>
      <div className="App">
      <Routes>
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/card-offers" element={<CardOffers />} />
          <Route path="/budget" element={<BudgetGraphs />} />
          <Route path="/breakdown" element={<MonthlyBreakdown />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new-budget" element={<NewBudget />} />
       </Routes>
      </div>
    </Router>
    

  );
}

export default App;
 