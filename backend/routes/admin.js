const express = require('express');
const authorization=require('../middleware/adminAuth')
const router = express.Router();
const adminFunction=require('../controllers/admin')


//pour les test
const rt=require('../middleware/routeTesting')

//G-AU: récupérer tous les utilisateurs
router.get('/getAllUsers', rt.consoleAdminHeader, authorization, adminFunction.getAllProfile);

//G-AP: récupérer toutes les publications
router.get('/getAllPubs', rt.consoleAdminHeader, authorization, adminFunction.getAllPublications);

//G-AC: récupérer tous les commentaires
router.get('/getAllComments', rt.consoleAdminHeader, authorization, rt.raGC,adminFunction.getAllComments);


//P-UU
router.put('/userUpdate',rt.raUU,rt.consoleHeader, authorization, rt.consoleDetails,adminFunction.updateUser)

//P-UP
router.put('/publicationUpdate',rt.raUP,rt.consoleHeader, authorization, rt.consoleDetails,adminFunction.updatePublication)

//P-UOP
router.put('/publicationUpdateOne',rt.raUP,rt.consoleHeader, authorization, rt.consoleDetails,adminFunction.publicationUpdateOne)

//P-UC
router.put('/commentsUpdate',rt.raUC,rt.consoleHeader, authorization, rt.consoleDetails,adminFunction.updateComments)

//P-UOC
router.put('/commentsUpdateOne',rt.raUP,rt.consoleHeader, authorization, rt.consoleDetails, adminFunction.commentsUpdateOne)


module.exports = router;