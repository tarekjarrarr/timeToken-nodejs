'use strict';

const _publics = {};
var config = require('../config');
var getRawBody = require('raw-body');
var con = config.con;
var url = `http://localhost:3002/`;
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


  _publics.createInTransaction=(id_user,id_activity,cost)=>{
    var date=new Date();
    return new Promise((resolve,reject)=>{
        var message={};
        var sql ="INSERT INTO transaction SET ?";
        const newTransaction={
            id_user:id_user,
            id_activity:id_activity,
            date:date,
            cost:cost,
            type:"in",
            description:"Received from TimeToken"
        };
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,newTransaction,function(err,result){
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

_publics.createOutTransaction=(transaction)=>{
     var transaction= JSON.parse(transaction);
     var id_user=transaction.id_user;
     var id_promotion=transaction.id_promotion;
     var cost=transaction.cost; 
     var date=new Date();

     return new Promise((resolve,reject)=>{
         var message={};
         var sql ="INSERT INTO transaction SET ?";
         const newTransaction={
             id_user:id_user,
             id_promotion:id_promotion,
             date:date,
             cost:cost,
             type:"out",
             description:"Claimed Promotion" 
         };
         pool.getConnection(function(err,connection){
             if(err){
                 reject(err);
             }
             connection.query(sql,newTransaction,function(err,result){
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

  _publics.getTransactionsByUserId=(req)=>{
       var id=req.query.id;   
        return new Promise((resolve,reject)=>{
            var sql="select * from transaction where id_user=?"
            pool.getConnection(function(err,connection){
                if(err){
                    reject(err);
                }
                connection.query(sql,[id],function(err,result){
                    connection.release();
                if(err) reject (err);
                return resolve(JSON.stringify(result));
                });
            });
        });
     };

_publics.getInTransactionsByUserId=(req)=>{
var id=req.query.id;   
    return new Promise((resolve,reject)=>{
        var sql="select * from transaction where id_user=? and type=?"
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,[id,"in"],function(err,result){
                connection.release();
            if(err) reject (err);
            return resolve(JSON.stringify(result));
            });
        });
    });
};

_publics.getOutTransactionsByUserId=(req)=>{
var id=req.query.id;   
    return new Promise((resolve,reject)=>{
        var sql="select * from transaction where id_user=? and type=?"
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,[id,"out"],function(err,result){
                connection.release();
            if(err) reject (err);
            return resolve(JSON.stringify(result));
            });
        });
    });
};
  

_publics.getAllTransactions = () => {
    return new Promise((resolve, reject) => {
      
      var sql="select t.* FROM transaction t  order by id asc";
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

_publics.getTransactionById=(req)=>{
    var id=req.query.id;
    return new Promise((resolve,reject)=>{
        var sql="select * from transaction where id=? order by id asc"
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,[id],function(err,result){
                connection.release();
            if(err) reject (err);
            return resolve(JSON.stringify(result[0]));
            });
        });
    });
};



_publics.getTransactionsByType=(req)=>{
    var type=req.query.type;
    return new Promise((resolve,reject)=>{
        var sql="select t.*,u.firstname,u.lastname from transaction t left join user u on (t.id_user=u.id) where t.type=? ORDER BY u.id DESC;"
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,[type],function(err,result){
                connection.release();
            if(err) reject (err);
            return resolve(JSON.stringify(result));
            });
        });
    });
};

_publics.updateTransaction=(req,transaction)=>{
    var transaction=JSON.parse(transaction);
    var id_promotion=transaction.id_promotion;
    var id_activity=transaction.id_activity;
    var date=transaction.date;
    var cost=transaction.cost;
    var type=transaction.type;
    var description=transaction.description;
    var id=req.query.id;

    return new Promise((resolve,reject)=>{
    var message={};
      var sql = "update transaction set id_promotion=?,id_activity=?,date=?,cost=?,type=?,description=? where id=?"; 
               pool.getConnection(function(err,connection){ 
                if (err) {  
                reject(err);
                }
                connection.query(sql, [id_promotion,id_activity,date,cost,type,description,id],function (err, result) {
                  connection.release();
                  if(err){
                    message={msg:"failure"};
                    reject(err);
                    }
                    else{
                        message={msg:"success"};
                    }
                    return resolve(message);
                });
              });
    });
  };

  _publics.deleteTransaction=(req)=>{
    var message={};
    var id=req.query.id;
    return new Promise((resolve,reject)=>{
        var sql="delete from transaction where id=?";
        pool.getConnection(function(err,connection){
            if (err) {  
                reject(err);
                }
                connection.query(sql, [id],function (err, result) {
                  connection.release();
                  if(err){
                    message={msg:"failure"};
                    reject(err);
                    }
                    else{
                        message={msg:"success"};
                    }
                    return resolve(message);
                });
            });
        });
};

//get transactions count
_publics.getTransactionsCount= () => { 
    return new Promise((resolve, reject) => {  
      var sql ="select count(*) as number from transaction";
          pool.getConnection(function(err,connection){ 
          if (err) {  
          reject(err);
          }
          connection.query(sql, function (err, res) {
            connection.release(); 
           if (err){
             reject(err);
           }
           return resolve(res[0]);
          });
        });
    });
  }

module.exports=_publics;
