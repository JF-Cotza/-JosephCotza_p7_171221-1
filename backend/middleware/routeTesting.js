
//pour les test
exports.consoleHeader=function(req,res,next){
  console.log('consoleHeader',' headers ',req.headers,' query ',req.query)
  next();
}

exports.consoleAdminHeader=function(req,res,next){
  console.log('admin consoleHeader',req.headers, req.query)
  //console.log('body',req.body)
  //console.log('file',req.files)
  //console.log(req)
  next();
}



exports.consoleDetails=function(req,res,next){
  console.log('console details',' files ',req.files,' body ', req.body)
  next();
}

exports.consoleReq=function(req,res,next){
  console.log('console req',req)
  next();
}

exports.ruCreate=function(req,res,next){
  console.log('user add user - C-A')
  next();
}

exports.ruConnect=function(req,res,next){
  console.log('user connect user- R-C')
  next();
}

exports.ruGet=function(req,res,next){
  console.log('user get profile- R-P')
  next();
}

exports.ruSuppress=function(req,res,next){
  console.log('user suppress profile - D-P')
  next();
}

exports.ruUpdate=function(req,res,next){
  console.log('user update profile - U-P')
  next();
}

exports.rpAdd=function(req,res,next){
  console.log('publication add- R-C')
  next();
}


exports.rpGetOne=function(req,res,next){
  console.log('publication get one pub- R-OP')
  next();
}


exports.rp1=function(req,res,next){
  console.log('publication get all page- R-AP')
  next();
}


exports.rp2=function(req,res,next){
  console.log('publication put update')
  next();
}

exports.rpSupp=function(req,res,next){
  console.log('publication supress')
  next();
}


exports.rc1=function(req,res,next){
  console.log('comment post add')
  next();
}

exports.rcCount=function(req,res,next){
  console.log('comment get count')
  next();
}

exports.test=function(req,res,next){
  console.log('test route return')
  res.status(200).json({message:'toto'})
}



exports.raGC=function(req,res,next){
 console.log('admin get all comments') 
 next();
}


exports.raUU=function(req,res,next){
 console.log('admin put update user') 
 next();
}

exports.raUP=function(req,res,next){
 console.log('admin put update publication') 
 next();
}

exports.raUC=function(req,res,next){
 console.log('admin put update comments') 
 next();
}
