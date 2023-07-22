
import React, { useState } from 'react';

import axios from 'axios';

const Form  = () => {

  const [inputValue, setInputValue] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  
  const [formattedData, setFormattedData] = useState(null);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const [key, concordantValue] = inputValue.split(' ');

    try {

      const response = await axios.get('http://localhost:8000/formats');

      console.log(response)

      const concordance = response.data.find((item) =>

      Object.keys(item.query.query_string.query).some((queryKey) => queryKey.toLowerCase() === key.toLowerCase())

      )

      if (concordance) {
   
        const formattedJson = {

        query:{

          query_string:{

          query:`${concordance.query.query_string.query[key.toLowerCase()] || concordance.query.query_string.query[key.toUpperCase()]}`,
      
        }
      }

        };
        setFormattedData(JSON.stringify(formattedJson, null, 2));

        setErrorMessage('');

      } else {
        setFormattedData(null);

        setErrorMessage('Data not found for the entered key.');

      }
    } catch (error) {

      setFormattedData(null);

      setErrorMessage('Error retrieving data');

    }
  };

  const handleInputChange = (e) => {

    setInputValue(e.target.value);

  };

  return (

    <div>

      <form onSubmit={handleSubmit}>

        <label>

          Key and Concordant Value:
          <input type="text" value={inputValue} onChange={handleInputChange} />

        </label>
        <button type="submit">Get Value</button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}

      {formattedData && <pre>{formattedData}</pre>}

    </div>

  );
};

export default Form;

