const express = require('express');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mqe77mp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const countCollection = database.collection('country');
    // const countrys = [
    //   {
    //     countryName: 'Bangladesh',
    //     image_url: 'https://i.postimg.cc/V6MksbgF/Bangladesh.png',
    //     description:
    //       "Bangladesh, a country in South Asia, is known for its lush greenery, vibrant culture, and bustling cities. It is home to the world's largest river delta, the Sundarbans mangrove forest, and the ancient archaeological site of Mahasthangarh.",
    //   },
    //   {
    //     countryName: 'Thailand',
    //     image_url: 'https://i.postimg.cc/hPCz5T5J/download.png',
    //     description:
    //       'Thailand, located in Southeast Asia, is famous for its stunning beaches, ornate temples, and delicious cuisine. It boasts bustling markets, vibrant nightlife, and rich cultural heritage, attracting millions of tourists each year.',
    //   },
    //   {
    //     countryName: 'Indonesia',
    //     image_url: 'https://i.postimg.cc/BvHjsVWY/Indonesia.jpg',
    //     description:
    //       'Indonesia, the largest archipelago in the world, is renowned for its diverse landscapes, from lush rainforests to pristine beaches and volcanic mountains. It is home to vibrant cultures, ancient temples, and unique wildlife, such as orangutans and Komodo dragons.',
    //   },
    //   {
    //     countryName: 'Malaysia',
    //     image_url: 'https://i.postimg.cc/NFg9d7zN/international.webp',
    //     description:
    //       'Malaysia, situated in Southeast Asia, is a melting pot of cultures, featuring Malay, Chinese, Indian, and indigenous influences. It is known for its modern cities, tropical rainforests, beautiful islands, and iconic landmarks like the Petronas Twin Towers.',
    //   },
    //   {
    //     countryName: 'Vietnam',
    //     image_url: 'https://i.postimg.cc/BQmDwks2/vietnam.png',
    //     description:
    //       'Vietnam, located on the easternmost part of the Indochinese Peninsula, is celebrated for its stunning natural beauty, rich history, and delicious cuisine. It offers diverse landscapes, from lush rice paddies to limestone karsts, and vibrant cities like Hanoi and Ho Chi Minh City.',
    //   },
    //   {
    //     countryName: 'Cambodia',
    //     image_url: 'https://i.postimg.cc/c4zC3S0k/cambodia.webp',
    //     description:
    //       'Cambodia, home to the magnificent temples of Angkor Wat, is a country in Southeast Asia known for its ancient ruins, rich culture, and warm hospitality. It features lush jungles, picturesque countryside, and the bustling capital city of Phnom Penh.',
    //   },
    // ];

    // countCollection.insertMany(countrys);

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

    app.get('/countrys', async (req, res) => {
      const countrys = countCollection.find();
      const result = await countrys.toArray();
      res.send(result);
    });
    app.get('/allcountry/:countryName', async (req, res) => {
      const result = await productCollection
        .find({ countryName: req.params.countryName.toLowerCase() })
        .toArray();

      res.send(result);
    });

    app.get('/countryDeatils/:id', async (req, res) => {
      const id = req.params.id;
      const qureay = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(qureay);
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
