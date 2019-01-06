//const MongoClient = require('mongodb');
const { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }

    console.log('Connected to Mongo');

    /* db.collection('Todos').insertOne({

        text: "Somthing todo",
        completed: false

    }, (err, result) => {
        if(err){
            return console.log('Unable to insert todo', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    }) */

    /* db.collection('Users').insertOne({

        name: "Mohammed",
        age: 20,
        location: "Imababa"

    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo', err);
        }

        console.log(result.ops[0].getTimestamp());
        console.log(JSON.stringify(result.ops, undefined, 2));
    }); */

    db.close();
});