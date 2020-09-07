'use strict';

const router = require('express').Router();

const promotionController=require('../controller/promotionController');
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

//create promotion
router.post('/createPromotion',(req, res, next)=>
getRawBody(req)
.then(promotion=>{
    return promotionController.createPromotion(promotion)
})
.then(response=>{
        res.send(response);    
})
.catch(next));

//get all promotions
router.get('/getAllPromotions',urlencodedParser, (req, res, next) =>
    promotionController.getAllPromotions()
    .then(promotions=>{
        res.send(promotions)
    })
    .catch(next));

//get promotions details 
router.get('/getPromotionsDetails',urlencodedParser,(req,res,next)=>
  promotionController.getPromotionsDetails()
  .then(promotions=>{
    res.send(promotions)
  })
.catch(next));

//get promotion by id
router.get('/getPromotionById',urlencodedParser, (req, res, next) =>
    promotionController.getPromotionsById(req)
    .then(promotions=>{
        res.send(promotions)
    })
    .catch(next));

//get promotion details by id
router.get('/getPromotionDetailsById',urlencodedParser,(req,res,next)=>
promotionController.getPromotionDetailsById(req)
.then(promotions=>{
  res.send(promotions)
})
.catch(next));

//get promotions list by company id 
router.get('/getPromotionsByCompanyId',urlencodedParser, (req, res, next) =>
promotionController.getPromotionsByCompanyId(req)
.then(promotions=>{
    res.send(promotions)
})
.catch(next));

//update promotion
router.post('/updatePromotion',(req,res,next)=>
promotionController.getRawBody(req)
.then(promotion=>{
  return promotionController.updatePromotion(req,promotion)
})
.then(msg=>{
  res.send(msg);
})
.catch(next));

//verify Promotion
router.post('/verifyPromotion', (req, res, next) =>{
promotionController.verifyPromotion(req)
.then(msg => {
    res.send(msg);
})
.catch(next)});

//delete Promotion
router.post('/deletePromotion', (req, res, next) =>
promotionController.deletePromotion(req)
.then(msg => {
    res.send(msg);
})
.catch(next));

//get Promotions counts
router.get('/getPromotionsCount',(req, res, next) => 
promotionController.getPromotionsCount()
.then(number=>{
  res.send(number);
})
.catch(next));


module.exports = router;