'use strict';

const _publics = {};
var config = require('../config');
var getRawBody = require('raw-body');
var con = config.con;
var url = `http://localhost:3002`;
//var url = `/`;
var pool=config.pool;
const router=require('../router/router');


_publics.getRawBody = (req) => {
    return new Promise((resolve, reject) => {
      getRawBody(req, {
        length: req.headers['content-length'],
        limit: '1mb',
      }, function (err, string) {
        if (err) return next(err)
        req.text = string;
        return resolve(req.text);
      })
    });
  };

//create Company 
_publics.createCompany=(company)=>{
    var company=JSON.parse(company);
    var name =company.name;
    var country=company.country;
    var zip_code =company.zip_code;
    var city=company.city;
    var adress=company.adress;
    var country_code=company.country_code;
    var phone=company.phone;
    var logo=company.logo;
    var category=company.category;
    var code=company.code;
    var enabled=company.enabled;
    var verified=company.verified;

    return new Promise((resolve,reject)=>{
        var message={};
        var sql ="INSERT INTO company SET ?";
        const newCompany={
            name:name ,
            country:country,
            zip_code:zip_code,
            city:city,
            adress:adress,
            country_code:country_code,
            phone:phone,
            logo:logo,
            category:category,
            code:code,
            enabled:enabled,
            verified:verified            
        };
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,newCompany,function(err,result){
                connection.release();
                if(err){
                    message={msg:"failure"};
                    reject(err);
                }
                else{
                    message={msg:"success",ID:result.insertId};
                }
                return resolve(message);
            });
        });
    });
};

//get all companies
_publics.getAllCompanies=()=>{
    return new Promise((resolve,reject)=>{
        var sql ="Select * from company order by id asc" ;

        pool.getConnection(function(err,connection){ 
            if (err) {  
            reject(err);
            }
            connection.query(sql, function (err, result) {
              connection.release(); 
            if (err) reject(err);
            return resolve(JSON.stringify(result));
            });
        });
    });
};
 
//get company by Id
_publics.getCompanyById=(req)=>{
    var id=req.query.id;
    return new Promise((resolve,reject)=>{
        var sql ="Select * from company where id=? order by id asc" ;
        pool.getConnection(function(err,connection){ 
            if (err) {  
            reject(err);
            }
            connection.query(sql,[id], function (err, result) {
              connection.release(); 
            if (err) reject(err);
            if(result.length===0){
                reject("this ID does not exist");
            }else{
            return resolve(JSON.stringify(result[0]));}
            });
        });
    });
};

//getCompanyByName
_publics.getCompanyByName=(req)=>{
  var name=req.query.name;
  return new Promise((resolve,reject)=>{
      var sql ="Select * from company where name=? order by id asc" ;

      pool.getConnection(function(err,connection){ 
          if (err) {  
          reject(err);
          }
          connection.query(sql,[name], function (err, result) {
            connection.release(); 
          if (err) reject(err);
          if(result.length===0){

              reject("this name does not exist");
          }else{
          return resolve(JSON.stringify(result[0]));}
          });
      });
  });
};

//get verified companies 
_publics.getVerifiedCompanies=()=>{
    return new Promise((resolve,reject)=>{
        var sql="select * from company where verified=? order by id asc"

        pool.getConnection(function(err,connection){ 
            if (err) {  
            reject(err);
            }
            connection.query(sql,['1'], function (err, result) {
              connection.release(); 
            if (err) reject(err);
            return resolve(JSON.stringify(result));
            });
        });        
    });
};

//get Pending companies 
_publics.getPendingCompanies=()=>{
    return new Promise((resolve,reject)=>{
        var sql="select * from company where verified=? order by id asc"

        pool.getConnection(function(err,connection){ 
            if (err) {  
            reject(err);
            }
            connection.query(sql,['0'], function (err, result) {
              connection.release(); 
            if (err) reject(err);
            return resolve(JSON.stringify(result));
            });
        });        
    });
};

//get enabled companies 
_publics.getEnabledCompanies=()=>{
    return new Promise((resolve,reject)=>{
        var sql="select * from company where enabled=? order by id asc"

        pool.getConnection(function(err,connection){ 
            if (err) {  
            reject(err);
            }
            connection.query(sql,['1'], function (err, result) {
              connection.release(); 
            if (err) reject(err);
            return resolve(JSON.stringify(result));
            });
        });        
    });
};

//get disabled companies 
_publics.getDisabledCompanies=()=>{
    return new Promise((resolve,reject)=>{
        var sql="select * from company where enabled=? order by id asc"

        pool.getConnection(function(err,connection){ 
            if (err) {  
            reject(err);
            }
            connection.query(sql,['0'], function (err, result) {
              connection.release(); 
            if (err) reject(err);
            return resolve(JSON.stringify(result));
            });
        });        
    });
};

