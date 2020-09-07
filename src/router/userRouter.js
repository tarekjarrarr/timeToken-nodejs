'use strict';

const router = require('express').Router();

const userController=require('../controller/userController');
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



//create user 
router.post('/createUser',(req, res, next)=>
userController.getRawBody(req)
.then(user=>{
    return userController.createUser(user)
})
.then(message=>{
        res.send({"userId":res.payload.userId});    
})
.catch(next));





//login 
router.post('/login', (req, res, next) => 
userController.getRawBody(req)
.then(user=>{
    return userController.login(user);
})
.then(response=>{
  console.log("response "+response);  
  //to change in angular
    res.payload.member=JSON.parse(response).user;
    res.payload.status=JSON.parse(response).status;
    res.send(res.payload);
})
.catch(next));

//delete user
router.post('/deleteUser',urlencodedParser, (req, res, next) => 
userController.deleteUser(req)
.then(msg=>{
    res.send(msg);
})
.catch(next));

//get all users 
router.get('/getAllUsers',urlencodedParser, (req, res, next) => 
userController.getAllUsers()
.then(user=>{
  res.send(user);
})
.catch(next));

//getUserCount 
router.get('/getUserCount',urlencodedParser,(req,res,next)=>
userController.getUsersCount()
.then(result=>{
  res.send(result);
})
.catch(next));

//get User Information
router.get('/getUserInformation',urlencodedParser,(req,res,next)=>
userController.getUserInformation(req)
.then(result=>{
  res.send(result);
})
.catch(next));

//get user by ID
router.get('/getUserById',urlencodedParser, (req, res, next) => 
userController.getUserById(req)
.then(user=>{
  res.send(user);
  return userController.getUserInformation(req);
})
.catch(next));

//get  verified users 

router.get('/getVerifiedUsers',urlencodedParser, (req, res, next) => 
userController.getVerifiedUsers()
.then(user=>{
  res.send(user);
})
.catch(next));

//get pending users 
router.get('/getPendingUsers',urlencodedParser, (req, res, next) => 
userController.getPendingUsers()
.then(user=>{
  res.send(user);
})
.catch(next));

//get enabled users 
router.get('/getEnabledUsers',urlencodedParser, (req, res, next) => 
userController.getPendingUsers()
.then(user=>{
  res.send(user);
})
.catch(next));

//get disabled users 
router.get('/getDisabledUsers',urlencodedParser, (req, res, next) => 
userController.getDisabledUsers()
.then(user=>{
  res.send(user);
})
.catch(next));

//verify user
router.post('/verifyUser',urlencodedParser,(req, res, next)=>
userController.verifyUser(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//unverify user
router.post('/unverifyUser',urlencodedParser,(req, res, next)=>
userController.unverifyUser(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//enable User
router.post('/enableUser',urlencodedParser,(req, res, next)=>
userController.enableUser(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//disable user 
router.post('/disableUser',urlencodedParser,(req, res, next)=>
userController.disableUser(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//search users 
router.get('/searchUsers',urlencodedParser, (req, res, next) => 
userController.searchUsers(req)
.then(user=>{
  res.send(user);
})
.catch(next));



//get user by email
router.get('/getUserByEmail',urlencodedParser, (req, res, next) => 
userController.getUserByEmail(req)
.then(user=>{
  res.send(user);
  return userController.getUserByEmail(req)
})
.catch(next));

//update user password 
router.post('/updateUserPassword',(req, res, next)=>
userController.getRawBody(req)
.then(password=>{
    return userController.updateUserPassword(req.query.id,password)
})
.then(msg=>{
    res.send(msg);
})
.catch(next));

//update user photo 
router.post('/updateUserPhoto',(req, res, next)=>
userController.getRawBody(req)
.then(photo=>{
    return userController.updateUserPhoto(req.query.id,photo)
})
.then(msg=>{
    res.send(msg);
})
.catch(next));

//update user password 
router.post('/updateUserByEmail',(req, res, next)=>
userController.getRawBody(req)
.then(user=>{
    return userController.updateUserByEmail(req,user)
})
.then(msg=>{
    res.send(msg);
})
.catch(next));

//get user counts
router.get('/getUsersCount',(req, res, next) => 
userController.getUsersCount()
.then(usersNumber=>{
  res.send(usersNumber);
})
.catch(next));









module.exports = router;