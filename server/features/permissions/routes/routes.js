const path = require('path');
const view = path.join(__dirname, '../view');
const express = require('express');
const router = express.Router({mergeParams: true});
module.exports = router;


const Permissions = require("../model/templates");


router.use('/api/:project_id/permissions',Permissions.expressMiddleware,Permissions.route);