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




async function run() {
    try {
        const tasksCollection = client.db('my-task-manager').collection('addedTasks');
        const commentsCollection = client.db('my-task-manager').collection('addedComments');

        //post the tasks to database
        app.post('/addedTasks', async (req, res) => {
            const taskInfo = req.body;
            console.log("Task Info", taskInfo)
            const result = await tasksCollection.insertOne(taskInfo);
            res.send(result);
        })

        //get the tasks by user email
        app.get('/tasks', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })

        //delete a task based on task ID
        app.delete('/deleteTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })

        //get a specific task by Task ID
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.findOne(query);
            res.send(result);
        })

        //update task info
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Task ID For Update: ", id);
            const updatedTaskInfo = req.body;
            console.log("Updated Task Info", updatedTaskInfo);

            const filter = { _id: ObjectId(id) };
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

        //get a specific task by Task ID for complete Task Route
        app.get('/completeTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.findOne(query);
            res.send(result);
        })

        //update the status of the completed button when The Complete task Button is clicked
        app.put('/completeTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedTask = {
                $set: {
                    isCompleted: true,
                }
            }
            const result = await tasksCollection.updateOne(filter, updatedTask, option)
            res.send(result);
        })

        //get only the complete Tasks for the display Completed Task Route
        app.get('/displayCompletedTasks', async (req, res) => {
            const email = req.query.email;
            const query = { isCompleted: true, userEmail: email };
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })

        //get a specific task by Task ID for complete Task Route
        app.get('/notCompleteTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.findOne(query);
            res.send(result);
        })

        //update the status of the completed button when Not Complete Button is Clicked
        app.put('/notCompleteTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedTask = {
                $set: {
                    isCompleted: false,
                }
            }
            const result = await tasksCollection.updateOne(filter, updatedTask, option)
            res.send(result);
        })

        //update the status of the completed button when Not Complete Button is Clicked
        app.post('/addComment', async (req, res) => {
            const commentInfo = req.body;
            const result = await commentsCollection.insertOne(commentInfo);
            res.send(result);
        })

         //get all the comment based on tasks main ID (filtered by the ID When the task was added)
        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { taskMainID: id };
            const result = await commentsCollection.find(query).toArray();
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