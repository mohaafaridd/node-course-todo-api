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
        .findOneAndUpdate({
            _id: new ObjectID("5c31ff8d9aca364102fe710f")
        }, {
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        })
        .then ((result) => {
            console.log(result);
        }); */

    db.collection('Users')
        .findOneAndUpdate({
            _id: new ObjectID("5c31f532c294ac3fb0917d0c")
        }, {
            $set: {
                name: "Mohammed"
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        })
        .then((result) => {
            console.log(result);
        })


    //db.close();
});