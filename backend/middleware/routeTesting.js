
//pour les test
exports.consoleHeader=function(req,res,next){
  console.log('user consoleHeader',req.headers, req.query)
  //console.log('body',req.body)
  //console.log('file',req.files)
  //console.log(req)
  next();
}

exports.ru1=function(req,res,next){
  console.log('user add user - C-A')
  next();
}

exports.ru2=function(req,res,next){
  console.log('user connect user- R-C')
  next();
}

exports.ru3=function(req,res,next){
  console.log('user get profile- R-P')
  next();
}

exports.ru4=function(req,res,next){
  console.log('user suppress profile - D-P')
  next();
}