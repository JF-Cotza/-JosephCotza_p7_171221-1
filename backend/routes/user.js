//structure de base bour les futures routes
const express = require('express');
const router = express.Router();
const userFunction=require('../controllers/user')
const authorization=require('../middleware/auth')

//pour les test
const consoleHeader=function(req,res,next){
  console.log('admin consoleHeader',req.headers, req.query)
  //console.log('body',req.body)
  //console.log('file',req.files)
  //console.log(req)
  next();
}

//C-A : ajouter un utilisateur
router.post('/addUser', userFunction.checkExisting, userFunction.addUser);

//R-C: connexion
router.post('/connectUser', userFunction.connectUser, userFunction.pswComparaison, userFunction.confirmUser);

//R-P: voir mon profil
router.get('/getMyProfile', consoleHeader, authorization, userFunction.getMyProfile);

//D
router.delete('/suppressMyProfile',authorization)



/*
//R
router.get('/getAllUsers', async function(req, res, next) {
  try {
    res.json(await userFunction.getAllUsers(req.query.page));
  } catch (err) {
    console.error(`Error while getting users `, err.message);
    next(err);
  }
});


*/

/*
router.get('/resetPassword', async function(req,res,next){
  try {
    return res.json(await userFunction.searchForReset(req,res))  
  } catch (err) {
    console.error(`Error while getting users `, err.message,'get');
  }
});
*/
router.get('/resetPassword', userFunction.searchForReset);


//U
router.put('/updateUser', async function(req, res) {
  let body=req.body;
  console.log('update', body)  
  try {
    res.json(await userFunction.updateUser(body));
  } catch (err) {
    console.error(`Error while adding user `, err.message);
  }
  //window.location.href('http://localhost:8000/test/?ok=ok')
  //res.redirect('http://localhost:8000/test/?ok=ok')
});

//D
router.delete('/suppressUser', async function(req, res) {
  let body=req.body;
  console.log('suppression', body)  
  try {
    res.json(await userFunction.suppressUser(body));
  } catch (err) {
    console.error(`Error while suppress user `, err.message);
  }
  //window.location.href('http://localhost:8000/test/?ok=ok')
  //res.redirect('http://localhost:8000/test/?ok=ok')
});



/*
router.get('/getUser', authorization, async function(req, res, next) {
  console.log('getUser', req.query.id)
  try {
    res.json(await userFunction.getOneUser(req.query.id));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});
*/
module.exports = router;