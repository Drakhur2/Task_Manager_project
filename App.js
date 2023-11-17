const express = require("express");
const cors = require('cors')
const connectDB = require("./connect.js");
const tasks = require('./Task.js');

const app = express();
const port = 3000;
const appName = "Task Manager";


const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors('no-cors'));
app.use(express.static("public"));

// API endpoint to get all tasks
app.get("/tasks", async (req, res) => {
    try {
        console.log("Get Called");
        const tsks = await tasks.find();
        
        res.status(200).json({tsks});
    } catch (error) {
        res.status(500).json({ msg: error});
    };
});

app.put("/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const updateData = { name: req.body.name, completed: req.body.completed };
        const existingTask = await tasks.findById(taskId);

        if (!existingTask) {
            return res.status(404).send(`No Task with the id ${taskId}`);
        }

        // Check if the update is necessary
        if (existingTask.name === updateData.name && existingTask.completed === updateData.completed) {
            return res.status(200).send("No update needed, data is the same");
        }

        const updatedTask = await tasks.findByIdAndUpdate(taskId, updateData, { new: true });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});


// API endpoint to delete a task
app.delete("/tasks/:id", async (req, res) => {
    try {

        console.log("Delete called");
        const deletedTask = await tasks.findByIdAndDelete(req.params.id);
        console.log(req.body.id);
        console.log("testing");
        console.log('Task deleted successfully');
        res.status(200).send("Successfully deleted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', async (req, res) =>{
    // let task;
    try{
        console.log('trying to load tasks');
        const checkTask = await tasks.find();
        let checker = checkTask;
        for (let i=0;i<checker.length;i++){
            if (checker[i].name == req.body.name){
                console.log("found a match");
                throw 'Duplicate entry';
                }
            }
        const addNewTask = await tasks.create(req.body);              //tried to use the findOne function however, the
        
        res.status(200).json(addNewTask);
        console.log("successes");
    }catch(error){
        res.status(400).send(error);
    }
});


const start = async () =>{
    try{
        // Connecting to the database
        await connectDB();
        app.listen(port, ()=> console.log(`${appName} is running on port: ${port}`));
    }catch(error){
        console.log(error);
    };

}

start();