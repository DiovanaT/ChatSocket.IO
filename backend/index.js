const cors = require('cors');
const express = require('express');
const pool = require('./db')
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json())
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    },
    allowEIO3: true
});

io.on('connection', socket => {
    console.log('New socket connected:', socket.id)

    socket.on('disconnect', () => {
        console.log('New socket disconnected:', socket.id)    
    })

    socket.on('message', ({ name, message }) => {
        console.log('message:', {name, message})
        io.emit('message', { name, message })
    })
})



//routes
//create a user 
app.post("/", async (req,res)=>{
    try {
        //console.log(req.body)
        const { name, message } = req.body;
        const newUsers = await pool.query("INSERT INTO users (name, message) VALUES($1, $2) RETURNING *",
        [name, message]
        );

        res.json(newUsers.rows[0]);
    }catch(err){
        console.log(err.message)
    }
})

//get all users
app.get("/allusers", async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
    }catch(err){
        console.log(err.message)
    }
});

//get a user
app.get("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const users = await pool.query("SELECT * FROM users WHERE user_id = $1", [id])

        res.json(users.rows[0])
    }catch(err){
        console.log(err.message)
    }
})


//update a user


//delete a user



server.listen(5000, function(){
    console.log('Listening on port 5000')
})