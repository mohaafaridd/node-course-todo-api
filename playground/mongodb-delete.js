//const MongoClient = require('mongodb');
const {
    MongoClient,
    ObjectID
} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }

    console.log('Connected to Mongo');

    /* db.collection('Todos')

        .deleteMany({
            text: "Walk the dog"
        })

        .then((result) => {
            console.log(result);
        }); */

    /* db.collection('Todos')

        .deleteOne({
            text: "Walk the dog"
        })

        .then((result) => {
            console.log(result);
        });

    db.collection('Todos')

        .findOneAndDelete({
            completed: false
        })

        .then((result) => {
            console.log(result);
        }); */

    db.collection('Users')
        .deleteMany({
            name: "Mohammed"
        });

    db.collection('Users')
        .findOneAndDelete({
            _id: new ObjectID("5c31183f70488a07e89b2afd")
        })
        .then((result) => {
            console.log(result);
        });

    //db.close();
});