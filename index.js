const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');

require('dotenv').config()

const app = express(); 
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('pictures'));
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cr2af.mongodb.net/
${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', function(req, res) { 
    res.send('working working ');
})

const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const feedbackCollection = client.db("creativeAgency").collection("feedback");
    const serviceCollection = client.db("creativeAgency").collection("services");
    const orderCollection = client.db("creativeAgency").collection("order");
    const adminCollection = client.db("creativeAgency").collection("admin");

    app.post('/isUser', (req, res) => {
      const email = req.body.email;
      feedbackCollection.find({ email: email })
        .toArray((err, user) => {
          res.send(user.length > 0);
        })
    });

    app.post('/AddService', (req, res) => {
      const file = req.files.file;
      const title = req.body.title;
      const description = req.body.description;
      const newImg = file.data;
      const encImg = newImg.toString('base64');
  
      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
      };
      serviceCollection.insertOne({ image, title, description })
        .then(result => {
          res.send(result.insertedCount > 0)
        })
    });

    app.post('/addOrder', (req, res) => {
      const file = req.files.file;
      const name = req.body.name;
      const email = req.body.email;
      const title = req.body.title;
      const description = req.body.description;
      const price = req.body.price;
      const newImg = file.data;
      const encImg = newImg.toString('base64');
  
      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
      };
      orderCollection.insertOne({ image, name, email, title, price, description })
        .then(result => {
          res.send(result.insertedCount > 0)
        })
    });

    app.post('/AddService', (req, res) => {
      const file = req.files.file;
      const title = req.body.title;
      const description = req.body.description;
      const newImg = file.data;
      const encImg = newImg.toString('base64');
  
      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
      };
      serviceCollection.insertOne({ image, title, description })
        .then(result => {
          res.send(result.insertedCount > 0)
        }) 
    });
      
    app.get('/getUserServices', (req, res) => {
      adminCollection.find({})
      .toArray((err, service) =>{
          res.send(service); 
      })
  });

    app.post('/createAdmin', (req, res) => {
      const userInfo = req.body
      adminCollection.insertOne(userInfo)
        .then(result => {
          res.send(result.insertedCount > 0)
        })
    });

    app.post('/addReview', (req, res) => {
      const userInfo = req.body
      feedbackCollection.insertOne(userInfo)
        .then(result => {
          res.send(result.insertedCount > 0)
        })
    });

    app.get('/servicesProduct', (req, res) => {
      serviceCollection.find({})
        .toArray((err, docs) => res.send(docs));
    });

    app.get('/feedback', (req, res) => {
      feedbackCollection.find({}).limit(3)
      .toArray((err, feedback) =>{
          res.send(feedback); 
      })
  });

    app.post('/addReview', (req, res) => {
      const review = req.body;
      feedbackCollection.insertOne(review)
        .then(result => {
          res.send(result.insertedCount > 0);

        })
    });

    app.get('/orders', (req, res) => {
        orderCollection.find({ email: req.query.email }).limit(3)
          .toArray((err, docs) => {
            res.send(docs)
          })
      });

      app.post('/addOrder', (req, res) => {
        const file = req.files.file; 
        const name = req.body.name;
        const email = req.body.email;
        const serviceName = req.body.serviceName;
        const details = req.body.details;
        const price = req.body.price;
        const icon = req.body.icon;
        const newImg = req.files.file.data;
        const encodedImg = newImg.toString('base64');
        const image = {
          contentType: file.mimetype,
          size: file.size,
          img: Buffer.from(encodedImg, 'base64')
        }
        orderCollection.insertOne({ name, email, serviceName, details, price, image, icon })
          .then(result => {
            res.send(result.insetedCount > 0)
          })
      });
    
    app.get('/services', (req, res) => {  
        serviceCollection.find({})
        .toArray((err, service) =>{
            res.send(service);
        })
    })
   
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
        .then((data) => {
            res.send(data.insertedCount > 0);
        })
    })

    app.post('/admin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({email:email})
        .toArray((err,admin) => {
            res.send(admin.length > 0)
        })
    });

    app.post('/customer', (req, res) => {
        const email = req.body.email;
        serviceCollection.find({email:email})
        .toArray((err,customer) => {
            res.send(customer.length > 0)
        })
    })

});
app.listen(process.env.PORT || port);