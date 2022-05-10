//user

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



