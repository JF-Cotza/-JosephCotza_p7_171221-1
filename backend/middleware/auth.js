const jwt = require('jsonwebtoken');
const link = require('../controllers/connect');
const linkedKey=link.token.value;

const query=require('../query');
const helper=require('../helper');
const config=require('../routes/connect');


module.exports =async (req, res,next) =>{
    console.log(req.query.id)
    try{
        let token='';
        
            console.log('   mdw files');
            console.log(req.files)
            console.log('   mdw body');
            console.log(req.body);
        if(req.body.token){
            token=req.body.token
        }
        else if(req.query.id){
            token=req.query.id
        }
        else{
            token = req.headers.authorization.split(' ')[1];
        }
         
        const checkToken=jwt.verify(token,linkedKey);
        
        const user_id=checkToken.userId.split(' ')[0];
        const user_mail=checkToken.userId.split(' ')[1]

        console.log(checkToken);
        
        let page=1;

        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await query(
            `SELECT * FROM users WHERE users_mail='${user_mail}' AND users_id=${user_id}`
        );
        const check = helper.emptyOrRows(rows);
        const meta = {page}

        console.log('checj',check)
        
        if(check==''){
            console.log('user invalide');
            throw 'user ID invalide'
        }
        else{
            req.body.id=user_id
            console.log('user identifié');
            next();
        }
    }
    catch(error){
            res.status(401).json({error:error | "échec de l'identification"});         }
};