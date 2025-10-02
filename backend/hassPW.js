const bcrypt = require('bcrypt');
const saltRounds = 10;

bcrypt.hash('Test123!', saltRounds, function(err, hash) {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
