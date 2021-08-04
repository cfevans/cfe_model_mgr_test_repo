const {model} = require('./src/library/mongoDB/model');
const {expressJSONEnvelope} = require("./src/library/mongoDB/expressJSONenvelope")


module.exports.model = model;

module.exports.expressJSONEnvelope = expressJSONEnvelope