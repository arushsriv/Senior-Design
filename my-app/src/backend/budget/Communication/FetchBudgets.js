import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for making HTTP requests

function FetchBudgets({ onDataFetched }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Function to fetch data from the web service
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/predict-spending');
        setData(response.data); 
        onDataFetched(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts

    // Cleanup function (optional)
    return () => {
      // You can perform any cleanup here if necessary
    };
  }, [onDataFetched]); // Dependency array includes the callback function

  return (
    <div>
      {data ? (
        <div>
          {/* Render your data here */}
          {/* Example: */}
          <p>Spending Prediction: {data.prediction}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default FetchBudgets;