//verify company
_publics.verifyCompany=(req)=>{
    var id=req.query.id;
    var msg="";
    return new Promise((resolve,reject)=>{
      var sql="update company set verified='1' where id=?";
      pool.getConnection(function(err,connection){
        if(err){
          reject(err);
        }
        connection.query(sql,[id], function(err,result){
          connection.release();
          if (err) {
            msg = "failure";
            reject(err);
          } else {
            msg = "success";
          }
          return resolve(msg);
        });
      });
    })
  };

//enable Company
_publics.enableCompany=(req)=>{
    var id=req.query.id;
    var msg="";
    return new Promise((resolve,reject)=>{
      var sql="update company set enabled='1' where id=?";
      pool.getConnection(function(err,connection){
        if(err){
          reject(err);
        }
        connection.query(sql,[id], function(err,result){
          connection.release();
          if (err) {
            msg = "failure";
            reject(err);
          } else {
            msg = "success";
          }
          return resolve(msg);
        });
      });
    })
  };
  
  //disable Company
  _publics.disableCompany=(req)=>{
    var id=req.query.id;
    var msg="";
    return new Promise((resolve,reject)=>{
      var sql="update company set enabled='0' where id=?";
      pool.getConnection(function(err,connection){
        if(err){
          reject(err);
        }
        connection.query(sql,[id], function(err,result){
          connection.release();
          if (err) {
            msg = "failure";
            reject(err);
          } else {
            msg = "success";
          }
          return resolve(msg);
        });
      });
    })
  };

  //update company 
  _publics.updateCompany = (req,company) => { 
    var company=JSON.parse(company);

    var name =company.name;
    var country=company.country;
    var zip_code =company.zip_code;
    var city=company.city;
    var adress=company.adress;
    var country_code=company.country_code;
    var phone=company.phone;
    var logo=company.logo;
    var category=company.category;

    var id=req.query.id;

      return new Promise((resolve, reject) => {  
               var msg="";  
               var sql = "update company set name=?,country=?,zip_code=?,city=?,adress=?,country_code=?,phone=?,logo=?,category=? where id=?";
               pool.getConnection(function(err,connection){ 
                if (err) {  
                reject(err);
                }
                connection.query(sql,[name,country,zip_code,city,adress,country_code,phone,logo,category,id], function (err, result) {
                  connection.release();
                if (err){
                  msg="failure";
                  reject(err);
                }else{
                  msg="success";
                }
               return resolve(msg);
               });
             }); 
            });   
   };  

//delete company 
_publics.deleteCompany=(req)=>{
    var id=req.query.id;
    return new Promise((resolve,reject)=>{
        var msg=""; 
             var sql = "delete from company where id=?";
             pool.getConnection(function(err,connection){ 
              if (err) {  
              reject(err);
              }
              connection.query(sql,[id], function (err, result) {
                connection.release();
              if (err){
                msg="failure";
              }else{
                msg="success";
              }
             return resolve(msg);
             });
           });    
        });
   };

   //enable company
   _publics.enableCompany=(req)=>{
    var id=req.query.id;
    var msg="";
    return new Promise((resolve,reject)=>{
      var sql="update company set enabled='1' where id=?";
      pool.getConnection(function(err,connection){
        if(err){
          reject(err);
        }
        connection.query(sql,[id], function(err,result){
          connection.release();
          if (err) {
            msg = "failure";
            reject(err);
          } else {
            msg = "success";
          }
          return resolve(msg);
        });
      });
    })
  };
  
 //disable company
 _publics.disableCompany=(req)=>{
  var id=req.query.id;
  var msg="";
  return new Promise((resolve,reject)=>{
    var sql="update company set enabled='0' where id=?";
    pool.getConnection(function(err,connection){
      if(err){
        reject(err);
      }
      connection.query(sql,[id], function(err,result){
        connection.release();
        if (err) {
          msg = "failure";
          reject(err);
        } else {
          msg = "success";
        }
        return resolve(msg);
      });
    });
  })
};

//get Companies count
_publics.getCompaniesCount= () => { 
  return new Promise((resolve, reject) => {  
    var sql ="select count(*) as number from company";
        pool.getConnection(function(err,connection){ 
        if (err) {  
        reject(err);
        }
        connection.query(sql,function (err, res) {
          connection.release(); 
         if (err){
           reject(err);
         }
         return resolve(res[0]);
        });
      });
  });
}

   module.exports = _publics;