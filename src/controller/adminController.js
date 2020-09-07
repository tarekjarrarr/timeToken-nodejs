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


  _publics.createAdmin = (user) => {
    var user = JSON.parse(user);
    var firstname = user.firstname;
    var lastname = user.lastname;
    var email = user.email;
    var password = user.password;
    var telephone = user.telephone;
    var role='admin';
    return new Promise((resolve, reject) => {
      var message = {};
      var sql = "INSERT INTO user SET ? ";
      const newUser = {firstname: firstname, lastname: lastname, email: email, password: password,role:role,telephone:telephone };
      pool.getConnection(function(err,connection){ 
        if (err) {  
        reject(err);
        }
        connection.query(sql, newUser, function (err, result) {
          connection.release(); 
        if (err) {
          message ={msg:"failure"};
          reject(err);
        } else {
          message = {msg:"success",userId:result.insertId};
        }
        return resolve(message);
      });
    });
    });
  };

  _publics.getAllAdmins = () => {
    return new Promise((resolve, reject) => {
      
      var sql="select m.* FROM user m where role='super_admin' or role='admin' order by id desc";
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

  _publics.getAdminByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        var sql ="Select * from user where (role='admin' OR role='super_admin') AND email=? order by id asc" ;

        pool.getConnection(function(err,connection){ 
            if (err) {  
            reject(err);
            }
            connection.query(sql,[email], function (err, result) {
              connection.release(); 
            if (err) reject(err);
            if(result.length!==0){
            return resolve(JSON.stringify(result[0]));}
            });
        });
    });
};

//get admins count
_publics.getAdminsCount= () => { 
  return new Promise((resolve, reject) => {  
    var sql ="select count(*) as number from user where role=? or role=?";
        pool.getConnection(function(err,connection){ 
        if (err) {  
        reject(err);
        }
        connection.query(sql,["admin","super_admin"], function (err, res) {
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
