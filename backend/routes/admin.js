const express = require('express');
const authorization=require('../middleware/adminAuth')
const router = express.Router();
const adminFunction=require('../controllers/admin')

//pour les test
const consoleHeader=function(req,res,next){
  console.log('admin consoleHeader',req.headers, req.query)
  //console.log('body',req.body)
  //console.log('file',req.files)
  //console.log(req)
  next();
}

//R-AU: voir mon profil
router.get('/getAllUsers', authorization, consoleHeader, adminFunction.getAllProfile);


/*
router.get('/resetPassword', async function(req,res,next){
  try {
    return res.json(await userFunction.searchForReset(req,res))  
  } catch (err) {
    console.error(`Error while getting users `, err.message,'get');
  }
});

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
*/

module.exports = router;