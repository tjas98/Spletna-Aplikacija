const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

require('dotenv').config();

//mongoose.connect(process.env.PUBLIC_URL)

mongoose.connect("mongodb://localhost:27017/")


const db = mongoose.connection
db.once('open', _ => {
    console.log("MONGO Connected")
})




