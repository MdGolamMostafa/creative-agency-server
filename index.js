const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express(); 
app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cr2af.mongodb.net/
${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', function(req, res) { 
    res.send('Bismillah hirrah manir rahim');
})


const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("creativeAgency").collection("services");
    const feedbackCollection = client.db("creativeAgency").collection("feedback");
    const orderCollection = client.db("creativeAgency").collection("order");
    const adminCollection = client.db("creativeAgency").collection("admin");
    
    console.log('db connected'); 

    // app.post('/',(req, res) => {
    //     const service = req.body
    //     serviceCollection.insertMany(service)
    //     .then(response => {
    //         console.log(response.insertedCount);
    //         res.send(response.insertedCount)
    //     })
    // })

    // app.post('/',(req, res) => {
    //     const feedback = req.body
    //     feedbackCollection.insertMany(feedback)
    //     .then(response => {
    //         console.log(response.insertedCount);
    //         res.send(response.insertedCount)
    //     })
    // })

    app.get('/services', (req, res) => {  
        serviceCollection.find({})
        .toArray((err, service) =>{
            // console.log(err);
            res.send(service);
        })
    })

    app.get('/feedback', (req, res) => {
        feedbackCollection.find({})
        .toArray((err, feedback) =>{
            // console.log(err);
            res.send(feedback); 
        })
    })

    app.post('/addFeedback' , (req, res) => {
        const feedback = req.body;
        feedbackCollection.insertOne(feedback)
            .then(response => {
                res.send(response.insertedCount > 0);
                console.log("Feedback data added");
            })
    })

    app.post('/addOrder', (req, res) => {

        
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
        .then((data) => {
            console.log(data,"new data added");
            res.send(data.insertedCount > 0);
        })
    })

    //admin
    app.post('/admin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({email:email})
        .toArray((err,admin) => {
            res.send(admin.length > 0)
        })
    });

    // CUSTOMER
    app.post('/customer', (req, res) => {
        const email = req.body.email;
        serviceCollection.find({email:email})
        .toArray((err,customer) => {
            res.send(customer.length > 0)
        })
    })


    // app.post('/addOrder', (req,res) => {
    //     console.log('form information');
    //     const file = req.files.file;
       
    //     const title = req.body.title;
    //     // const email = req.body.email;
    //     const description = req.body.description;
    //     const price = req.body.price;
    //     const newImage = file.data;
    //     const encImg = newImage.toString('base64');

    //     var image = {
    //         contentType:file.mimetype,
    //         size:file.size,
    //         img:Buffer.from(encImg,'base64')

    //     }

    //     // const newOrder = req.body;
    //     orderCollection.insertOne({title,description,image,price})
    //     .then((data) => {
    //         console.log(data,"new data added");
    //         res.send(data.insertedCount > 0);
    //     })
    // })

});
app.listen(process.env.PORT || port);


