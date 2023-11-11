// import './App.css';
import Preferences from './Preferences';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
      <Routes>
          <Route path="/preferences" element={<Preferences />} />
       </Routes>
      </div>
    </Router>

  );
}

export default App;
