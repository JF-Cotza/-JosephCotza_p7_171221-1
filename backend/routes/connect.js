const connect=require('../controllers/connect')

const connection1=connect.config_4free;
const connection2=connect.config_local;
const connection3=connect.config_toad;

module.exports=connection3;