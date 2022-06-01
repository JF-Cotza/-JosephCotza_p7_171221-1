const query=require('../query');
//const helper=require('../helper');
//const config=require('../routes/connect');

//C : ajouter un commentaire
exports.addComment=async function(req,res,next){   
  let comment=req.body;
  let message = 'Error in adding new comment';
  let code = 500;
  
  
    console.log('add comment', comment)

    let sql=`INSERT INTO comments (comments_texte ,comments_author, comments_publication) VALUES (?,?,?)`
    let result = await query(sql, [comment.texte, comment.auteur,comment.publication]);

    console.log('result', result)

  if (result.affectedRows) {
    message = 'publication added successfully';
    code=200;
  }
  else{
    console.log('erreur ')
  }
  return res.status(code).json({message:message}).end()
}
