const express = require('express');
const authorization=require('../middleware/adminAuth')
const router = express.Router();
const adminFunction=require('../controllers/admin')


//pour les test
const rt=require('../middleware/routeTesting')

//R-AU: voir mon profil
router.get('/getAllUsers', rt.consoleAdminHeader, authorization, adminFunction.getAllProfile);

//R-AP: voir mon profil
router.get('/getAllPubs', rt.consoleAdminHeader, authorization, adminFunction.getAllPublications);

router.put('/userUpdate',rt.raUU,rt.consoleHeader, authorization, rt.consoleDetails,adminFunction.updateUser)


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