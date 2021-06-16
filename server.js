const express = require('express')
const app = express()
require('dotenv').config({ path: './config/config.env'});
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Models
const Todo = require('./models/todo');

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Set public folder
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to Database!");
})
.catch((err)=>{
    console.err("Error occurred connecting to Mongo");
})

// Routes

// Get all ToDos
app.get('/', async (req, res)=> {
    // Get all Todos
    const todos = await Todo.find();
    console.log(todos);

    res.render('home', { todos });
})

app.get('/todo/new', (req, res)=>{
    res.render('addToDo');
})

app.post('/todo/new', async (req, res)=>{
    // destructure the ToDo
    const { name, description } = req.body;
    try {
    // Add it to DB
    const todo = await Todo.create({ name, description})

    res.redirect('/');
    }
    catch(err) {
        console.log(err);
    }
    
})

// UPDATE PUT
app.get("/todo/:id/edit", async (req, res)=>{
    const id = req.params.id;
    // get todo with id
    const todo = await Todo.findById(id);
    res.render('editTodo', { todo })
})
app.put("/todo/:id/edit", async (req, res)=> {
    const id = req.params.id;

    const todo = await Todo.findByIdAndUpdate(id, {name: req.body.name, description: req.body.description})
    
    res.redirect('/');
})


// DELETE



app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})