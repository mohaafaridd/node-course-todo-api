require('./config/config');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var { authenticate } = require('./middleware/authenticate');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save()
        .then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id }).then((todos) => {
        res.send({
            todos
        })
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(msg);
    }

    var msg = 'No todo exists with this ID';



    Todo.findOne({
        _id: id,
        _creator: req.user._id
    })
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

app.delete('/todos/:id', authenticate, (req, res) => {
    // Get the ID
    var id = req.params.id;

    // Validate ID ? 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove todo by ID
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    })
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, { $set: body }, { new: true })
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

// POST /users/login
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send();
    })
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}