require('./config/config');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var { authenticate } = require('./middleware/authenticate');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        })
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(msg);
    }

    var msg = 'No todo exists with this ID';

    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.status(200).send({
                todo
            });
        })
        .catch((e) => res.status(404).send(e))

})

app.delete('/todos/:id', (req, res) => {
    // Get the ID
    var id = req.params.id;

    // Validate ID ? 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove todo by ID
    Todo.findByIdAndRemove(id)
        .then((todo) => {
            // ERR - no todo by that ID
            if (!todo) {
                return res.status(404).send();
            }
            // Succ
            res.status(200).send({
                todo
            })
        })
        .catch((e) => {
            res.status(404).send(e);
        })
})

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    // Validate ID ? 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
            new: true
        })
        .then((todo) => {

            if (!todo) {
                res.status(404).send();
            }

            res.send({
                todo
            })

        })
        .catch((e) => {
            res.status(400).send();
        })
})

app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((e) => {
            res.status(400).send(e);
        });

});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}