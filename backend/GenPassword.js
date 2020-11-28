const bcrypt = require('bcrypt');

/*
 * Manually create hashed password for db
 */

const passwordToHash = 'idiot';
let password = bcrypt.hashSync(passwordToHash, 9);

console.log(`Password='${password}'`)