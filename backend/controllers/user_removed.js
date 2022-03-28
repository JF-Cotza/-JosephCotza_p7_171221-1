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