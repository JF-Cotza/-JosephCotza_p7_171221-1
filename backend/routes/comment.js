//structure de base bour les futures routes
const express = require('express');
const authorization=require('../middleware/auth')
const router = express.Router();
const commentFunction=require('../controllers/comment')

//pour les test
const rt=require('../middleware/routeTesting')

//C
router.post('/addComment', rt.rc1, rt.consoleHeader, authorization, rt.consoleDetails, commentFunction.addComment)

module.exports = router; //si on l'oublie, il y a une erreur qui apparait 
/*
TypeError: Router.use() requires a middleware function but got a Object
    at Function.use (D:\Documents\testProjet\grpform\backend\node_modules\express\lib\router\index.js:464:13)
    at Function.<anonymous> (D:\Documents\testProjet\grpform\backend\node_modules\express\lib\application.js:220:21)        
    at Array.forEach (<anonymous>)
    at Function.use (D:\Documents\testProjet\grpform\backend\node_modules\express\lib\application.js:217:7)
    at Object.<anonymous> (D:\Documents\testProjet\grpform\backend\app.js:54:5)
*/