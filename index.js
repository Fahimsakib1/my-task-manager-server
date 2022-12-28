const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//require dotenv
require('dotenv').config();


//user Name: task-manager
//password: c0OZ6OXWzVybJWuE
//data base name= my-task-manager

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.c2bp6su.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log("Task Manager URI", uri)




async function run(){
    try{
        const tasksCollection = client.db('my-task-manager').collection('addedTasks');

        //post the tasks to database
        app.post('/addedTasks', async(req, res) => {
            const taskInfo = req.body;
            console.log("Task Info", taskInfo)
            const result = await tasksCollection.insertOne(taskInfo);
            res.send(result);
        })

        //get the tasks by user email
        app.get('/tasks', async(req, res) => {
            const email = req.query.email;
            const query = {userEmail: email};
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })

        //delete a task based on task ID
        app.delete('/deleteTask/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })

        //get a specific task by Task ID
        app.get('/task/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await tasksCollection.findOne(query);
            res.send(result);
        })

        //update task info
        app.put('/task/:id', async(req, res) => {
            const id = req.params.id;
            console.log("Task ID For Update: ", id);
            const updatedTaskInfo = req.body;
            console.log("Updated Task Info", updatedTaskInfo);

            const filter = {_id: ObjectId(id)};
            const option = { upsert: true };
            const updatedTask = {
                $set: {
                    taskName: updatedTaskInfo.taskName,
                    taskDescription: updatedTaskInfo.taskDescription,
                    taskPostedDate: updatedTaskInfo.taskPostedDate,
                    taskImage: updatedTaskInfo.taskImage
                }
            }
            const result = await tasksCollection.updateOne(filter, updatedTask, option)
            res.send(result);

        })


    }
    
    finally {

    }

}
run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('My Task Manager is Running');
})

app.listen(port, (req, res) => {
    console.log("My Task Manager Server is running oon port", port)
});