'use strict';

const router = require('express').Router();

const adminController=require('../controller/adminController');
var config = require('../config');

var options = {
    inflate: true,
    limit: '100kb',
    type: 'application/octet-stream'
  };
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.use(bodyParser.raw(options));
  router.use((req, res, next) => {
    res.payload = {};
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
  });


var getRawBody = require('raw-body');
const { pool } = require('../config');
router.use(bodyParser.urlencoded({extended : true}));

//create admin 
router.post('/register',(req, res, next)=>
getRawBody(req)
.then(user=>{
    return adminController.createAdmin(user)
})
.then(response=>{
        res.send(response);    
})
.catch(next));

//get all admins 
router.get('/getAllAdmins',urlencodedParser, (req, res, next) => 
adminController.getAllAdmins()
.then(users=>{
  res.send(users);
})
.catch(next));

//get admins counts
router.get('/getAdminsCount',(req, res, next) => 
adminController.getAdminsCount()
.then(adminsNumber=>{
  res.send(adminsNumber);
})
.catch(next));


module.exports = router;