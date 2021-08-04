const path = require('path');
const view = path.join(__dirname, '../view');
const express = require('express');
const router = express.Router({mergeParams: true});
module.exports = router;

const {expressJSONEnvelope} = require('../src/library/mongoDB/expressJSONenvelope')

router.use('/users',require('./features/users/routes/routes'));

router.use('/permissions',expressJSONEnvelope, require('./features/permissions/permissions_model_router'))