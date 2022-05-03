//structure de base bour les futures routes
const express = require('express');
const authorization=require('../middleware/auth')
const router = express.Router();
const pubFunction=require('../controllers/publications')

//pour les test
const rt=require('../middleware/routeTesting')

//C
router.post('/addPublication', authorization, pubFunction.addPublication)

//R-AP : récupérer toutes les publications
router.get('/getAllPublications', authorization, pubFunction.getPublications)

//R-OP : récupérer une publication:
router.get('/getOnePublication', authorization, pubFunction.getOnePublication)

//D : supprimer une publication
router.delete('/suppressOne', rt.rpSupp, rt.consoleHeader, rt.consoleDetails, authorization, pubFunction.deleteOnePublication)

//U : modifier une publication
router.put('/modifyPublication',authorization, rt.consoleDetails,rt.rp2, pubFunction.updatePublication)

module.exports = router;