import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './style/formatter.css';

const Format = () => {

  const [inputValue, setInputValue] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [formattedData, setFormattedData] = useState(null);

  const [copied,setCopied] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const [key, concordinateValue] = inputValue.split(' ');

  
    try {

      const response = await axios.get('http://localhost:8000/formats');

      console.log(response)

      const concordance = response.data.find((item) =>

      Object.keys(item.query.query_string.query).some((queryKey) => queryKey.toLowerCase() === key.toLowerCase())

      );

      if (concordance) {

        const formattedJson = {

          query: {

            query_string: {

             query:`${concordance.query.query_string.query[key.toLowerCase()] || concordance.query.query_string.query[key.toUpperCase()]}:${concordinateValue}`,

            },
          },
        };
        
        setFormattedData(JSON.stringify(formattedJson, null, 2)); 

        setErrorMessage('');

        setInputValue('');


      } else {

        setFormattedData(null);

        setErrorMessage('Key not found');

      }

    } catch (error) {

      setFormattedData(null);

      setErrorMessage('Error retrieving data');
      
    }
  };

  const handleInputChange = (e) => {

    setInputValue(e.target.value);

  };


  const handleCopyToClipboard = () => {

    setCopied(true);

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

      {formattedData && (

        <div>
       {/* <pre>{formattedData}</pre> */}

       <CopyToClipboard text={formattedData} onCopy={handleCopyToClipboard}>

       <button className='board'>Copy to Clipboard</button>

       </CopyToClipboard>

       {copied && <span>Copied to clipboard!</span>}

        </div>
      )}

    </div>
  );
};

export default Format;


