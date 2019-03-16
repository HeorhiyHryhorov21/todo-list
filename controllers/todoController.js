var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://hryhorov_hv:Qawsedrftgyh77@cluster0-shard-00-00-1mixm.mongodb.net:27017,cluster0-shard-00-01-1mixm.mongodb.net:27017,cluster0-shard-00-02-1mixm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });

//Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
var urlendodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app) {

    app.get('/todo', function(req, res) {
        //get data from mongoDB and pass it to view
        Todo.find({}, function (err, data)  {
            if (err) throw  err;
            res.render('todo', {todos: data});
        });

    });

    app.post('/todo', urlendodedParser, function(req, res) {
        //get data from the view and add it to mongoDB
        var newTodo = Todo(req.body).save(function(err,data) {
            if (err) throw  err;
            res.json(data);
        });

    });

    app.delete('/todo/:item', function(req, res) {
        //delete the requested item from mongoDB
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    });
};