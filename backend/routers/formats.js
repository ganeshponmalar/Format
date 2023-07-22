const express = require('express')
const { ServerCapabilities } = require('mongodb')
const router = express.Router()
const Formation = require('../models/format')


router.get('/', async (req, res) => {

  try {

    const format = await Formation.find()

    res.json(format)

  } catch (error) {

    res.send('Error' + error)

  }

})

//post request


router.post('/', async (req, res) => {

  console.log(req.body)

  try {

    const { query } = req.body;

    console.log(req.body, 'inside try catch block')

    if (!query) {

      return res.status(400).json({ error: 'Missing required fields' });

    }

    const newQuery = new Formation({

      query: [

        {

          query_string: {

            query

          }

        }
      ]
    });

    const savedQuery = await newQuery.save();

    console.log(savedQuery)

    res.json(savedQuery);

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: 'Failed to save query' });

  }

});


router.get('/', (req, res) => {

  console.log(req.body)

  try {

    const query = req.params.query;

    console.log(query)

    if (!query) {

      return res.status(400).send('Order number is required');

    }

    Formation.findOne({ 'query.query_string.key': query })

      .exec()

      .then((queryResult) => {

        if (!queryResult) {

          return res.status(404).send('Data not found');

        }

        const data = queryResult.toObject();

        delete data._id;
        delete data.__v;

        data.query = data.query.filter(

          (queryItem) => queryItem.query_string.query === query

        );

        data.query = data.query.map((queryItem) => {

          const { _id, ...rest } = queryItem;

          return rest;

        });

        res.json(data);
      })

      .catch((err) => {

        console.error(err);

        res.status(500).send('Error retrieving data from the database');

      });

  } catch (error) {

    console.error(error);

    res.status(500).send('Server error');
  }
});


router.get('/', async (req, res) => {
  console.log(req.query)

  try {

    const query = req.query.q

    console.log(query)

    if (!query || query.trim() === '') {

      return res.status(400).send('required query is not found')
    }

    const SearchTerms = query.split('').filter(term => term !== '');
    console.log(SearchTerms)

    const regexPatterns = SearchTerms.map(term => `(?=.*${term})`).join('');
    console.log(regexPatterns)

    const regex = new RegExp(`^${regexPatterns}.*$`, 'i');
    console.log(regex)

    const data = await Formation.find(

      {

        'query.query_string.query': regex
      },
  
    
    ).select(' -_id -__v')
    .lean()
    .limit(10);
   
    res.json(data);

  } catch (error) {
    console.log(error, 'error')
  }
})





router.post('/', async function (req, res, next) {

  try {
    const query = req.body.query; // Assuming the request body contains the query string

    if (!query || query.trim() === '') {
      return res.status(400).send('Query string is required');
    }

    // Create a new document
    const format = new Formation({
      query: [
        {
          query_string: {
            query: query, // Store the query string
          },
        },
      ],
    });

    // Save the document to the database
    await format.save();

    res.send('Data saved successfully');
  } catch (error) {
    next(error);
  }
});



router.post('/', async function (req, res, next) {
  try {
    const queryData = req.body; // Assuming the request body contains the key-value pairs

    if (!queryData) {
      return res.status(400).send('Query data is required');
    }

    const format = new Formation({
      query: queryData,
    });

    await format.save();

    res.send('Data saved successfully');
  } catch (error) {
    next(error);
  }
});




router.post('/save', async (req, res) => {

  try {

    const { query } = req.body;

    const format = new Formation({ query });

    await format.save();

    res.status(201).json({ message: 'Data saved successfully' });

  } catch (error) {
    
    res.status(500).json({ error: 'Failed to save data' });
    
  }
});

router.get('/search', async (req, res) => {
  try {
    const { key } = req.query;

    const data = await Formation.find({ 'query': { [key]: { $exists: true } } });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Key not found' });
    }

    const formattedData = data.map(item => ({ [item.query[key]]: item.query[key] }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});




module.exports = router








