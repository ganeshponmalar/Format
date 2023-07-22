import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/addingData.css';
import './addingData';

const GetData = ({ updateData }) => {

  
  const [formats, setFormats] = useState([]);

  const [loading, setLoading] = useState(true);

  

  useEffect(() => {

    fetchFormats();

  }, []);

  const fetchFormats = async () => {

    try {

      const response = await axios.get('http://localhost:8000/formats');

      setFormats(response.data);

      setLoading(false);

    } catch (error) {

      console.error('Error retrieving data:', error);

      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className='styled-table '>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {formats.map((format) => {

              const { query } = format;

              const { query_string } = query;

              const { query: keyValue } = query_string;

              const keys = Object.keys(keyValue);

              return (

                <tr key={format._id}>

                  {keys.map((key) => (

                    <React.Fragment key={key}>

                      <td>{key}</td>

                      <td>{keyValue[key]}</td>

                    </React.Fragment>
                    
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetData;
