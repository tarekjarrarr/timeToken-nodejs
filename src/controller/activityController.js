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

  _publics.createActivity=(activity)=>{
    var activity=JSON.parse(activity);
    //var name=activity.name;
    var id_user=activity.id_user;
    var image=activity.image;
    var date=new Date();
    //var value=activity.value;
    //var category=activity.category;


    return new Promise((resolve,reject)=>{
        var message={};
        var sql ="INSERT INTO activity SET ?";
        const newActivity={
            id_user:id_user,
            image:image,
            date:date,          
        };
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,newActivity,function(err,result){
                connection.release();
                if(err){
                    message={msg:"failure"};
                    reject(err);
                }
                else{
                    message={msg:"success",activityID:result.insertId};
                }
                return resolve(message);
            });
        });
    });
};



_publics.getAllActivities = () => {
    return new Promise((resolve, reject) => {
      
      var sql="select a.* FROM activity a  order by id asc";
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

_publics.getActivitiesDetails=()=>{
    return new Promise((resolve,reject)=>{
        var sql="select u.id,u.firstname,u.lastname,a.* from activity a left join user u on (a.id_user=u.id)";
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,function(err,result){
                connection.release(); 
                if (err) reject(err);
                 return resolve(JSON.stringify(result));
            });
        });
    });
};




_publics.getActivity = (id) => { 
    return new Promise((resolve, reject) => {  
      var msg="";
      var sql = "select * from activity where id=?";
      pool.getConnection(function(err,connection){ 
       if (err) {  
       reject(err);
       }
       connection.query(sql,[id], function (err, result) {
         connection.release(); 
       if (err){
         reject(err);
         return;
       } 
      return resolve(result[0]);
     });
   });   
  }); 
  };
  

_publics.getActivityById=(req)=>{
    var id=req.query.id;
    return new Promise((resolve,reject)=>{
        var sql="select * from activity where id=? order by id asc"
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,[id],function(err,result){
                connection.release();
            if(err) reject (err);
            if(result.length!==0){return resolve(JSON.stringify(result[0]));}
            else return resolve(null);
            });
        });
    });
};

_publics.getActivityDetailsById=(req)=>{
    var id=req.query.id;
    return new Promise((resolve,reject)=>{
        var sql="select u.id,u.firstname,u.lastname,a.* from activity a left join user u on (a.id_user=u.id) where u.id=?"
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,[id],function(err,result){
                connection.release();
            if(err) reject (err);
            if(result.length!==0){return resolve(JSON.stringify(result[0]));}
            else return resolve(null);
            });
        });
    });
};




_publics.getActivityByCategory=(req)=>{
    id=req.query.category;
    return new Promise((resolve,reject)=>{
        var sql="select * from activity where category=? order by id asc"
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
            }
            connection.query(sql,function(err,result){
                connection.release();
            if(err) reject (err);
            return resolve(JSON.stringify(result));
            });
        });
    });
};
_publics.updateActivity=(req,activity)=>{
    var activity=JSON.parse(activity);
    var name=activity.name;
    var id_user=activity.id_user;
    var image=activity.image;
    var date=activity.date;
    var value=activity.value;
    var category=activity.category;
    var verified=activity.verified;
    var id=req.query.id;

    return new Promise((resolve,reject)=>{
    var message={};
      var sql = "update activity set name=?,id_user=?,image=?,date=?,value=?,category=?,verified=? where id=?"; 
               pool.getConnection(function(err,connection){ 
                if (err) {  
                reject(err);
                }
                connection.query(sql, [name,id_user,image,date,value,category,verified,id],function (err, result) {
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

_publics.verifyActivity=(details)=>{
    var details=JSON.parse(details);
    var id=details.id;
    var name=details.name;
    var category=details.category;
    var value=details.value;
    return new Promise((resolve,reject)=>{
        var message={};
        var sql = "update activity set verified=?,name=?,category=?,value=? where id=?"; 
                 pool.getConnection(function(err,connection){ 
                    if (err) {  
                        reject(err);
                        }
                        connection.query(sql, ['1',name,category,value,id],function (err, result) {
                          connection.release();
                          if(err){
                            message={msg:"failure",activityId:id};
                            reject(err);
                            }
                            else{
                                message={msg:"success",activityId:id};
                            }
                            return resolve(message);
                        });
                 });
                }); 
}; 

_publics.deleteActivity=(req)=>{
    var message={};
    var id=req.query.id;
    return new Promise((resolve,reject)=>{
        var sql="delete from activity where id=?";
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

//get activities count
_publics.getActivitiesCount= () => { 
    return new Promise((resolve, reject) => {  
      var sql ="select count(*) as number from activity";
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


module.exports = _publics;
