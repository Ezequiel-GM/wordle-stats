const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wordlestats-default-rtdb.firebaseio.com",
});

module.exports = { database: admin.database() };