const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const fileSystem=require('fs');  

const MIMES_TYPES ={                
    'image/jpg' : 'jpg',           
    'image/jpeg': 'jpg',
    'image/png' : 'png'         
};

//R-AP pour récupérer toutes les publications
exports.getPublications=async function(req,res, next){
  //console.log('R-AP', 'query', req.query, 'body',req.body)
  let page=req.query.page;

  const offset = helper.getOffset(page, config.listPerPage);
  //console.log('offset',offset)
  
  const counting = await query(
    `SELECT count(*) FROM publications`
  );
  const count = JSON.stringify(helper.emptyOrRows(counting));
  //console.log(count);
  const publicationList = await query(
    `SELECT * FROM publications join users ON publications.publications_author=users.users_id ORDER BY publications_date DESC LIMIT ${offset},${config.listPerPage} `
  );
  const publications = helper.emptyOrRows(publicationList);
  
  let total=count.split(':')[1].split('}')[0]
  
  const comments = await query(
    `SELECT comments_publication, count(*) FROM comments GROUP BY comments_publication`
  );
  
  const commentsGrouped = helper.emptyOrRows(comments);
    
  let table=[];
  for(let i=0;i<commentsGrouped.length;i++){
    //console.log(i, commentsGrouped[i])
    let a=JSON.stringify(commentsGrouped[i])
    let b=a.split(',')[1].split(':')[1].split('}')[0]
    //console.log(a)
    let id=a.split(':')[1].split(',')[0]
    table.push({id:id,value:b})
  }

  //console.log('R-AP publication',publications)
  //  console.log(table)

  const meta = {page};
  //console.log(' list,', publications,'counting ',total)
  for(let i=0;i<publications.length;i++){
    let item=publications[i].publications_id
    for(let j=0;j<table.length;j++){
      let key=table[j].id
      if(item==key){
        //console.log(key,table[j].value)
        publications[i].counted=table[j].value
      }
    }
  }
  //console.log(publications)

  if(publications){
    return res.status(200).json({message: total+' publications trouvées',liste: publications, counted:table})
  }
  else{
    return res.status(500).json({error})
  }
}

//R-OP pour récupérer une publication
exports.getOnePublication=async function(req,res,next){
  //console.log('R-OP get1 pub',req.query.id)
  const publication = await query(
    `SELECT * FROM publications JOIN users ON publications.publications_author=users.users_id where publications_id=${req.query.id}`)
  const comments = await query(
    `SELECT * FROM comments JOIN users ON comments.comments_author=users.users_id WHERE comments_publication=${req.query.id} ORDER BY comments_date Desc` );
  
  const pub = helper.emptyOrRows(publication);
  const commentList = helper.emptyOrRows(comments);
  //console.log('R-OP data publication',pub, ' comments ',commentList)
  
  if(pub){
    //console.log('R-OP if data',pub, commentList )
    return res.status(200).json({publication:pub,comments:commentList})
  }
  else{
    return res.status(500).json({error})
  }

}

//C : ajouter une publication
exports.addPublication=async function(req,res,next){   
  let publication=req.body;
  let message = 'Error in adding new publication';
  let imageFile;
  let uploadPath;
  let name;
  let date=Date.now();
    
  if(req.files){
    console.log('add if files',req.files.image)  
    const extension=MIMES_TYPES[req.files.image.mimetype];
    if(!extension){console.log('format non reconnu')};
    if (!req.files || Object.keys(req.files).length === 0 || !extension) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile= req.files.image;
    name=imageFile.name.split('.')[0]+'_'+date+'.'+extension;
    uploadPath = './images'+'/'+ name;//'./images' car le répertoire est défini avec static.
    
    // console.log('up '+uploadPath)
    // console.log('ext '+extension)
    // Use the mv() method to place the file somewhere on your server
    let imageUrl=`${req.protocol}://${req.get('host')}/images/${imageFile}`;
    console.log('create imageUrl',imageUrl)

    imageFile.mv(uploadPath, function(err) {
      //console.log('mv')
      //console.log(imageFile)
        if (err){
          return res.status(500).send(err);
        }
        else{
          //console.log('name '+name)
        }
      })
    }
    else{
      //console.log('else')
      name=''
    }
    //console.log('name', name)
    console.log('add publication',publication)

    let sql=`INSERT INTO publications (publications_title, publications_texte ,publications_author, publications_image) VALUES (?,?,?,?)`
    let result = await query(sql, [publication.title, publication.texte, publication.id, name]);

    console.log('result', result)

  if (result.affectedRows) {
    message = 'publication added successfully';
    console.log('if result ', message)
    return res.status(200).json({message:message})
  }
  else{
    console.log('erreur ')
  }
  return res.status(500).json({error})
}

