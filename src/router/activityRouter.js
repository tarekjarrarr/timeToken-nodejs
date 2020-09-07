'use strict';

const router = require('express').Router();

const activityController=require('../controller/activityController');
const transactionController=require('../controller/transactionController');

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

//create activity
 router.post('/createActivity',(req, res, next)=>
getRawBody(req)
.then(activity=>{   
    return activityController.createActivity(activity)
})
.then(message=>{
    res.send(message);    
})
.catch(next)); 



//get all activities
router.get('/getAllActivities',urlencodedParser, (req, res, next) =>
    activityController.getAllActivities()
    .then(activities=>{
        res.send(activities)
    })
    .catch(next));

//get activities details
router.get('/getActivitiesDetails',urlencodedParser, (req, res, next) =>
activityController.getActivitiesDetails()
.then(activities=>{
    res.send(activities)
})
.catch(next));

//get activity by id
router.get('/getActivityById',urlencodedParser, (req, res, next) =>
    activityController.getActivityById(req)
    .then(activity=>{
        res.send(activity)
    })
    .catch(next));

//get activity details by id 
router.get('/getActivityDetailsById',urlencodedParser, (req, res, next) =>
    activityController.getActivityDetailsById(req)
    .then(activity=>{
        res.send(activity)
    })
    .catch(next));

//get activities by category
router.get('/getActivitiesByCategory',urlencodedParser, (req, res, next) =>
activityController.getActivitiesByCategory(req)
.then(activities=>{
    res.send(activities)
})
.catch(next));

//update activity
router.post('/updateActivity',(req,res,next)=>
activityController.getRawBody(req)
.then(activity=>{
  return activityController.updateActivity(req,activity)
})
.then(msg=>{
  res.send(msg);
})
.catch(next));

//verify Activity
router.post('/verifyActivity',(req,res,next)=>
activityController.getRawBody(req)
.then(details=>{
  return activityController.verifyActivity(details)
})
.then(message=>{
  console.log(message);
  res.payload.id_activity=message.activityId;
  return activityController.getActivity(message.activityId);
})
.then(activity=>{
  console.log(activity);
  res.payload.id_user=activity.id_user;
  res.payload.cost=activity.value;
  return transactionController.createInTransaction(res.payload.id_user,res.payload.id_activity,res.payload.cost);
})
.then(message=>{
  res.send(message);
})
.catch(next));



//delete activity
router.post('/deleteActivity', (req, res, next) =>
activityController.deleteActivity(req)
.then(msg => {
    res.send(msg);
})
.catch(next));

//get activities counts
router.get('/getActivitiesCount',(req, res, next) => 
activityController.getActivitiesCount()
.then(activitiesNumber=>{
  res.send(activitiesNumber);
})
.catch(next));



module.exports = router;