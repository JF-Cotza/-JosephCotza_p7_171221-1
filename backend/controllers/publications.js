const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');

exports.addPublication=async function(publication){
  console.log('add publication', publication.title)

  let sql='INSERT INTO publications (publications_title, publications_texte ,publications_author, publications_image) VALUES (?,?,?,?)'
  let result = await query(sql, [publication.title, publication.texte, publication.author, publication.image]);

  console.log('result', result)
  

  let message = 'Error in adding new publication';

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