//modules express
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const link = require('../controllers/connect');
const fileSystem=require('fs');  

const linkedKey=link.token.value;

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
  try{
    console.log('connectUser async', req.body)
    let user=req.body;
    let mail=user.email;

    const rows = await query(
      `SELECT * FROM users WHERE users_mail='${mail}'`
        );
    const check = helper.emptyOrRows(rows);
    
      console.log('R-C1 check', check)

    if(check==''){
      //console.log('pas de data', user)
      return res.status(500).json({message:"l'utililisateur n'existe pas"})
    }
    if(check!=''){
      req.body.check=check;
      next()
    }
  }
  catch(err){console.log(err.message)}
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
  //console.log('R-C3 : des data',req.body)
  let user=req.body.check[0]

  let tok=await jwt.sign({userId:user.users_id+' '+user.users_mail},token.value ,{expiresIn:token.end})
  //console.log('R-c3 token', tok)
  res.status(200).json({message:'user reconnu',id:tok, author:user.users_id, authorStatus:user})
}

//R-P1 
exports.getMyProfile=async function(req,res,next){
  console.log('get1-mail','headers',req.headers, 'query', req.headers, 'body', req.body)
  const checkToken=jwt.verify(req.headers.authorization.split(' ')[1],token.value).userId;
  let split=checkToken.split(' ')
  //console.log('get1',checkToken,'split', split);
  
  let email=split[1];
  let id=split[0]

  const rows = await query(
    `SELECT * FROM users WHERE users_mail='${email}' AND users_id=`+id //attention, ne pas oublier les '' car sinon, il y a un bug avec @
  );
  const data = helper.emptyOrRows(rows);

  if(data){
    //console.log('profile : ', data)
    return res.status(200).json({'data':data})
  }
  else{
    return res.status(500).json({error})
  }
}

//U-P mettre à jour un utilisateur
//U-P1 : vérification que l'émail n'est pas utilisé par quelqu'un d'autre => profil unique
exports.uniqueMail=async function(req,res,next) { 
  let page =1;
  let email=req.body.email;
  const checkToken=jwt.verify(req.headers.authorization.split(' ')[1],token.value).userId;
  let id=checkToken.split(' ')[0]

  //console.log('U-P1 checktoken',checkToken)

  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM users WHERE users_mail = '${email}'`
   );
   const data = helper.emptyOrRows(rows);

  //console.log('U-P1',req.body, data,data[0].users_id,id);
    /*
    if(data==''){
      console.log("pas d'id",id)
    }  
    else if(data[0].users_id==id){
      console.log('to next')
    }
    */
    if(data=='' || data[0].users_id==id){
      //console.log('U-P1 next',id)
      req.body.id=id;
      next()
    }
    else{
      //console.log('U-P1 else')
      let message='Un autre utilisateur utilise déjà cette adresse mail'
      return res.status(500).json({error:message})
    }


};

//U-P2 : mise à jour
exports.updatingUser=async function(req,res,next){
  let user=req.body
  console.log('U-P2',user)
  let code=500;
  let message='erreur lors de la mise à jour'

  if(user.psw==''){
    //console.log('pas de mise à jour du mot de passe')
    update = await query(
    `UPDATE users SET users_name='${user.name}', users_firstname='${user.firstname}', users_mail='${user.email}' WHERE users_id=${user.id}`)
  }
  else{
    //console.log('on doit hasher le mot de passe')
    await bcrypt.hash(user.psw,10).then((hash)=>{crypted=(hash)}).catch((err)=>{console.log(err.message)})
    //console.log('U-P2 hash',user.psw,crypted)
    update = await query(
    `UPDATE users SET users_name='${user.name}', users_firstname='${user.firstname}', users_mail='${user.email}', users_password='${crypted}' WHERE users_id=${user.id}`)
  }
  
  const verified = helper.emptyOrRows(update);
  //console.log('U-P2 verified',verified.affectedRows)
  if(verified.affectedRows!=0){
    code=200
    message=verified.affectedRows + ' mises à jours'
    //res.status(code).json({'message':message});   
    next()
  }
  else{
    return res.status(code).json({'message':message})
  }
}

//D-P suppression d'un utilisateur
exports.deleteProfile=async function(req, res, next){
  let token=req.headers.authorization.split(' ')[1];
  let imageName='';
  const checkToken=jwt.verify(token,linkedKey);
  
  const user_id=checkToken.userId.split(' ')[0];
  const user_mail=checkToken.userId.split(' ')[1]
 
  const rows = await query(
    `SELECT * FROM publications WHERE publications_author = '${user_id}'`
   );
   const data = helper.emptyOrRows(rows);

   //console.log('D-P select publications',data)
  
   for(let i=0;i<data.length; i++){
     imageName=data[i].publications_image
     //console.log(data[i].publications_image)
      if(imageName){
        fileSystem.unlink(`./images/${imageName}`,async function(){       
           // on appele la méthode unlink de fs pour supprimer le fichier .unlink('chemin+nom du fichier à supprimer', fonction à éxécuter quand la suppression est effectuée)
           console.log('suppression de : '+imageName+' effectué')
        })
      }
   }
  
  let sql=`DELETE FROM users WHERE users_id=? AND users_mail=?`
  let result = await query(sql,[user_id, user_mail]);

  let code=500;
  let message = 'Error in deleting user';

  //console.log('delete')

  if (result.affectedRows) {
    code=200
    message = 'User deleted successfully';
  }
  return res.status(code).json({'message':message})
}