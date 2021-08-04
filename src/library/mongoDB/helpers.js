const dbHelper = require('./dbHelper');

module.exports.helpers = ({db, log_changes})=>{
  console.log({db, log_changes})
  return {
    return: async ({query, select, sort})=>{
      console.log({query})
      let mongores =  await dbHelper.return({db, query, select, sort});
      return mongores
    },
    returnSingle: async ({query, select})=>{
      return await dbHelper.returnSingle({db, query, select})
    },
    add: async ({query, data, origin, user})=>{
      return await dbHelper.add({db, query, data, log_changes, origin, user})
    },
    addUnique: async(newData, log_changes, origin, user)=>{
      return await dbHelper.add({db, data: newData, query: {unique: true},log_changes, origin, user})
    },
    removeOne: async ({query, log_changes, origin, user})=>{
      return await dbHelper.deleteOne({query, db, log_changes, origin, user})
    },
    removeMany: async({query, origin, user})=>{
      return await dbHelper.deleteMany({query, db, log_changes, origin, user})
    }
  }
}