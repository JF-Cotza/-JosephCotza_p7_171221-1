//modules express
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

//modules créés
const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const connect = require('./connect');

//variables globales
let token=connect.token
let crypted

//C pour ajouter un utilisateur
//1)on vérifie si l'email est déjà utilisée
exports.checkExisting=async function(req,res,next) { 
  let page =1;
  let email=req.body.email
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM users WHERE users_mail = '${email}'`
   );
   const data = helper.emptyOrRows(rows);


  console.log('checkexisting',req.body, data);
   if (data==''){
     console.log("l'utilisateur peut être créé")
     next()
   }
   else{
     return res.status(401).json({message:'email déjà utilisé'})
   }
};



//appelée par la route addUser
exports.addUser=async function(req,res,next){
  console.log('add user', req.body);
  let user=req.body
  let mail=user.email;
  
  await bcrypt.hash(user.password,10).then((hash)=>{crypted=(hash)}).catch((err)=>{console.log(err.message)})
  
  console.log(crypted)
  let sql='INSERT INTO users (users_name, users_firstname ,users_mail, users_password) VALUES (?,?,?,?)'
  let result = await query(sql, [user.name, user.firstname, user.email, crypted]);
  let code=500
  let message = 'Error in creating new user';

  if (result.affectedRows) {
    code=200
    message = 'User added successfully';
  }

  return res.status(code).json({'message':message})
}










//R récupération de tous les utilisateurs
//appelé par la route get allUsers
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
exports.getOneUser=async function(mail){
  console.log('get1-mail',mail)
  const checkToken=jwt.verify(mail,token.value).userId;
  let split=checkToken.split(' ')
  console.log('get1',checkToken,'split', split);
  let email=split[1];
  let id=split[0]

  let page=1
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM users WHERE users_mail='${email}' AND users_id=`+id //attention, ne pas oublier les '' car sinon, il y a un bug avec @
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data
  }
}

//R vérification si l'utilisateur existe déjà


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
    console.log('pas de data', user)
    return this.noData()
  }
  if(check!=''){
    console.log('des data')
    let test=this.pswComparaison(user, check[0])
    if(await test==false){
      return data={code:500,message:'user non reconnu'}
    }
    if(await test==true){
      console.log('check0', check[0])
      let tok=await jwt.sign({userId:check[0].users_id+' '+check[0].users_mail},token.value ,{expiresIn:token.end})
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





exports.searchForReset=async function(req, res, next){
  console.log('searchForReset', req.query)
  
  let page=1
  let email=req.query.email
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM users WHERE users_mail='${email}'` //attention, ne pas oublier les '' car sinon, il y a un bug avec @
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

    console.log('data', data);
    if(data==''){
      console.log('utilisateur non trouvé')
      return res.status(200).json({message:'utilisateur inexistant'})
    }
    else{
      console.log('envoyer le mail')
      return res.status(200).json({message:'un mail vous a été envoyé'})
    }


  /*
  return {
    data
  }
  */
}