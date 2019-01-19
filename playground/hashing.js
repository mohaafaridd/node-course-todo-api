const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




/* var data = {
    id: 1
}

var token = jwt.sign(data, '123aBc');
console.log(token);

var decoded = jwt.verify(token, '123aBc')
console.log('decoded: ', decoded);
 */
/* var message = "I'm user number 3";
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
    id: 2
};
var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash){
    console.log('Data was not changed');
} else {
    console.log("Don't trust");
} */