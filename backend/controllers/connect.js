require('dotenv').config();
let ENV=process.env
exports.config_toad = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: ENV.db_host,
    user: ENV.db_user,
    password: ENV.db_password,
    database: ENV.db_database,
  },
  listPerPage: ENV.listPerPage,
};

exports.token = { value: ENV.token, end: ENV.token_end }
