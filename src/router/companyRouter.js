'use strict';

const router = require('express').Router();

const companyController=require('../controller/companyController');
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

//create company 
router.post('/createCompany',urlencodedParser,(req,res,next)=>
companyController.getRawBody(req)
  .then(company => {
      res.payload.company = company;
      return companyController.createCompany(company)
  })
  .then(msg => {
      res.send(msg);
  })
  .catch(next));


//get All companies
router.get('/getAllCompanies', urlencodedParser, (req, res, next) => 
companyController.getAllCompanies()
.then(companies => {
  res.send(companies);
})
.catch(next));

//get company by ID
router.get('/getCompanyById',urlencodedParser,(req, res, next)=>
companyController.getCompanyById(req)
.then(companies => {
  res.send(companies);
})
.catch(next));

//get company by ID
router.get('/getCompanyByName',urlencodedParser,(req, res, next)=>
companyController.getCompanyByName(req)
.then(companies => {
  res.send(companies);
})
.catch(next));



//get verified companies 

router.get('/getVerifiedCompanies',urlencodedParser, (req, res, next) => 
companyController.getVerifiedCompanies(req)
.then(companies => {
  res.send(companies);
})
.catch(next));

//get pending companies 
router.get('/getPendingCompanies',urlencodedParser, (req, res, next) => 
companyController.getPendingCompanies(req)
.then(companies => {
  res.send(companies);
})
.catch(next));

//get enabled companies
router.get('/getEnabledCompanies',urlencodedParser, (req, res, next) => 
companyController.getEnabledCompanies(req)
.then(companies => {
  res.send(companies);
})
.catch(next));

//get disabled companies 
router.get('/getDisabledCompanies',urlencodedParser, (req, res, next) => 
companyController.getDisabledCompanies(req)
.then(companies => {
  res.send(companies);
})
.catch(next));

//verify company
router.post('/verifyCompany',urlencodedParser,(req, res, next)=>
companyController.verifyCompany(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//enable company
router.post('/enableCompany',urlencodedParser,(req, res, next)=>
companyController.enableCompany(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//disable company 
router.post('/disableCompany',urlencodedParser,(req, res, next)=>
companyController.disableCompany(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//delete company 
router.post('/deleteCompany',(req,res,next)=>
companyController.deleteCompany(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//update company
 router.post('/updateCompany',(req,res,next)=>
companyController.getRawBody(req)
.then(company=>{
  return companyController.updateCompany(req,company)
})
.then(msg=>{
  res.send(msg);
})
.catch(next)); 

//enable company
router.post('/enableCompany',urlencodedParser,(req, res, next)=>
companyController.enableCompany(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//disable company
router.post('/disableCompany',urlencodedParser,(req, res, next)=>
companyController.disableCompany(req)
.then(msg=>{
  res.send(msg);
})
.catch(next));

//get companies counts
router.get('/getCompaniesCount',(req, res, next) => 
companyController.getCompaniesCount()
.then(number=>{
  res.send(number);
})
.catch(next));




module.exports = router;