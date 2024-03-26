// import React, { useState } from 'react';

// const CardFilterForm = ({ onSubmit }) => {
//   const [formData, setFormData] = useState({
//     annualFeePreference: '',
//     annualFeeLimit: 0,
//     averageTotalMonthlyBalance: 0,
//     ficoScore: 0,
//     bonusWeight: 0,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Do you want a card with an annual fee? (yes/no):
//         <input
//           type="text"
//           name="annualFeePreference"
//           value={formData.annualFeePreference}
//           onChange={handleChange}
//         />
//       </label>

//       <label>
//         How much of a fee are you willing to spend:
//         <input
//           type="text"
//           name="annualFeeLimit"
//           value={formData.annualFeeLimit}
//           onChange={handleChange}
//         />
//       </label>

//       <label>
//         Enter Average Total Monthly Balance:
//         <input
//           type="text"
//           name="averageTotalMonthlyBalance"
//           value={formData.averageTotalMonthlyBalance}
//           onChange={handleChange}
//         />
//       </label>

//       <label>
//         Enter FICO Score:
//         <input
//           type="text"
//           name="ficoScore"
//           value={formData.ficoScore}
//           onChange={handleChange}
//         />
//       </label>

//       <label>
//         Input a number between 0 and 1 indicating how much you value a good card bonus deal versus long term points:
//         <input
//           type="text"
//           name="bonusWeight"
//           value={formData.bonusWeight}
//           onChange={handleChange}
//         />
//       </label>

//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default CardFilterForm;