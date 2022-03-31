const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');
const fileSystem=require('fs');  

const MIMES_TYPES ={                
    'image/jpg' : 'jpg',           
    'image/jpeg': 'jpg',
    'image/png' : 'png'         
};


exports.addPublication=async function(req,res){ 
  let publication=req.body  
  let message = 'Error in adding new publication';
  console.log('controller addpub', req.files)
  let imageFile;
  let uploadPath;
  let name;


  if(req.files){
    console.log('if',req.files.image)  
    const extension=MIMES_TYPES[req.files.image.mimetype];
    if(!extension){console.log('format non reconnu')};
    if (!req.files || Object.keys(req.files).length === 0 || !extension) {
        return res.status(400).send('No files were uploaded.');
    }

    imageFile= req.files.image;
    name=imageFile.name.split('.')[0]+'_'+Date.now()+'.'+extension;
    uploadPath = './images'+'/'+ name;//'./images' car le répertoire est défini avec static.
    console.log('up '+uploadPath)
    console.log('ext '+extension)
    // Use the mv() method to place the file somewhere on your server
    imageFile.mv(uploadPath, function(err) {
      console.log('mv')
      console.log(imageFile)
      if (err){
        return res.status(500).send(err);
      }
      else{
        console.log('name '+name)
      }
    })
  }
  else{
    console.log('else')
    name=''
  }
    let sql='INSERT INTO publications (publications_title, publications_texte ,publications_author, publications_image) VALUES (?,?,?,?)'
  let result = await query(sql, [publication.title, publication.texte, publication.id, name]);

  if (result.affectedRows) {
    message = 'publication added successfully';
  }
  return {message};
}

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