const mongoose = require('mongoose');

const route = require('./routerActions')
//*Helper Functions for interacting with Database

const helpers = require('./helpers').helpers

//*Primary Function -> Exports db, helpers, and generic CRUD router
module.exports.model = function({schema, collection, database_override,  removeParams, optionalQuery,log_changes, subCollections}){
  //*Secondary Collection
  const subCollectionsCompiled = subCollections.map(col=>[col.collection,compileCollections(col,collection)])
  
  //*Primary Collection
  const primaryCollectionCompiled = compileCollections({schema, collection, database_override,  removeParams, optionalQuery, log_changes, subCollections: subCollectionsCompiled})
  

    //*Middleware for Express to understand database relationship
    const expressMiddleware = (req,res, next)=>{
      req.database_collections = Object.fromEntries([
        ['primary', primaryCollectionCompiled],
        ...subCollectionsCompiled
      ])
    
      next()
    }

  //*Exports
  return {
    ...primaryCollectionCompiled,
    sub_collection: Object.fromEntries(subCollectionsCompiled),
    route,
    expressMiddleware,
  }

}  


//*Assembles Export for Model & Routes
function compileCollections({schema, collection, database_override, removeParams,optionalQuery,log_changes, subCollections},primary_collection){
  let schemaOR = primary_collection ? {...schema, header_id: String} : schema

  const dataSchema = mongoose.Schema({
    ...schemaOR
  },{timestamps: true});
    
  const collectionName = primary_collection ? `${primary_collection}_${collection}` : collection; 
  
  const db = !database_override ? 
    mongoose.model(collectionName, dataSchema, collectionName)
    :
    mongoose.connection.useDb(database_override).model(collectionName, dataSchema, collectionName);
    
  
  return {
    collection: collectionName,
    db,
    helpers: helpers({db, log_changes, subCollections}),
    removeParams,
    optionalQuery,
    log_changes,
    subCollections,
  }
}