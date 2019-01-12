const {
    mongoose
} = require('../server/db/mongoose');

const {
    Todo
} = require('../server/models/todo');

const {
    User
} = require('../server/models/user');

const {ObjectID} = require('mongodb');

var id = '5c321aa7dd9bf70bb480f7e0';


/* Todo.remove({}).then((res) => {
    console.log(res);
})
 */
/* Todo.findOneAndRemove
Todo.findByIdAndRemove */

Todo.findByIdAndRemove('5c39c1ef4b79946dbc511240').then((todo) => {
    console.log(todo);
})