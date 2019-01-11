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

/* var id = '5c37bc2021963926145ba35511';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
} */

/* Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos: ', todos);
})

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo: ', todo);
}) */

/* Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('ID not found');
    }
    console.log('Todo: ', todo);
}).catch((e) => {
    console.log(e);
}) */

User.findById(id)
    .then((user) => {
        if(!user){
            return console.log('ID not found');
        }

        console.log('User email: ', JSON.stringify(user, undefined, 2));
    })
    .catch((e) => {
        console.log(e);
    })