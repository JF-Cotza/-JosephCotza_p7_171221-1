//structure de base bour les futures routes
const express = require('express');
const router = express.Router();
const userFunction=require('../controllers/user')


//C
router.post('/addUser', async function(req, res) {
  let body=req.body;
  //console.log(req)
  console.log('adduser', body)
  try {
      return res.json(await userFunction.addUser(body))   
    } 
  catch (err) {
      console.error(`Error while adding user `, err.message);
      return data={code:401,message:err.message}
    }    
});
  
//R
router.get('/getAllUsers', async function(req, res, next) {
  try {
    res.json(await userFunction.getAllUsers(req.query.page));
  } catch (err) {
    console.error(`Error while getting users `, err.message);
    next(err);
  }
});


router.get('/oneUser', async function(req, res, next) {
  try {
    res.json(await userFunction.getOneUser(req.query.page));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

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
router.get('/existing', async function(req, res, next) {
    let body=req.query.email;
  try {
    res.json(await userFunction.existing(body));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

router.post('/existing1', async function(req, res, next) {
    let body=req.body;
  try {
    res.json(await userFunction.existing(body));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});


router.post('/addUser', async function(req, res, next) {
  try {
    console.log('add user')
    res.json(await userFunction.create(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});
*/



module.exports = router;