const express = require('express');
const router = express.Router({mergeParams: true});


const {model} = require('../../../../src/library/mongoDB/model');


const {db, helpers, expressMiddleware, route} = model({
  schema:{
    project_id: String,
    email: String,
    firstName: String,
    lastName: String,
  }, 
  collection: 'users',
  removeParams: [],
  optionalQuery: [],
  subCollections: [
    
  ]
})





module.exports = {
  db, helpers, expressMiddleware, route
}

