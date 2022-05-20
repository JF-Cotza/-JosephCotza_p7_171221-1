exports.port={
  value:'3000'
}


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