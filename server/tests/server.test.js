const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');
const {
    app
} = require('./../server');

const {
    Todo
} = require('./../models/todo');

const todos = [
    {
    _id: new ObjectID(),
    text: 'First Test Todo',
    }, {
    _id: new ObjectID(),
    text: 'Second Test Todo',
    completed: true,
    completedAt: 333
    }
]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {

        var text = 'Test todo text';

        request(app)
            // posts data into database
            .post('/todos')
            .send({
                text
            })
            // expected values
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            // test return
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })

    })

    it('should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })

    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
})

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${(new ObjectID).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object IDs', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });

})

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexID).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should return 404 if todo not found', (done) => {
        var hexID = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid ObjectID', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    })
})

describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {
        // Grab ID
        var hexID = todos[0]._id.toHexString();
        var text = 'Test Text';
        // update text, set completed to true
        request(app)
            // posts data into database
            .patch(`/todos/${hexID}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        // Grab ID
        var hexID = todos[1]._id.toHexString();
        var text = 'Test Text 3a3a3a3a';
        // update text, set completed to false
        request(app)
            // posts data into database
            .patch(`/todos/${hexID}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toNotExist();
            }).end(done)
    });

})