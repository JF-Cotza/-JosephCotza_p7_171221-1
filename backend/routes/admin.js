const express = require('express');
const authorization=require('../middleware/adminAuth')
const router = express.Router();
const adminFunction=require('../controllers/admin')


//pour les test

//G-AU: récupérer tous les utilisateurs
router.get('/getAllUsers', authorization, adminFunction.getAllProfile);

//G-AP: récupérer toutes les publications
router.get('/getAllPubs', authorization, adminFunction.getAllPublications);

//G-AC: récupérer tous les commentaires
router.get('/getAllComments', authorization, adminFunction.getAllComments);


//P-UU
router.put('/userUpdate', authorization, adminFunction.updateUser)

//P-UP
router.put('/publicationUpdate', authorization, adminFunction.updatePublication)

//P-UOP
router.put('/publicationUpdateOne', authorization, adminFunction.publicationUpdateOne)

//P-UC
router.put('/commentsUpdate', authorization, adminFunction.updateComments)

//P-UOC
router.put('/commentsUpdateOne', authorization, adminFunction.commentsUpdateOne)

module.exports = router;