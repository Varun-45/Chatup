const express = require("express");
const env = require("dotenv")
const userRoutes = require('./Routes/userRoutes')
const app = express()
const chatRoutes = require("./Routes/chatRoutes")
env.config({ path: '../.env' });
require("./db")
app.use(express.json())
app.get('/', (req, res) => {
    res.send("Fine", console.log("hi"))
})

app.use('/api/user', userRoutes)
app.use("/api/chat", chatRoutes)

const Port = process.env.Port || 5000;
app.listen(Port, console.log(`server started on port ${Port}`))
