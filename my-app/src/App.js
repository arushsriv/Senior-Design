import logo from './logo.svg';
import './App.css';
import Preferences from './Preferences';

function App() {
  return (
    <div className="Preferences">
      <header className="Preferences-header">
        <img src={logo} className="Preferences-logo" alt="logo" />
        <p>
          Please input your personal spending habits and preferences for your budget below. 
        </p>
        <b >
          Budget
        </b>
      </header>
    </div>
  );
  // return Preferences
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
