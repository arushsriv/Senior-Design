import React from 'react';
import '../css/PostLoginScreen.css'; 

function LongButton({ onClick, children }) {
  return (
    <button className="long-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default LongButton;
