
//* The following file is intended to help understand the relationship between the model, router, and subCollections
//* In Typical use cases this would be broken into to a minimum of 2 files (Model & Router)

//! Model File Contents
const {model} = require('@cfevans/cfe-model-manager/model');


const {
  db, //*Direct reference to MongoDB Model 
  helpers, //*Wrapper for MongoDB Model -> return, returnSingle, add, addUnique, removeOne, removeMany
  expressMiddleware, //*Middleware that sets reference to required model(s) on to the request
  route, //*Middleware for handling all generic routes for the models
  sub_collection,
} = model({
  //*Collection Name
  collection: 'permissions',
  //*Set Schema using typical Mongoose definition
  schema:{
    project_id: String,
    name: String,
    notes: String,
    description: String,
  }, 
  //*Should Change History always be tracked for the model
  log_changes: true,
  //*Parameters to be removed from mongoose query
  removeParams: [],
  //*Additional query parameters allowed to be passed to mongo query
  optionalQuery: [],
  //*Additional Sub collections
  subCollections: [
    {
      collection: 'templates', //*Name gets appended to the primary collection name
      schema:{
        permission_id: String,
        project_id: String,
        feature: String,
        access_level: String,
      //header_id: String //* Gets added by default to all Collections 
      }, 
      log_changes: true,
      removeParams: [],
      optionalQuery: [],
    }
  ]
  
  
})

//*Export Permission Model for reference by external files 
module.exports = {
  db, helpers, expressMiddleware, route, sub_collection
}

//! End Model File Contents

//! Router File Contents 
const express = require('express');
const router = express.Router({mergeParams: true});

module.exports = router;

//*To Override Any Default Routes declare before the default route middleware is provided

    // //*Will Override the default route for this exported from the main
    // router.get('/api/:project_id/permissions/list',async (req,res)=>{
    //   let data = await helpers.return({query: {...req.params}})
    //   res.json(
    //     [...data, ...data, ...data]
    //   ) 
    // });

    // //*Will Override the default route for this exported from the main
    // router.get('/api/:project_id/permissions/:header_id/templates/list',async (req,res)=>{
    //   console.log({sub_collection: sub_collection.templates.helpers})
    //   let data = await sub_collection.templates.helpers.return({query: {...req.params}})
    //   res.json(
    //     [...data, ...data, ...data]
    //   ) 
    // });




//*Handling Route Permissions
  //*Permissions Specific to Overall Access based on project_id or feature, should be handled using middleware at a higher entry point
  //*CRUD permissions based on this route should be defined using a middleware at this level
  const defaultRouteLogic = (req,res,next)=>{
    //* This middleware can be used to define what endpoints a user has access to
    //* Typically use in combo with req.user && other permission logic
    //*If No Permissions are to be utilized 
    // req.route_permission = null;

    //*If Permissions are defined any permission missing wont work
    req.route_permission = {
      //*The Primary Model should always be accessed this Primary
      primary: {
        list: true,
        view: true,
        create: {
          access: (req)=>{
            return true
          },
          fieldsAllowed: (req)=>{
            return null
          },
          fieldsRemove: (req)=>{
            return null
          },
        },
        update: {
          access: true,
          // fieldsRemove: (req)=>(['notes'])
        },
        remove: {
          access: async (req)=>{
            return true
        }},
      },
      //*All subcollections shall use collection_name for key
      templates: {
        list: true,
        view: true,
        create: true,
        update: true,
        remove: true,
      }
    }
    
    next()
  }




//* Declare Any Special Routes above here, otherwise will use default routes set here
router.use('/api/:project_id/permissions',defaultRouteLogic, expressMiddleware,route);

