//structure de base bour les futures routes
const express = require('express');
const router = express.Router();
const userFunction=require('../controllers/user')
const authorization=require('../middleware/auth')

const rt=require('../middleware/routeTesting')

//C-A : ajouter un utilisateur
router.post('/addUser',  userFunction.checkExisting, userFunction.addUser);

//R-C: connexion
router.post('/connectUser', userFunction.connectUser, userFunction.pswComparaison, userFunction.confirmUser);

//R-P: voir mon profil
router.get('/getMyProfile', authorization, userFunction.getMyProfile);

//D-P: supprimer mon profil
router.delete('/suppressMyProfile', authorization, userFunction.deleteProfile)

//U-P: mettre à jour le profil
router.put('/updateUser',authorization, userFunction.uniqueMail,userFunction.updatingUser, rt.ruUpdate, userFunction.connectUser, userFunction.confirmUser)

module.exports = router;