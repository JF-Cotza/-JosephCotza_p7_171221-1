const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const fileSystem=require('fs');  

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
  return res.status(code).json({message:message})
}

//G-CC:contange des commentaires
/*exports.counting=async function(req,res,next){
  
  let id=req.body.id
  console.log('R-CC',id)
  const rows = await query(
    `SELECT comments_publication, count(comments_id) FROM comments GROUP BY comments_publication ` 
    //WHERE comments_publication = `+id+` 
   );
   const data = helper.emptyOrRows(rows);
  
   console.log('counting R-CC',data)
    let table=[];
    let i=0
    for(let item in data[0]){
      console.log(i, item);
      i++;
    }

    /*
   let string=JSON.stringify(data[0]).split(':')[1].split('}')[0]
   console.log('stringify',string);
  
   let counting;
   if(string!=0){
     counting=string;
   }
   else{
    counting=0
   }
   res.status(200).json({counted:counting})
   
  }
*/

/*
//R-AP pour récupérer toutes les publications
exports.getPublications=async function(req,res, next){
  console.log('R-AP', 'query', req.query, 'body',req.body)
  let page=req.query.page;

  const offset = helper.getOffset(page, config.listPerPage);
  console.log('offset',offset)
  
  const counting = await query(
    `SELECT count(*) FROM publications`
  );
  const count = JSON.stringify(helper.emptyOrRows(counting));
  console.log(count);
  const publicationList = await query(
    `SELECT * FROM publications join users ON publications.publications_author=users.users_id ORDER BY publications_date DESC LIMIT ${offset},${config.listPerPage} `
  );
  const publications = helper.emptyOrRows(publicationList);
  console.log('R-AP publication',publications)
  
  let total=count.split(':')[1].split('}')[0]
  
  const meta = {page};
  //console.log(' list,', publications,'counting ',total)
  
  if(publications){
    return res.status(200).json({message: total+' publications trouvées',liste: publications})
  }
  else{
    return res.status(500).json({error})
  }
}

//R-OP pour récupérer une publication
exports.getOnePublication=async function(req,res,next){
  console.log('R-OP get1 pub',req.query.id)
  const publication = await query(
    `SELECT * FROM publications JOIN users ON publications.publications_author=users.users_id where publications_id=${req.query.id}`)
  const comments = await query(
    `SELECT * FROM comments JOIN users ON users_id=comments.comments_author WHERE comments_publication=${req.query.id}`);
    
  
  const pub = helper.emptyOrRows(publication);
  const commentList = helper.emptyOrRows(comments);
  console.log('R-OP data publication',pub, ' comments ',commentList)
  
  if(pub){
    console.log('R-OP if data',pub )
    return res.status(200).json({publication:pub,comments:commentList})
  }
  else{
    return res.status(500).json({error})
  }

}


//D-OP
exports.deleteOnePublication=async function(req, res, next){
  console.log('D-OP',req.query)
  let publicationId=req.query.id;
  let authorId=req.query.author;
  //let authorId=90
  const image = await query(
    `SELECT * FROM publications JOIN users ON publications.publications_author=users.users_id where publications_id=${req.query.id} `
  );
  const imageName = helper.emptyOrRows(image)[0].publications_image;
  
  console.log('imageName', imageName)

  fileSystem.unlink(`./images/${imageName}`,async function(){        // on appele la méthode unlink de fs pour supprimer le fichier .unlink('chemin+nom du fichier à supprimer', fonction à éxécuter quand la suppression est effectuée)
    const deleteQr = await query(
      `DELETE FROM publications WHERE publications_id=${publicationId} AND publications_author=${authorId}`
    );
    const data = helper.emptyOrRows(deleteQr);
    console.log('D-OP data',data)
    
    if(data){
      return res.status(200).json({message:'publication supprimée'})
    }
    else{
      return res.status(500).json({error})
    }
  })


}

//U-UP : Update Publication
exports.updatePublication=async function(req, res, next){
   console.log('U-UP',req.body)
   let publication=req.body

   if (publication.image=={}||publication.image==[]){publication.image=''}
   console.log('publication', publication.image)

  const update = await query(
    `UPDATE publications SET publications_title='${publication.title}', publications_texte='${publication.texte}', publications_image='${publication.image}' WHERE publications_id=${publication.publicationId}`
  );

  

  const verified = helper.emptyOrRows(update);
 // let result = await query(update,[publication.publicationId]);
  console.log(verified)
    
  const verify = await query(
    `SELECT * from publications WHERE publications_id=?`
  );

  const verified = helper.emptyOrRows(verify);
  console.log(verified)
  
  res.status(200).json({message:'publication mise à jour'})
}  
*/