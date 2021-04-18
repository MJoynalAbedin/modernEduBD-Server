  const express = require('express')
  const cors = require('cors');
  const MongoClient = require('mongodb').MongoClient;
  require("dotenv").config();
  const ObjectId = require('mongodb').ObjectId;
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"})
  })

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vodjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


  client.connect(err => {
    const courseCollection = client.db("modernEdu").collection("courses");
    const reviewCollection = client.db("modernEdu").collection("reviews");
    const orderCollection = client.db("modernEdu").collection("orders");
    const adminCollection = client.db("modernEdu").collection("admins");

    console.log('db connected');

    app.post('/isAdmin', (req, res) =>{
      const email = req.body.email;
      adminCollection.find({email: email})
      .toArray((err, admin) => {
          console.log(err);
          res.send(admin.length > 0 )
      })
  })

    app.post('/addCourse', (req, res) => {
      const course = req.body;
      console.log(course);
      courseCollection.insertOne(course)
        .then(result => {
          console.log(result.insertedCount);
        })
    })

    app.post('/addAdmin', (req, res) => {
      const admin = req.body;

      console.log(admin);

      adminCollection.insertOne(admin)
        .then(result => {
          res.send(result.insertedCount > 0);
          console.log(result.insertedCount > 0);
        })
    })

    app.delete('/deleteCourse/:id', (req, res) => {
      console.log(req.params.id);
      courseCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        console.log(result.deletedCount)
      })
    })

    app.post('/addReview', (req, res) => {
      const review = req.body;
      console.log("Review", review);
      reviewCollection.insertOne(review)
        .then(result => {
          console.log(result.insertedCount);
        })
    })

    app.post('/addOrder', (req, res) => {
      const newOrder = req.body;
      console.log("Order", newOrder);
      orderCollection.insertOne(newOrder)
        .then(result => {
          console.log(result.insertedCount);
        })
    })

    app.get('/reviews', (req, res) => {
      reviewCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    app.get('/allOrders', (req, res) => {
      orderCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    app.get('/orderList', (req, res) => {
      console.log(req.query.email);
      orderCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    app.get('/courses', (req, res) => {
      courseCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

  });

    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

const port = 5000;

app.listen(process.env.PORT || port)