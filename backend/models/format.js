const mongoose = require('mongoose')

const jsonSchema = new mongoose.Schema({

  query: {

    query_string: {

      query: {

        type: Object,

        required: true
      }
    }                                                
    
  }

});


  module.exports = mongoose.model('Formation',jsonSchema)

  