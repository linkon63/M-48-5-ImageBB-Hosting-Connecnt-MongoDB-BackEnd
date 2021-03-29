const express = require('express');
const port =process.env.PORT || 5055;
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World! ')
})
// DB URL/URI By Protected Variable 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ci2re.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// Data Base Connected Code
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    //Showing Errors 
    // console.log('Error is : ',err);

    //Connecting to the DataBase
    const eventCollection = client.db("volunteer").collection("events");
    console.log('Database Connected Successfully By NodeMon');

    //Uploading Client site Data to mongoDB
    app.post('/addEvent', (req,res) => {
        const eventData = req.body;
        console.log('Add New Event Start name', req.body);
        eventCollection.insertOne(eventData)
        .then(result => {
            // console.log('Inserted Count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    //Getting Image form DataBase
    app.get('/events',(req,res) => {
        eventCollection.find().toArray( (err, items) => { 
            res.send(items);
            // console.log('From DataBase : ',items);
        })
    })

    //Delete event from DataBase
    app.delete('/deleteEvent/:id', (req,res) => {
        console.log('Data Delete')
        const id = ObjectID(req.params.id);
        console.log('Delete This', id);
        eventCollection.findOneAndDelete({_id: id})
        .then(data => res.json({success: !!data.value}));
    })



});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})