import React, { useState } from 'react';
import axios from 'axios';
import GetData from './getDetails';
import './style/addingData.css'

const AddData = () => {

  const [key, setKey] = useState('');

  const [value, setValue] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      
      const data = {

        query: {

          query_string: {

            query: {

              [key]: value,
            },
          }
        }
      };

      const response = await axios.post('http://localhost:8000/formats/save', data);

      setShowSuccessMessage(true);

      console.log(response.data);

      setKey('')

      setValue('')

    } catch (error) {

      console.log(error, 'Error');

    }

    setTimeout(() => {

      setShowSuccessMessage(false);

    }, 3000);

  };

  return (

    <div className='content'>

      {showSuccessMessage && <p className='success-message'>Data added successfully!</p>}

      <form onSubmit={handleSubmit}>

        <label>

          KEY
          <textarea
            type="string"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />

        </label>
        <label>
          VALUE
          <textarea
            type="string"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

        </label>
        <br />

        <button className='btn' type="submit">Submit</button>

      </form>
      <GetData />
    </div>
  );
};

export default AddData;
