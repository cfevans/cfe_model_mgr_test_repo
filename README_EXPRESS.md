# Express Library

**The following library is written in Common JS and requires the use of (require).**

## About
  * This Express Library allows for the simplification of the express / mongo code for api calls.
  * The following features are provided by the API.
    * Auto Generated REST endpoints for a collection
    * Each collection had 1 level of detail provided below in a sub_collection
      * The primary collection is called: **Header Record**
      * The sub collection is called the **Detail Record**
  
## Initial Set-up
> ### Define your Model
> ```javascript
> const {model} = require('@cfevans/cfe_express_mongo');
>
>
> const {db, helpers, expressMiddleware, route} = model({
>  schema:{
>    //*Define Schema -> Accepts Mongoose Parameters
>    project_id: String,
>    email: String,
>    firstName: String,
>    lastName: String,
>  }, 
>  collection: 'users', //Define Name of Collection
>  database_override: null, //Use if you want ot override the 
>  removeParams: [],// ['project_id] accepts array of strings, any field defined will be removed from the router params & query
>  optionalQuery: [], // accepts array of strings, any field not in array will be deleted
> })
> ```
> ### Declare your Route, in your routes folder
>  * Route.use is the primary means by which the Express Routing works
>  * Any API route can be modified by declaring it prior to the following code
> ```javascript
>  const Model  = require('../../model/permissions/templates'); //Project Specific
> 
> router.use(
>   '/api/:project_id/permissions', //declare route
>   Permissions.expressMiddleware, // Required Middleware from Model: Assigns Model to the req
>   Permissions.route // Required Middleware from Model: Manages REST / CRUD operations
> )
>      
