
const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const connect = require('./connect');
let token=connect.token
let crypted


//C ajouter un utilisateur
exports.addUser=async function(req){
  let mail=req.email;
  let check=await this.checkExisting(mail)
  
  if (check=='void'){
    return this.create(req)
  }
  else{
    return {code:401, message:"l'utilisateur existe déjà"};
  }
};

exports.create= async function(user){
  await bcrypt.hash(user.password,10).then((hash)=>{crypted=(hash)}).catch((err)=>{console.log(err.message)})
  
  let sql='INSERT INTO users (users_name, users_firstname ,users_mail, users_password) VALUES (?,?,?,?)'
  let result = await query(sql, [user.name, user.firstname, user.email, crypted]);
  let code=500
  let message = 'Error in creating new user';

  if (result.affectedRows) {
    code=200
    message = 'User added successfully';
  }

  return {'code':code,'message':message};
}

//R récupération de tous les utilisateurs
exports.getAllUsers=async function(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM users LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

//R récupération d'un seul utilisateur
exports.getOneUser=async function(page=1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    'SELECT * FROM users WHERE users_mail='+mail
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

//R vérification si l'utilisateur existe déjà
exports.checkExisting=async function(mail) {
  let page =1;
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM users WHERE users_mail = '${mail}'`
   );
   const data = helper.emptyOrRows(rows);
  console.log('checkexisting');
   if (data==''){
     return 'void'
   }
   else{
     return {code:401,message:"l'utilisateur existe déjà" }
   }
};


exports.noData=async function(){
  return data={code:401,message:"pas d'utilisateur correspondant"}
}

exports.invalide=async function(){
  return data={code:500,message:"erreur de connexion"}
}

exports.pswComparaison=async function(user, checked){
  return new Promise((resolve, reject)=> {bcrypt.compare(user.password, checked.users_password) // attention à l'ordre !
    .then(function(res){
        resolve(res)         
    })
    .catch(function(error){
      console.log('new promise error', error.message)
      reject(error);
    })
  })             
}

//R connexion
exports.connectUser=async function(user){
  let mail=user.email;
  let page=1;

  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM users WHERE users_mail='${mail}'`
      );
  const check = helper.emptyOrRows(rows);
  const meta = {page};
  
  if(check==''){
    console.log('pas de data')
    return this.noData()
  }
  if(check!=''){
    console.log('des data')
    let test=this.pswComparaison(user, check[0])
    if(await test==false){
      return data={code:500,message:'user non reconnu'}
    }
    if(await test==true){
      let tok=await jwt.sign({userId:check[0].users_id},token.value ,{expiresIn:token.end})
      console.log(tok)
      return data={code:200,message:'user reconnu',id:tok}
    }
  }
}

//U mettre à jour un utilisateur
exports.updateUser=async function(user){
  let mail=user.email;
  console.log('add',user)
  let check=await this.checkExisting(mail)
  console.log('adduser check', check)
  
  if (check=='void' || check[0].users_id==user.id){ 
    
    return this.update(user)
  }
  else{
    return {message:"l'email est utilisé par un autre utilisateur"}
  }
}

exports.update=async function(user){
  console.log('update user ', user)
  
  let sql=`UPDATE users SET users_name=?, users_firstname=?, users_mail=?, users_password=? WHERE users_id=?`
  let result = await query(sql,[user.name, user.firstname,user.email,user.password,user.id]);

  let message = 'Error in creating new user';

  if (result.affectedRows) {
    message = 'User updated successfully';
  }
  return {message};
}

//D suppression d'un utilisateur
exports.update=async function(user){
  console.log('update user ', user)
  
  let sql=`UPDATE users SET users_name=?, users_firstname=?, users_mail=?, users_password=? WHERE users_id=?`
  let result = await query(sql,[user.name, user.firstname,user.email,user.password,user.id]);

  let message = 'Error in creating new user';

  if (result.affectedRows) {
    message = 'User updated successfully';
  }
  return {message};
}

exports.suppressUser=async function(user){
  console.log('update user ', user)
  
  let sql=`DELETE FROM users WHERE users_id=?`
  let result = await query(sql,[user.id]);

  let message = 'Error in deleting user';

  if (result.affectedRows) {
    message = 'User deleted successfully';
  }
  return {message};
}