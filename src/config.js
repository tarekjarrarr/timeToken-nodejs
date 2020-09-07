var mysql = require('mysql');
  module.exports = {
      port: process.env.PORT || 3002,
      env: process.env.NODE_ENV || 'development',
     
  
      /*con : mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "wqtqVSROVpdhilqI00",
          //password: "tbEsNGfMcF8Htt7n",
          //password: "root",
          database: "galate7",
          port: 3306
      }),*/
  
      mediane: 6,
  
  
  
      // Initialize pool
        pool      :    mysql.createPool({
      connectionLimit : 100,
      //host     : 'http://3.134.116.167',
      host     : 'localhost',
      port: 3306,
      user     : 'root',
      password : 'root',
      //password: "tbEsNGfMcF8Htt7n",
      database : 'time_token',
      debug    :  false,
      insecureAuth : true
    }),  
  
    TEST_ID:236,
    ORGANIZATION_TYPE:'global',
    CATEGORY_ID:22
    };
    
    