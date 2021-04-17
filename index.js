  const express = require('express')
  const cors = require('cors');
  const MongoClient = require('mongodb').MongoClient;
  require("dotenv").config();
  const ObjectId = require('mongodb').ObjectId;
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vodjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


  client.connect(err => {
    const courseCollection = client.db("modernEdu").collection("courses");
    const reviewCollection = client.db("modernEdu").collection("reviews");
    const orderCollection = client.db("modernEdu").collection("orders");

    console.log('db connected')

    app.post('/addCourse', (req, res) => {
      const course = req.body;
      console.log(course);
      courseCollection.insertOne(course)
        .then(result => {
          console.log(result.insertedCount);
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