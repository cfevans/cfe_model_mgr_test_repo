const express = require('express');
const router = express.Router({mergeParams: true});
module.exports = router;

const {helpers} = require('./helpers')
const history = require("./history")


//* Modifies req.query & req.params for the following routes
router.use(permissionValidator)

const response = (res, data)=>{
  if(res.jsonEnvelope){
    res.jsonEnvelope(data)
  }else{
    res.json(data);
  }
}


async function permissionValidator(req,res,next){
  let path = req.path.split('/')
  let isPrimaryPath = ['list', 'view', 'create', 'update', 'remove', 'history'].includes(path[1])
  let permission_key = isPrimaryPath ? 'primary' : path[2]
  let end_point = isPrimaryPath ? path[1] : path[3]

  //* If no permissions are set fair game to do any action
  if(!req.route_permission){
    next()
    return
  }

  //*Check Permissions `
  let isAllowed = false;
  let endpointPermissions = req.route_permission[permission_key][end_point]
  if(typeof endpointPermissions.access === 'function'){
    isAllowed = await endpointPermissions.access(req)

  }

  //*Allow for shorthand
  if(typeof endpointPermissions === 'boolean'){
    isAllowed = endpointPermissions;
  }
  if(typeof endpointPermissions.access === 'boolean'){
    isAllowed = endpointPermissions.access;
  }


  if(isAllowed){
    req.editFieldsAllowed = endpointPermissions.fieldsAllowed ? endpointPermissions.fieldsAllowed(req) : null;
    req.editFieldsRemove = endpointPermissions.fieldsRemove ? endpointPermissions.fieldsRemove(req) : null;
    next()
  }else{
   response(res,{error: 'Permission Denied', alert: {title: 'Permission Denied', message: 'You do not have permission to perform the requested action.'}, data: path[1] === 'list' ? [] : {}})
  }
}



router.get('/list',selectDB, queryValidator, async (req,res)=>{
  const {query, params,body,db, log_changes, origin, user} = extractRequestInfo(req)
  
  const listing = await helpers({db, log_changes}).return({query: {...params, ...query}, log_changes, origin, user})
 response(res,listing)
});

router.get('/view/:_id',selectDB, queryValidator,  async (req,res)=>{
  const {query, params,db, log_changes, origin, user} = extractRequestInfo(req)

  const document = await helpers({db, log_changes}).returnSingle({query: {...params, ...query}, log_changes, origin, user})
 response(res,document)
});

router.post('/create',selectDB, queryValidator,  async (req,res)=>{
  const {params,db, log_changes, origin, user} = extractRequestInfo(req)
  const body = allowedDataFields(req);
  const newItem = await helpers({db, log_changes}).addUnique({...body, ...params}, log_changes, origin, user)
 response(res,newItem)
})

router.post('/update/:_id',selectDB, queryValidator, async (req,res)=>{
  const { params,db,log_changes, origin, user} = extractRequestInfo(req)
  const body = allowedDataFields(req);

  const updated = await helpers({db, log_changes}).add({query: {...params}, data: body,log_changes, origin, user})
 response(res,updated)
})

router.post('/remove/:_id',selectDB, queryValidator, async (req,res)=>{
  const {params,db,log_changes, origin, user} = extractRequestInfo(req)
  
  await helpers({db, log_changes}).removeOne({query: {...params},log_changes, origin, user})
  
  response(res,{...params, deleted: true})
  
  //*Delete all related_items
  let sub_dbs = req.database_collections
  
  for(let sub of Object.keys(sub_dbs)){
    if(sub_dbs != 'primary'){
      await sub_dbs[sub].helpers.removeMany({query: {header_id: req.params._id}})
    }
  }
})


router.get('/history/:_id', selectDB, queryValidator, async (req,res)=>{
  const {params,db,log_changes} = extractRequestInfo(req)
  const change_history = await history.getHistory({_id: params._id, db})
 response(res,change_history)
})


  //*Query queryValidator
  //* Removes any params defined 
  //* Removes any query parameters not defined


  function queryValidator(req,res,next){
    const {removeParams,optionalQuery} = req.database;
      //*Remove Params Specified
        //*Useful for when Model doesnt require a portion of the url Parameters provided
      for(let param of removeParams ||[]){
        delete req.params[param]
      }
      delete req.params['sub_collection']

      //*Remove Query fields not supported
      for(let queryField of Object.keys(req.query)){
        let match = optionalQuery.find(optionField=>optionField === queryField)
        if(!match){
          delete req.query[queryField]
        }
      }
      next()
  }

  //*Easily Extract necessary info to object to simplify code required in each route
  function extractRequestInfo(req){
    const {query, params, body} = req
    const {db, log_changes} = req.database
    const origin = req.originalUrl
    const user = req?.user?.email || req?.user || null
    return {query, params, body, db, log_changes, origin, user}
  }



  //*Clean Data Fields for Update
  function allowedDataFields(req){
    const {body, editFieldsAllowed, editFieldsRemove} = req;
    
    if(editFieldsAllowed){
      for(let field of Object.keys(body)){
          let match = editFieldsAllowed.find(f=>f===field)
          if(!match){
            delete body[field]
          }
      }
    }

    if(editFieldsRemove){
      for(let field of editFieldsRemove){
        delete body[field] 
      }
    }
    return body
  }

  //! Logic For Sub Routes
  router.get('/:header_id/:sub_collection/list', selectDB, queryValidator, async (req,res)=>{
    const {query, params,body,db,log_changes, origin, user} = extractRequestInfo(req)
    const listing = await helpers({db, log_changes}).return({query: {...params, ...query},log_changes, origin, user})
   response(res,listing)
  });
  
  router.get('/:header_id/:sub_collection/view/:_id', selectDB, queryValidator, async (req,res)=>{
    const {query, params,db,log_changes, origin, user} = extractRequestInfo(req)
  
    const document = await helpers({db, log_changes}).returnSingle({query: {...params, ...query},log_changes, origin, user})
   response(res,document)
  });
  
  router.post('/:header_id/:sub_collection/create', selectDB, queryValidator, async (req,res)=>{
    const {params,db,log_changes, origin, user} = extractRequestInfo(req)
    const body = allowedDataFields(req);
    const newItem = await helpers({db, log_changes}).addUnique({...body, ...params},log_changes, origin, user)
   response(res,newItem)
  })
  
  router.post('/:header_id/:sub_collection/update/:_id',selectDB, queryValidator,  async (req,res)=>{
    const { params,db,log_changes, origin, user} = extractRequestInfo(req)
    const body = allowedDataFields(req);
  
    const updated = await helpers({db, log_changes}).add({query: {...params}, data: body, origin, user})
   response(res,updated)
  })
  
  router.post('/:header_id/:sub_collection/remove/:_id',selectDB, queryValidator,  async (req,res)=>{
    const {params,db,log_changes, origin, user} = extractRequestInfo(req)
    
    await helpers({db, log_changes}).removeOne({query: {...params},log_changes, origin, user})
   response(res,{...params, deleted: true})
  })


  function selectDB(req,res,next){
    const {sub_collection} = req.params
    const {database_collections} = req
    if(!sub_collection){
      req.database = database_collections.primary;
    }else{
      if(!database_collections[sub_collection]){
        throw new Error(`Error: Subcollection ${sub_collection} doesn't exit on ${database_collections.primary.collection}`)
      }
      req.database = req.database_collections[req.params.sub_collection]
    }
    next()
  }