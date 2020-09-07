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

//create user
_publics.createUser = (user) => {
    var user = JSON.parse(user);

    var firstname = user.firstname;
    var lastname = user.lastname;
    var pseudo = user.pseudo;
    var age = user.age;
    var email = user.email;
    var telephone = user.telephone;
    var birth_date = new Date(user.birth_date); 
    var sexe = user.sexe;
    var photo = user.photo;
    var password = user.password; 
    var civility = user.civility;
    var country = user.country;
    var city = user.city;
    var zip_code = user.zip_code;    
    var tokens=user.tokens;
    var enabled= user.enabled;
    var role = user.role;
  
    return new Promise((resolve, reject) => {
      var message = {};
      var sql = "INSERT INTO user SET ? ";
      const newuser = {firstname: firstname, lastname: lastname, email: email,
         age: age, pseudo: pseudo, password: password, civility: civility, 
         sexe:sexe, city:city,  telephone:telephone,birth_date:birth_date,zip_code:zip_code,photo:photo,country:country,enabled:enabled,role:role};
      pool.getConnection(function(err,connection){ 
        if (err) {  
        reject(err);
        }
        connection.query(sql, newuser, function (err, result) {
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



  //login
_publics.login = (user) => {

  var userDetails = {};
  var user0 = JSON.parse(user);
  var email = user0.email;
  var password = user0.password;

  return new Promise((resolve, reject) => {

    var sql = "select * FROM user m  where m.email=? and m.password=? ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [email, password], function (err, users) {
        connection.release(); 
        var users = JSON.stringify(users);
        users = JSON.parse(users);
      if (err) {
        userDetails = {
          status: 500
        };
      } else if (users[0] === undefined || (users[0].password !== password)) {
        userDetails = {
          status: 403
        };
      } else {
        userDetails = {
          user: users[0],
          status: 200,
        };
      }
      return resolve(JSON.stringify(userDetails));
    });
  });
  });
};

//get user by ID
_publics.getUserById = (req) => {
  var idUser=req.query.id;
  return new Promise((resolve, reject) => {
    var sql = "select * FROM user where id=?";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql,[idUser],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(JSON.stringify(result[0]));
    });
  });
});
};



//get user by Email
_publics.getUserByEmail = (req) => {
  var emailUser = req.query.email;
  return new Promise((resolve, reject) => {
    var sql = "select * FROM user where email=?";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [emailUser], function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(JSON.stringify(result[0]));
    });
  });
});
};




//get users count
_publics.getUsersCount= () => { 
  return new Promise((resolve, reject) => {  
    var sql ="select count(*) as number from user where role is null ";
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

//get User's information
_publics.getUserInformation=(req)=>{
  var id=req.query.id;
  return new Promise((resolve,reject)=>{
    var sql=" select u.firstname,u.lastname,u.birth_date as DateOfBirth,u.city as location,u.photo ,(select SUM(t.cost) from transaction t  where t.type=? and t.id_user=?) as AllTimeEarned,(select count(t.id) from transaction t  where t.type=? and t.id_user=?) as numberOfClaims from user u where u.id=?;";
      pool.getConnection(function(err,connection){
        if(err)reject(err);
        connection.query(sql,["in",id,"in",id,id],function(err,res){
          connection.release();
          if(err) {reject(err);}
          return(resolve(res));
        })
      })
  })
}

//get all users 
_publics.getAllUsers = () => {

  return new Promise((resolve, reject) => {
    var sql = "select * FROM user where role is null order by id desc";

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

//get verified users:
_publics.getVerifiedUsers=()=>{
  return new Promise((resolve,reject)=>{
    var sql="select * from user where verified=? order by id desc";
    pool.getConnection(function(err,connection){
      if(err){
        reject(err);
      }
      connection.query(sql ,["1"], function(err,result){
        connection.release();
      if(err) reject(err);
      return resolve(JSON.stringify(result));
      });
    });
  });
};

//get pending users :
_publics.getPendingUsers=()=>{
  return new Promise((resolve,reject)=>{
    var sql="select * from user where verified=? order by id desc";
    pool.getConnection(function(err,connection){
      if(err){
        reject(err);
      }
      connection.query(sql,["0"], function(err,result){
        connection.release();
      if(err) reject(err);
      return resolve(JSON.stringify(result));
      });
    });
  });
};

//get enabled users 
_publics.getEnabledUsers=()=>{
  return new Promise((resolve,reject)=>{
    var sql="select * from user where enabled=? order by id desc";
    pool.getConnection(function(err,connection){
      if(err){
        reject(err);
      }
      connection.query(sql,["1"], function(err,result){
        connection.release();
      if(err) reject(err);
      return resolve(JSON.stringify(result));
      });
    });
  });
};

//get disabled users
_publics.getDisabledUsers=()=>{
  return new Promise((resolve,reject)=>{
    var sql="select * from user where enabled=? order by id desc";
    pool.getConnection(function(err,connection){
      if(err){
        reject(err);
      }
      connection.query(sql,["0"], function(err,result){
        connection.release();
      if(err) reject(err);
      return resolve(JSON.stringify(result));
      });
    });
  });
};

//verifyUser
_publics.verifyUser=(req)=>{
  var id=req.query.id;
  var msg="";
  return new Promise((resolve,reject)=>{
    var sql="update user set verified='1' where id=?";
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



//enable User
_publics.enableUser=(req)=>{
  var id=req.query.id;
  var msg="";
  return new Promise((resolve,reject)=>{
    var sql="update user set enabled='1' where id=?";
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

//disable User
_publics.disableUser=(req)=>{
  var id=req.query.id;
  var msg="";
  return new Promise((resolve,reject)=>{
    var sql="update user set enabled='0' where id=?";
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

//search users 
_publics.searchUsers= (req) => {
  var search = req.query.search;
  return new Promise((resolve, reject) => {
    var input = search.toLowerCase();
    var sql = "";
    var condition="( (CONCAT(LOWER(firstname), ' ', LOWER(lastname)) like "+"'%" + input + "%'"+") or (LOWER(email) like "+"'%" + input + "%'"+") or (LOWER(full_name) like "+"'%" + input + "%'"+")  )"
    sql = "select m.* FROM user m where "+condition;
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};

//delete user
_publics.deleteUser = (req) => {
  var id = req.query.id;
  console.log(id);
  return new Promise((resolve, reject) => {
    var sql = "DELETE FROM user WHERE id=?";
    var msg = "";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id], function (err, result) {
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
});
};

//update user password
_publics.updateUserPassword = (req,password) => {
  var id=req.query.id;
  return new Promise((resolve, reject) => {
    var sql = "update user set password=? where id=?";
    var msg = "";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql,[password,id], function (err, result) {
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

//update user
 _publics.updateUserByEmail = (req, user) => {
  var user = JSON.parse(user);
   
  var firstname = user.firstname;
  var lastname = user.lastname;
  /* var pseudo = user.pseudo;
  var age = user.age; */
  var email = user.email;
  /* var telephone = user.telephone; */
  var birth_date = new Date(user.birth_date); 
  /* var sexe = user.sexe;
  var photo = user.photo;
  var civility = user.civility;
  var country = user.country;
  var city = user.city;
  var zip_code = user.zip_code;    
  var tokens=user.tokens;
  var enabled= user.enabled;
  var role = user.role; */

  var email = req.query.email;
  return new Promise((resolve, reject) => {
    var msg = "";
    var sql = "UPDATE user SET firstname=?,lastname=?,birth_date=?  WHERE email=?";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [firstname,lastname,birth_date,email], function (err, result) {
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
});
}; 



module.exports = _publics;




  