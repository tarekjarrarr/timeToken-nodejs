'use strict';

const router = require('express').Router();

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

//create transaction
router.post('/createTransaction',(req, res, next)=>
getRawBody(req)
.then(transaction=>{
    return transactionController.createTransaction(transaction)
})
.then(response=>{
        res.send(response);    
})
.catch(next));

 //create Out Transaction
router.post('/createOutTransaction',(req,res,next)=>
  getRawBody(req)
  .then(transaction=>{
      return transactionController.createOutTransaction(transaction)
  })
  .then(response=>{
          res.send(response);    
  })
  .catch(next));


//get all transactions
router.get('/getAllTransactions',urlencodedParser, (req, res, next) =>
    transactionController.getAllTransactions()
    .then(transactions=>{
        res.send(transactions)
    })
    .catch(next));

 //get all transactions by user_id
router.get('/getTransactionsByUserId',urlencodedParser, (req, res, next) =>
    transactionController.getTransactionsByUserId(req)
    .then(transaction=>{
        res.send(transaction)
    })
    .catch(next)); 

//get all in transactions by user_id
router.get('/getInTransactionsByUserId',urlencodedParser, (req, res, next) =>
transactionController.getInTransactionsByUserId(req)
.then(transaction=>{
    res.send(transaction)
})
.catch(next)); 

//get all out transactions by user_id
router.get('/getOutTransactionsByUserId',urlencodedParser, (req, res, next) =>
    transactionController.getOutTransactionsByUserId(req)
    .then(transaction=>{
        res.send(transaction)
    })
    .catch(next)); 


//get transaction by id
router.get('/getTransactionById',urlencodedParser, (req, res, next) =>
    transactionController.getTransactionById(req)
    .then(transaction=>{
        res.send(transaction)
    })
    .catch(next));

//get transactions by type
router.get('/getTransactionsByType',urlencodedParser, (req, res, next) =>
transactionController.getTransactionsByType(req)
.then(transactions=>{
    res.send(transactions)
})
.catch(next));

//update transaction
router.post('/updateTransaction',(req,res,next)=>
transactionController.getRawBody(req)
.then(transaction=>{
  return transactionController.updateTransaction(req,transaction)
})
.then(msg=>{
  res.send(msg);
})
.catch(next));


//delete transaction
router.post('/deleteTransaction', (req, res, next) =>
transactionController.deleteTransaction(req)
.then(msg => {
    res.send(msg);
})
.catch(next));

//get transactions counts
router.get('/getTransactionsCount',(req, res, next) => 
transactionController.getTransactionsCount()
.then(number=>{
  res.send(number);
})
.catch(next));

module.exports = router;