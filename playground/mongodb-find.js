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

    /* db.collection('Todos').find(
        {
            _id: new ObjectID("5c31179fd50c5a35004fc02a")
        }
        ).toArray().then ((docs) => {

        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));

    }, (err) => {
        console.log('Unable to fetch', err);
    }); */

    /* db.collection('Todos').find().count().then ((count) => {

        console.log(`Todos Count: ${count}`);

    }, (err) => {
        console.log('Unable to fetch', err);
    }); */


    db.collection('Users').find({
        name: "Mohammed"
    }).toArray().then((docs) => {

        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));

    }, (err) => {
        console.log('Unable to fetch', err);
    });

    //db.close();
});