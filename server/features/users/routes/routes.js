const express = require('express');
const router = express.Router({mergeParams: true});
module.exports = router;


const Users = require("../model/users")


router.use('/api/:project_id/users',Users.expressMiddleware, Users.route);






