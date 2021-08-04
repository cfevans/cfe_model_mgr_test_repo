# Mongo DB / Express Helper Library

The code is broken down into two exports:

1)[ Express Library -> Common JS / (require)](README_EXPRESS.md)
   * Express ->  Routing
   * Mongoose -> Mongo DB
2)[ React Library -> ES6 (import / export)](README_RTK_MODEL.md)
   * Redux Toolkit -> State Management
   * Axios -> API Calls


## Common Endpoint Routing

* App
  *  domain/feature/app
* API
  * domain/feature/:project_id/api/model_name (model_name doesnt have to be exact)
  * GET (List)
    * domain/feature/:project_id/api/model_name/list
  * GET (view)
    * domain/feature/:project_id/api/model_name/:_id
  * POST (create)
    * domain/feature/:project_id/api/model_name/create
  * POST (update)
    * domain/feature/:project_id/api/model_name/update/:_id
  * POST (delete)
    * domain/feature/:project_id/api/model_name/delete/:_id
  * GET (history)
    * domain/feature/:project_id/api/model_name/history/:_id

* Sub Collection Default Routing
  * GET (List)
    * domain/feature/:project_id/api/model_name/:header_id/:sub_collection
  * GET (View)
    * domain/feature/:project_id/api/model_name/:header_id/:sub_collection/view/:_id
  * POST (create)
    * domain/feature/:project_id/api/model_name/:header_id/:sub_collection/create
  * POST (Update)
    * domain/feature/:project_id/api/model_name/:header_id/:sub_collection/update/:_id
  * POST (Delete)
    * domain/feature/:project_id/api/model_name/:header_id/:sub_collection/remove/:_id