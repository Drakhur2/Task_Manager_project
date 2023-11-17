const Task = require('mongoose');
//const { Schema, model } = mongoose;

const taskSchema = Task.Schema({
    name:{
        type: String,
        required: [true, "A Task name is needed"],
        maxlength:[50, "It's not a journal"]
    },
    completed:{
        type: Boolean,
        default: false
    }
});
console.log('connection established');

module.exports = Task.model('tasks', taskSchema);