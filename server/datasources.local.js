console.log('setting up local mongo connection info');

module.exports = {
  db: {
    name: 'db',
    connector: 'mongodb',
    url: process.env.PIGGY_MONGODB_URI || null
  }
};
