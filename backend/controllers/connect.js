/*
exports.config_4free = {
  db: {
     don't expose password or any sensitive info, done only for demo
    host: "db4free.net",
    user: "freejackjc",
    password: "Fr33jack$01-DE",
    database: "groupomaniadb_jc",
  },
  listPerPage: 10,
};
*/

exports.config_local = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "localhost",
    user: "toto",
    password: "toto",
    database: "groupomaniadb",
  },
  listPerPage: 10,
};

exports.config_toad = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "localhost",
    user: "freejackjc",
    password: "Fr33jack$01-PN",
    database: "groupomaniadb",
  },
  listPerPage: 5,
};

exports.token = { value: 'RANDOM_TOKEN_SECRET_FOR_DEVELOPPEMENT', end: '24h' }