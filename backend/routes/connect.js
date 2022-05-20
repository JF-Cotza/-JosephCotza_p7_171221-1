const connect=require('../controllers/connect')
// il est possible ici de tester d'autres config créer dans le fichier ci-dessus en créant d'autres modules

const connection=connect.config_toad;

module.exports=connection;