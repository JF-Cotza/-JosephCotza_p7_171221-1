//structure de base bour les futures routes
const express = require('express');
const router = express.Router();
const userFunction=require('../controllers/user')
const authorization=require('../middleware/auth')

const rt=require('../middleware/routeTesting')

//C-A : ajouter un utilisateur
router.post('/addUser', rt.ru1, userFunction.checkExisting, userFunction.addUser);

//R-C: connexion
router.post('/connectUser', rt.ru2, userFunction.connectUser, userFunction.pswComparaison, userFunction.confirmUser);

//R-P: voir mon profil
router.get('/getMyProfile', rt.ru3, rt.consoleHeader, authorization, userFunction.getMyProfile);

//D-P: supprimer mon profil
router.delete('/suppressMyProfile', rt.ru4, rt.consoleHeader, authorization, userFunction.deleteProfile)











//U
router.put('/updateUser', async function(req, res) {
  let body=req.body;
  console.log('update', body)  
  try {
    res.json(await userFunction.updateUser(body));
  } catch (err) {
    console.error(`Error while adding user `, err.message);
  }
});

module.exports = router;