//modules créés
const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const connect = require('./connect');


exports.getAllProfile=async function(req,res, next){
  console.log('get all users')

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

exports.getAllPublications=async function(req,res, next){
  console.log('get all publications')

  const rows = await query(`SELECT * FROM publications ORDER BY publications_date DESC`);
  const data = helper.emptyOrRows(rows);
 
  if(data){
    console.log('publication : ', data)
    return res.status(200).json({'data':data})
  }
  else{
    return res.status(500).json({error})
  }
}

exports.updateUser=async function(req,res, next){
  console.log('update user', req.body.users)
  let users=req.body.users
  for(let i=0; i<users.length;i++){
    console.log(i, users[i].name, users[i].value)
    if(users[i].value!='')
    {let update = await query(
    `UPDATE users SET users_status='${users[i].value}' WHERE users_id=${users[i].name}`)

    const verified = helper.emptyOrRows(update);
    }
  }

  let quer=await query('select * from users');
  const list = helper.emptyOrRows(quer);
  console.log(list)

  return res.status(200).json({'message':'utilisateurs mis à jours'})
  
}
