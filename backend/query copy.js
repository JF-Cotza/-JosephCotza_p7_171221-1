//const mysql = require('mysql2/promise');
const mysql=require('mariadb')
const config= require('./routes/connect');
let db=config.db;


async function query(sql, params) {
  //const connection = await mysql.createConnection(db);
  const connection = await mysql.createPool(db);
  //const [results, ] = await connection.execute(sql, params);

  //return results;
connection.getConnection()
    .then(conn => {
    
      conn.query(sql, params)
        .then((rows) => {
          console.log('toto'+rows); //[ {val: 1}, meta: ... ]
          //Table must have been created before 
          // " CREATE TABLE myTable (id int, val varchar(255)) "
          return 'lol';
        })
        .then((res) => {
          console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
      //not connected
    });


}

module.exports=query;