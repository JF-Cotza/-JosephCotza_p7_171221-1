const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const bcrypt=require('bcrypt');


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

exports.addUser1=async (req,res)=>{
  let mail=req.email;
  console.log(mail);
  this.checkExisting(mail)
    .then(user=>{
      console.log('user ',user)
      if(user=='void'){
        console.log('not user')
        this.create1(req)
      }
      else{
        console.log('existing user')
        //window.location.href='http://localhost:8080/'
        //res.redirect('http://localhost:8080');
        return {code:401,message:"l'utilisateur existe déjà"}

        //return res.status(401).json({message:"l'utilisateur existe déjà"});
    
      }
    })
  
  
};

exports.create1= async (req,res)=>{
  await bcrypt.hash(req.password,10).then((hash)=>{crypted=(hash)}).catch((err)=>{console.log(err.message)})

  console.log('create1',req.name, req.firstname, req.email, crypted)

  let sql='INSERT INTO users (users_name, users_firstname ,users_mail, users_password) VALUES (?,?,?,?)'
  let result = await query(sql, [req.name, req.firstname, req.email, crypted]);
  let code=500
  let message = 'Error in creating new user';

  if (result.affectedRows) {
    console.log('if', result.affectedRows )
    code=200
    message = 'User added successfully';
    //return res.status(200).json({'code':code,'message':message});
  }
  console.log('else',result.affectedRows)
  //return res.status(500).json({'code':code,'message':message});
}



let crypted

exports.create= async function(user){
  await bcrypt.hash(user.password,10).then((hash)=>{crypted=(hash)}).catch((err)=>{console.log(err.message)})
  //await this.hashed(user.password)
  //crypted='test'+user.password+'déplentage'
  //console.log('add user ', user.password,' hashed ', crypted)
  
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

//R connexion
exports.connectUser=async function(user){
  console.log(user)
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



/*

*/