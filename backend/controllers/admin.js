//modules créés
const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const connect = require('./connect');

exports.getAllProfile=async function(req,res, next){
  console.log('get all users',req.query)

  const rows = await query(`SELECT * FROM users `);
  const data = helper.emptyOrRows(rows);
 
  if(data){
    console.log('profiles : ', data)
    return res.status(200).json({'data':data})
  }
  else{
    return res.status(500).json({error})
  }

}