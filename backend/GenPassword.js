const bcrypt = require('bcrypt');

let password = bcrypt.hashSync('idiot', 9);
console.log(password)