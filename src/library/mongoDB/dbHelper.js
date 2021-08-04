const history = require('./history');

module.exports.add = async function( {db, data, query, user, origin, log_changes}){  

  //Does Data Exist?
  let exist =  await doesItemExist({db, query})
  if(!exist){
    //Add New Item to Database
    //console.log('adding item to database');
    let newData = await newItem({db, data, query})
    history.log_add({db, newData, user, oldData: exist, origin, log_changes})
    return newData
  }else{
    //Update Item in Database
    let newData =  await updateData({db, data, query})
    history.log_add({db, newData, user, oldData: exist, origin, log_changes})
    return newData
  }

}

module.exports.addUnique = async function( {db, data, query, user, origin,log_changes}){  
  let newData = await newItem({db, data, query})
  history.log_add({db, newData, user, oldData: null, origin, log_changes})
  return newData

}

function doesItemExist({db, query}){
  // console.log('Enter Does Item Exist');
  // console.log({query})
  return new Promise((resolve, reject)=>{
    db.findOne(query,(err, item)=>{
      // console.log({err})
      if(err) {reject()}
      if(item != null){
        //console.log(`DB Add: ${JSON.stringify(query)} does exist`);
        resolve(item);
      }else{
        //console.log(`DB Add: ${JSON.stringify(query)} does NOT exist`);
        resolve(false);
      }
    })
  });
}



function updateData({db, data, query}){
  // console.log({query,data})
  return new Promise((resolve, reject)=>{
    //* New is breaking something in Production when users login ...
    db.findOneAndUpdate(query, data,{new: true}, function(err, response){
      if (err){
        // console.log('error', 'Directory Database Update Error', {data, err});
        reject(false);
   
      } else {
        
        if(response){
          resolve(response._doc);
        }else{
          resolve(true)
        }
 
      }
    });
  }) //Close Promise
};

function newItem({db, data, query}){
  // console.log('add new item')
  return new Promise((resolve, reject)=>{
    let d = new db(data);
    d.save(function(err, response){
      if(err){
        console.log(`DB Error: Adding ${JSON.stringify(query)} to database`)
        console.log(err);
        // console.log(data);
        //console.log(data.document_statuses[0].DocumentStatus[0])
        reject(false);
      } else {
        // console.log('new',response)
        resolve(response);
    
      }
    })
  })
};


module.exports.return = async function ({query, db,sort, select}){

  return new Promise((resolve, reject)=>{
    db.find(query, function(err, data){
      if(err){
        reject(`DB Error: Returning ${JSON.stringify} from ${db.collection}`)
      }else {
        // console.log(`DB Success: Returning ${JSON.stringify} from ${db.collection}`)
        resolve(data);
      }
    }).sort(sort).select(select);
  })
}

module.exports.returnSingle = async function ({query, db}){

  return new Promise((resolve, reject)=>{
    db.findOne(query, function(err, data){
      if(err){
        reject(`DB Error: Returning ${JSON.stringify} from ${db.collection}`)
      }else {
        // console.log(`DB Success: Returning ${JSON.stringify} from ${db.collection}`)
        resolve(data);
      }
    });
  })
}


module.exports.deleteMany = async function({query, db,log_changes, user, origin}){
  let oldData = await this.return({db, query});
  if(!oldData)return
  history.log_delete_many({db,user,log_changes,oldData,origin})

  return new Promise((resolve,reject)=>{
    // console.log({query})
    db.deleteMany(query, function(err,res){
      // console.log({err,res})
      if(err){
        reject(`DB Error Deleting from ${db.collection}`)
      }else{
        resolve(res);
      }
    })
  })
}
module.exports.deleteOne = async function({query, db,log_changes, user, origin}){
  let oldData = await this.returnSingle({db, query});
  if(!oldData)return
  history.log_delete({db,user,log_changes,oldData,origin})

  return new Promise((resolve,reject)=>{
    db.deleteOne(query, function(err,res){
      // console.log({err,res})
      if(err){
        reject(`DB Error Deleting from ${db.collection}`)
      }else{
        resolve(res);
      }
    })
  })
}