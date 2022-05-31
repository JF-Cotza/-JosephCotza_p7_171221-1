//structure de base bour les futures routes
const express = require('express');
const authorization=require('../middleware/auth')
const router = express.Router();
const pubFunction=require('../controllers/publications')


//C
router.post('/addPublication', authorization, pubFunction.addPublication)

//R-AP : récupérer toutes les publications
router.get('/getAllPublications', authorization, pubFunction.getPublications)

//R-OP : récupérer une publication:
router.get('/getOnePublication', authorization, pubFunction.getOnePublication)

//D : supprimer une publication
router.delete('/suppressOne', authorization, pubFunction.deleteOnePublication)

//U : modifier une publication
router.put('/modifyPublication',authorization, function(req,res,next){console.log(req.headers),next()},pubFunction.updatePublication)

module.exports = router;