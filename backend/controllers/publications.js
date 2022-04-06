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
    `SELECT * FROM publications join users ON publications.publications_author=users.users_id LIMIT ${offset},${config.listPerPage}`
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
  const rows = await query(
    `SELECT * FROM publications JOIN users ON publications.publications_author=users.users_id where publications_id=${req.query.id} `
  );
  const data = helper.emptyOrRows(rows);
  console.log('R-OP data',data)
  
  if(data){
    return res.status(200).json({publication:data})
  }
  else{
    return res.status(500).json({error})
  }
}

exports.addPublication=async function(req,res,next){   
  let publication=req.body;
  let message = 'Error in adding new publication';
  let imageFile;
  let uploadPath;
  let name;
  let date=Date.now();
  console.log('controller addpub', 'body:', publication, 'file:', req.files)
  
  if(req.files){
    console.log('if',req.files.image)  
    const extension=MIMES_TYPES[req.files.image.mimetype];
    if(!extension){console.log('format non reconnu')};
    if (!req.files || Object.keys(req.files).length === 0 || !extension) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile= req.files.image;
    name=imageFile.name.split('.')[0]+'_'+date+'.'+extension;
    uploadPath = './images'+'/'+ name;//'./images' car le répertoire est défini avec static.
    console.log('up '+uploadPath)
    console.log('ext '+extension)
    // Use the mv() method to place the file somewhere on your server
    imageFile.mv(uploadPath, function(err) {
      //console.log('mv')
      console.log(imageFile)
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
    console.log('name', name)

    let sql='INSERT INTO publications (publications_title, publications_texte ,publications_author, publications_image, publications_date) VALUES (?,?,?,?, NOW())'
    let result = await query(sql, [publication.title, publication.texte, publication.id, name]);

  if (result.affectedRows) {
    message = 'publication added successfully';
    console.log('if result ', message)
    return res.status(200).json({message:message})
  }
  return res.status(500).json({error})
}

//D-OP
exports.deleteOnePublication=async function(req, res, next){
  console.log('D-OP',req.query)
  let publicationId=req.query.id;
  let authorId=req.query.author;
  //let authorId=90
  const rows = await query(
    `DELETE FROM publications WHERE publications_id=${publicationId} AND publications_author=${authorId}`
  );
  const data = helper.emptyOrRows(rows);
  console.log('D-OP data',data)
  
  if(data){
    return res.status(200).json({message:'publication supprimée'})
  }
  else{
    return res.status(500).json({error})
  }
  
}



/*
exports.getAllPublications=async function(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM publications LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}
*/