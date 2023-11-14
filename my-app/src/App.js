// import './App.css';
import Preferences from './Preferences';
import Register from './Register';
import Login from './Login';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
      <Routes>
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
       </Routes>
      </div>
    </Router>

  );
}

export default App;
 