const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//TourVibe66
// 9kUTR2Lj0hKz4xz7

const uri =
  'mongodb+srv://TourVibe66:9kUTR2Lj0hKz4xz7@cluster0.mqe77mp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('ToursDB');
    const productCollection = database.collection('Product');
    app.get('/products', async (req, res) => {
      const products = productCollection.find();
      const result = await products.toArray();
      res.send(result);
    });
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const qureay = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(qureay);
      res.send(result);
    });
    app.get('/myProducts/:email', async (req, res) => {
      const result = await productCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const qureay = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const product = req.body;
      const updateProduct = {
        $set: {
          TouristsSoprt: product.TouristsSoprt,
          countryName: product.countryName,
          location: product.location,
          description: product.description,
          averageCost: product.averageCost,
          seasonality: product.seasonality,
          travelTime: product.travelTime,
          totaVisitorsPerYea: product.totaVisitorsPerYea,
          image: product.image,
        },
      };
      const result = await productCollection.updateOne(
        qureay,
        updateProduct,
        options
      );
      res.send(result);
    });

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const aqurey = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(aqurey);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('This is tarebale server site ');
});

app.listen(port, () => {
  console.log(`This is port server is :${port}`);
});
