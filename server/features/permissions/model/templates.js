const express = require('express');
const router = express.Router({mergeParams: true});


const {model} = require('../../../../src/library/mongoDB/model');


const {db, helpers, expressMiddleware, route} = model({
  schema:{
    project_id: String,
    name: String,
    notes: String,
  }, 
  log_changes: true,
  collection: 'permissions',
  removeParams: [],
  optionalQuery: [],
  subCollections: [
    {
      collection: 'templates',
      schema:{
        permission_id: String,
        project_id: String,
        feature: String,
        access_level: String,
      }, 
      log_changes: true,
      removeParams: [],
      optionalQuery: [],
    }
  ]

  
})




module.exports = {
  db, helpers, expressMiddleware, route
}