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

//create promotion
   _publics.createPromotion = (promotion) => {
    var promotion = JSON.parse(promotion);
    var name = promotion.name;
    var id_company = promotion.id_company;
    var creation_date = new Date();
    var expiration_Date=promotion.expiration_date;
    var cost = promotion.cost;
    var description=promotion.description;
    var image=promotion.image;
    var verified =promotion.verified;

    return new Promise((resolve,reject)=>{
      var message={};
      var sql ="INSERT INTO promotion SET ?";
      const newPromotion={
          name:name,
          id_company:id_company,
          creation_date:creation_date,
          expiration_Date:expiration_Date,
          cost:cost,
          description:description,
          image:image,
          verified:verified
      };
      pool.getConnection(function(err,connection){
          if(err){
              reject(err);
          }
          connection.query(sql,newPromotion,function(err,result){
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

//get all promotions
  _publics.getAllPromotions = () => {
    return new Promise((resolve, reject) => {
      
      var sql="select m.* FROM promotion m  order by id desc";
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

  //get promotions details 
  _publics.getPromotionsDetails=()=>{
    return new Promise((resolve,reject)=>{
      var sql="select p.id as promotion_id ,p.name as promotion_name ,p.image , p.cost,p.description as promotion_description , p.category as promotion_category ,p.verified,c.id as company_id, c.name as company_name ,c.logo,c.category as company_category ,p.creation_date,p.expiration_date from promotion p left join company c on (p.id_company=c.id)"
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

 //get promotion details by  id 
 _publics.getPromotionDetailsById=(req)=>{
  var id=req.query.id
  return new Promise((resolve,reject)=>{
    var sql = "select p.id as promotion_id ,p.name as promotion_name ,p.description as promotion_description, p.image , p.cost , p.category as promotion_category ,p.creation_date,p.last_update_date,p.expiration_date,c.id as company_id, c.name as company_name ,c.logo,c.category as company_category ,c.description as company_description ,p.creation_date from promotion p left join company c on (p.id_company=c.id) where p.id=?"; 
             pool.getConnection(function(err,connection){ 
              if (err) {  
              reject(err);
              }
              connection.query(sql, [id],function (err, result) {
                connection.release();
             if (err) reject(err);
             if(result.length!==0){
              return resolve(JSON.stringify(result[0]));
             }
             else return resolve(null);
             });
            });
  });
};

  //get promotion by  id 
  _publics.getPromotionsById=(req)=>{
    var id=req.query.id
    return new Promise((resolve,reject)=>{
      var sql = "select * FROM promotion where id=?"; 
               pool.getConnection(function(err,connection){ 
                if (err) {  
                reject(err);
                }
                connection.query(sql, [id],function (err, result) {
                  connection.release();
               if (err) reject(err);
               return resolve(JSON.stringify(result[0]));
               });
              });
    });
  };

//get promotions by company id
  _publics.getPromotionsByCompanyId=(req)=>{
    var id_company=req.query.id
    return new Promise((resolve,reject)=>{
      var sql = "select * FROM promotion where id_company=? order by id desc"; 
               pool.getConnection(function(err,connection){ 
                if (err) {  
                reject(err);
                }
                connection.query(sql, [id_company],function (err, result) {
                  connection.release();
               if (err) reject(err);
               return resolve(JSON.stringify(result));
               });
              });
    });
  };

  //update promotion
  _publics.updatePromotion=(req,promotion)=>{
    var promotion=JSON.parse(promotion);
    var name=promotion.name;
    var description=promotion.description;
    var image=promotion.image;
    var cost=promotion.cost;
    var expiration_date=promotion.expiration_Date;
    var id_company=promotion.id_company;
    var id=req.query.id;

    return new Promise((resolve,reject)=>{
      var sql = "update promotion set name=?,description=?,image=?,cost=?,expiration_date=?,id_company=?  where id=?"; 
               pool.getConnection(function(err,connection){ 
                if (err) {  
                reject(err);
                }
                connection.query(sql, [name,description,image,cost,expiration_date,id_company,id],function (err, result) {
                  connection.release();
               if (err) reject(err);
               return resolve(JSON.stringify(result));
               });
              });
    });
  };

  
  _publics.verifyPromotion=(req)=>{
    var message={};
    var id=req.query.id;
    return new Promise((resolve,reject)=>{
        var sql="update promotion set verified=?  where id=?";
        pool.getConnection(function(err,connection){
            if (err) {  
                reject(err);
                }
                connection.query(sql, [1,id],function (err, result) {
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

_publics.deletePromotion=(req)=>{
  var message={};
  var id=req.query.id;
  return new Promise((resolve,reject)=>{
      var sql="delete from promotion where id=?";
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

//get promotions count
_publics.getPromotionsCount= () => { 
  return new Promise((resolve, reject) => {  
    var sql ="select count(*) as number from promotion";
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
