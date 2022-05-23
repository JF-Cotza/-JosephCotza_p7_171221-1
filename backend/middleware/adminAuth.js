const jwt = require('jsonwebtoken');
const link = require('../controllers/connect');
const linkedKey=link.token.value;

const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');

module.exports =async (req, res, next) =>{
    try{
        let token=req.headers.authorization.split(' ')[1];
        
            //console.log('   mdw files', req.files)
            //console.log('   mdw body', req.body);
            //console.log('   split', token)
         
        const checkToken=jwt.verify(token,linkedKey);
        
        const user_id=checkToken.userId.split(' ')[0];
        const user_mail=checkToken.userId.split(' ')[1]

        //console.log('adminAuth decrypage du token',checkToken);
        
        //ajout de la condition users_status=2 pour être sûr que c'est bien un admin

        const rows = await query(
            `SELECT * FROM users WHERE users_mail='${user_mail}' AND users_id=${user_id} AND users_status=2`
        );
        const check = helper.emptyOrRows(rows);
        //const meta = {page}

        if(check==''){
            //console.log('user invalide');
            throw 'user ID invalide'
        }
        else{
            //console.log('admin identifié');
            next();
        }
    }
    catch(error){
        res.status(401).json({error:error | "échec de l'identification"});         }
};