//modules créés
const query=require('../query');
const helper=require('../helper');
//const config=require('../routes/connect');
//const connect = require('./connect');

/*********************************** récupérations des datas *******************************/
//G-AU
exports.getAllProfile=async function(req,res, next){
  //console.log('get all users')
  const rows = await query(`SELECT * FROM users `);
  const data = helper.emptyOrRows(rows);
 
  if(data){
    //console.log('profiles : ', data)
    return res.status(200).json({'data':data}).end()
  }
  else{
    return res.status(500).json({error}).end()
  }
  
}

//G-AP
exports.getAllPublications=async function(req,res, next){
  //console.log('G-AP, get all publications')

  const rows = await query(`SELECT * FROM publications ORDER BY publications_date DESC`);
  const data = helper.emptyOrRows(rows);
 
  if(data){
    //console.log('G-AP, publication : ', data)
    return res.status(200).json({'data':data}).end()
  }
  else{
    return res.status(500).json({error}).end()
  }

  
}

//G-AC
exports.getAllComments=async function(req,res, next){
  //console.log('G-AC, get all comments')

  const rows = await query(`SELECT * FROM comments JOIN users ON comments_author=users_id ORDER BY comments_date DESC`);
  const data = helper.emptyOrRows(rows);
 
  if(data){
    //console.log('G-AC, comment : ', data)
    return res.status(200).json({'data':data}).end()
  }
  else{
    return res.status(500).json({error}).end()
  }
}

/*********************************** Mise à jour groupées *******************************/
//P-UU
exports.updateUser=async function(req,res, next){
  //console.log('P-UU, update user', req.body.users)
  let users=req.body.users
  for(let i=0; i<users.length;i++){
    //console.log('P-UU', i, users[i].name, users[i].value)
    if(users[i].value!='')
    {let update = await query(
    `UPDATE users SET users_status='${users[i].value}' WHERE users_id=${users[i].name}`)

    const verified = helper.emptyOrRows(update);
    }
  }

  let quer=await query('select * from users');
  const list = helper.emptyOrRows(quer);
  //console.log(list)

  return res.status(200).json({'message':'utilisateurs mis à jours'}).end()
}

//P-UP
exports.updatePublication=async function(req,res, next){
  //console.log('P-UP, update publication', req.body.publications)
  let publications=req.body.publications
  for(let i=0; i<publications.length;i++){
    //console.log('P-UP',i, publications[i].id, publications[i].value)
    if(publications[i].value!='' && publications[i].id!='')
    {let update = await query(
    `UPDATE publications SET publications_status='${publications[i].value}' WHERE publications_id=${publications[i].id}`)

    const verified = helper.emptyOrRows(update);
    }
  }

  let quer=await query('select * from publications');
  const list = helper.emptyOrRows(quer);
  //console.log(list)

  return res.status(200).json({'message':'publications mises à jours'}).end()
  
}

//P-UC
exports.updateComments=async function(req,res, next){
  //console.log('P-UC, update comments', req.body.commentaire)
  let comment=req.body.commentaire
  for(let i=0; i<comment.length;i++){
    //console.log(i, comment[i].id, comment[i].value)
    if(comment[i].value!='' && comment[i].id!='')
    {let update = await query(
    `UPDATE comments SET comments_status='${comment[i].value}' WHERE comments_id=${comment[i].id}`)

    const verified = helper.emptyOrRows(update);
    }
  }

  let quer=await query('select * from publications');
  const list = helper.emptyOrRows(quer);
  //console.log(list)

  return res.status(200).json({'message':'publications mises à jours'}).end()
  
}

/*********************************** Mise à jour à la volée *******************************/
//P-UOP
exports.publicationUpdateOne=async function(req,res,next){
  //console.log('P-UOP publication', req.body)

  let publication=req.body
  let status;

    //console.log('P-UOP',publication.id, publication.action);
    if(publication.action=='block'){
      status=0
    }
    if(publication.action=='reveal'){
      status=1
    }

    
    let update = await query(
    `UPDATE publications SET publications_status='${status}' WHERE publications_id=${publication.id}`)

    const verified = helper.emptyOrRows(update);
  
    
    return res.status(200).json({'message':'publication mise à jours'}).end()
   
}

//P-UOC
exports.commentsUpdateOne=async function(req,res,next){
  //console.log('P-UOC comments', req.body)

  let comment=req.body
  let status;

    //console.log(comment.id, comment.action);
    if(comment.action=='block'){
      status=0
    }
    if(comment.action=='reveal'){
      status=1
    }

    
    let update = await query(
    `UPDATE comments SET comments_status='${status}' WHERE comments_id=${comment.id}`)

    const verified = helper.emptyOrRows(update);
  
    
    return res.status(200).json({'message':'commentaire mis à jours'}).end()
   
}