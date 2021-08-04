
const mongoose = require('mongoose');
const {isEqual} = require('lodash')

const dataSchema = mongoose.Schema({
  database: String,
  collection_name: String,
  origin_id: String,
  origin_header_id: String,
  field: String,
  prior: Object,
  updated: Object,
  action: String,
  user: String,
  origin: String,

},{timestamps: true});

let change_db = module.exports = mongoose.model('mongo_change_history', dataSchema);

module.exports.getHistory = async function({_id, db}){
  return new Promise ((resolve, reject)=>{
    change_db.find({collection_name: db.collection.name, origin_id: _id},(err,res)=>{
      if(err)reject(err)
      resolve(res);
    })
  })


}



module.exports.log_add = async function({db, newData, oldData, user, origin, log_changes}){
  if(!log_changes)return
  
  const prior = oldData._doc || oldData
  const updated = newData._doc || newData
  console.log({updated, prior})
  const {_id, header_id, createdAt, updatedAt, _v, ...cleanData} = updated;

  delete cleanData._v;

  const change_array = Object.keys(cleanData).map(field=>{
    const newValue = cleanData[field]
    const oldValue = prior[field] 
    const no_change = valueComparison(newValue, oldValue); 
    console.log(field, no_change, newValue, oldValue)
    if(no_change === false){
      return {
        database: db.name,
        collection_name: db.collection.name,
        origin_id: _id,
        origin_header_id: header_id,
        field,
        prior: {oldValue},
        updated: {newValue},
        action: oldData ? 'updated' : 'created',
        user,
        origin,
      }
    }
  }).filter(item=>item)

  change_db.insertMany(change_array,(err,res)=>{
    // console.log(res)
  })

}




module.exports.log_delete = async function({db, oldData, user, origin, log_changes}){
  if(!log_changes){return }
  console.log({oldData})
  const prior = oldData._doc || oldData
  const {_id, header_id, createdAt, updatedAt,_v, ...cleanData} = prior;

  change_db.insertMany([{
    database: db.name,
    collection_name: db.collection.name,
    origin_id: _id,
    origin_header_id: header_id,
    field: 'entire_object',
    prior: prior,
    updated: null,
    action: 'deleted',
    user,
    origin,
  }])


}


module.exports.log_delete_many = async function({db, oldData, user, origin, log_changes}){
  if(!log_changes){return }

  let deletedLogs = oldData.map((old)=>{
    let {_id, header_id} = old
    return {
      database: db.name,
      collection_name: db.collection.name,
      origin_id: _id,
      origin_header_id: header_id,
      field: 'entire_object',
      prior: old,
      updated: null,
      action: 'deleted',
      user,
      origin,
    }
  })

  change_db.insertMany(deletedLogs)


}

function valueComparison(newValue, oldValue){
  if(typeof newValue === 'object' &&
    typeof oldValue === 'object'
  ){
      return isEqual(newValue, oldValue)
  }
  if(typeof newValue === 'boolean' &&
    typeof oldValue === 'boolean'
  ){
    return newValue == oldValue
  }
  if(typeof newValue === 'function' &&
    typeof oldValue === 'function'
  ){
    return false
  }
  if(typeof newValue === 'number' &&
   typeof oldValue === 'number'
  ){
    return newValue == oldValue
  }
  if(typeof newValue === 'string' &&
  typeof oldValue === 'string'
  ){
    return newValue == oldValue
  }
  if(typeof newValue === 'symbol' &&
  typeof oldValue === 'symbol'
  ){
    return newValue == oldValue
  }
  if(typeof newValue === 'undefined' &&
  typeof oldValue === 'undefined'
  ){
    return false
  }
  return false
}