//D-OP
exports.deleteOnePublication=async function(req, res, next){
  //console.log('D-OP',req.query)

  let publicationId=req.query.id;
  let authorId=req.query.author;
  //let authorId=90
  const image = await query(
    `SELECT * FROM publications JOIN users ON publications.publications_author=users.users_id where publications_id=${req.query.id} `
  );
  const imageName = helper.emptyOrRows(image)[0].publications_image;
  
  //console.log('imageName', imageName)

  fileSystem.unlink(`./images/${imageName}`,async function(){        // on appele la méthode unlink de fs pour supprimer le fichier .unlink('chemin+nom du fichier à supprimer', fonction à éxécuter quand la suppression est effectuée)
    const deleteQr = await query(
      `DELETE FROM publications WHERE publications_id=${publicationId} AND publications_author=${authorId}`
    );
    const data = helper.emptyOrRows(deleteQr);
    //console.log('D-OP data',data)
    
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
  //console.log('U-UP: body: ',req.body, '/ files: ',req.files)

  let publication=req.body
  let sql;
    if(publication.imageChanged=='false'){ //l'image n'a pas été changée, ni supprimée
      //console.log("U-UP, console 1, l'image n'a pas été changée, ni supprimée")
      sql =await query(`UPDATE publications SET publications_title='${publication.title}', publications_texte='${publication.texte}' WHERE publications_id=${publication.publicationId}`);
    }
    else{//l'image a été changée ou supprimée
      //console.log("U-UP, console 2, l'image a été changée ou supprimée")
    
      //import et renommage de la nouvelle image
      let image;
      let imageFile;
      let uploadPath;
      let name='';
      let date=Date.now();
      
      if(req.files){ //U-UP+req.files
        image=req.files.image;
        //console.log("U-UP update if,console 3, il y a un nouveau fichier => on change l'image, ou on remplace le fichier existant",image)  
        const extension=MIMES_TYPES[image.mimetype];
        
        if(!extension){console.log('U-UP,console 4,format non reconnu')};
        
        if (!req.files || Object.keys(req.files).length === 0 || !extension) {
        return res.status(400).send('No files were uploaded.');
        }

        imageFile= image;
        name=imageFile.name.split('.')[0]+'_'+date+'.'+extension;
        uploadPath = './images'+'/'+ name;//'./images' car le répertoire est défini avec static.
        
        //récupération de l'image et import dans le repertoire /backend/images
        let imageUrl=`${req.protocol}://${req.get('host')}/images/${imageFile}`;
        //console.log('U-UP,console 5,create imageUrl',imageUrl)

        imageFile.mv(uploadPath, function(err) {  
          if (err){
            return res.status(500).send(err);
          }
          else{
            //console.log('U-UP,console 6,image importé dans /backend/images')
          }
        })
      }
      else{//U-UP+!req.files
        //console.log("U-UP update else, console 7,changement d'image mais il n'y a pas de fichier=> on supprime l'ancienne image")
        name=''
      }

      //récupération de l'ancienne image
      const select = await query(
        `SELECT * from publications WHERE publications_id=${publication.publicationId}`
      );

      const selected = helper.emptyOrRows(select);
      let oldFile=selected[0].publications_image
      //console.log('U-UP, console 8, selected',selected,'oldfile: ',oldFile);


  //suppression de l'ancienne image
    if(oldFile){ //il y avait déjà une image dans la publication => on supprime l'ancienne
      //console.log('U-UP,console 9,image: stockée', oldFile,'importée: ',image) 
      fileSystem.unlink(`./images/${oldFile}`, ()=>console.log('U-UP,console 10,fichier supprimé'))
    }
    else{ // il n'y en avait pas
      //console.log('U-UP,console 11,pas d image stockée / importée',image )
  }
  
  //mise à jour
  sql = await query( 
      `UPDATE publications SET publications_title='${publication.title}', publications_texte='${publication.texte}', publications_image='${name}' WHERE publications_id=${publication.publicationId}`);
  }

  //mise à jour quel que soit le cas + vérification
  const updating = helper.emptyOrRows(sql);

  //console.log('U-UP,console 12',updating)
  
  const verify = await query(
    `SELECT * from publications WHERE publications_id=${publication.publicationId}`
  );

  const verified = helper.emptyOrRows(verify);
  //console.log('u-UP,console 13, vérification de la modification',verified)
  res.status(200).json({message:'publication mise à jour'})
}
