//modules express
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');

//modules créés
const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const connect = require('./connect');

//variables globales
let token=connect.token
let crypted

//C pour ajouter un utilisateur
//C-A1)on vérifie si l'email est déjà utilisée
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
     console.log("l'utilisateur peut être créé", data)
     next()
   }
   else{
     console.log('check data', data)
     return res.status(401).json({message:'email déjà utilisé'})
   }
};

//c-A2) Appelée par la route addUser pour ajouter l'utilisateur
exports.addUser=async function(req,res,next){
  console.log('add user', req.body);
  let user=req.body
  
  
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

//R connexion
//R-C1
exports.connectUser=async function(req,res,next){
  console.log('connectUset async', req.body)
  let user=req.body;
  let mail=user.email;

  const rows = await query(
    `SELECT * FROM users WHERE users_mail='${mail}'`
      );
  const check = helper.emptyOrRows(rows);
  
  if(check==''){
    console.log('pas de data', user)
    return res.status(500).json({message:"l'utililisateur n'existe pas"})
  }
  if(check!=''){
    req.body.check=check;
    next()
  }
}

//R-C2 verification du mot de passe
exports.pswComparaison=async function(req, res, next){
  console.log('psw comparaison ',req.body)
  let user=req.body;
  let checked=user.check[0]
  console.log('user password:',user.password,' checked  password: ', checked.users_password)
 
  bcrypt.compare(user.password, checked.users_password) // attention à l'ordre !
    .then(function(bcryptResult){
      if(!bcryptResult){
        console.log('mot de passe erroné', bcryptResult)
        return res.status(401).json({message:'mot de passe erroné'})
      }
      else{
        console.log('mot de passe confirmé')
        next()      
      } 
    })
    .catch(function(error){
      return res.status(500).json(error)
    })
}

//R-C3 confirmation que l'utilisateur est reconnu, envoi du token
exports.confirmUser=async function(req,res,next){
    console.log('R-C3 : des data',req.body)
    let user=req.body.check[0]

    let tok=await jwt.sign({userId:user.users_id+' '+user.users_mail},token.value ,{expiresIn:token.end})
    console.log('R-c3 token', tok)
    res.status(200).json({message:'user reconnu',id:tok, author:user.users_id, authorStatus:user})
}

//R-P1 
exports.getMyProfile=async function(req,res,next){
  console.log('get1-mail','headers',req.headers, 'query', req.headers, 'body', req.body)
  const checkToken=jwt.verify(req.headers.authorization.split(' ')[1],token.value).userId;
  let split=checkToken.split(' ')
  console.log('get1',checkToken,'split', split);
  
  let email=split[1];
  let id=split[0]

  const rows = await query(
    `SELECT * FROM users WHERE users_mail='${email}' AND users_id=`+id //attention, ne pas oublier les '' car sinon, il y a un bug avec @
  );
  const data = helper.emptyOrRows(rows);

  

  if(data){
    console.log('profile : ', data)
    return res.status(200).json({'data':data})
  }
  else{
    return res.status(500).json({error})
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