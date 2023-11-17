const mongoose = require('mongoose');

const uri = 'mongodb+srv://Team5:1234@cluster0.glhvt.mongodb.net/TM-T5?retryWrites=true&w=majority';


const connectDB = () =>{
    return mongoose.connect(uri);
}
module.exports = connectDB;