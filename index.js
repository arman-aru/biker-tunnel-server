const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//middle wares

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}}@cluster0.iayvwkl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    const placeCollection = client.db("timetogo").collection("place");
    // const orderCollection = client.db("timetogo").collection("order");

    app.get("/place", async (req, res) => {

      const query = {};
      const data = placeCollection.find(query);
      const cursor = await data.limit(3).toArray();
      res.send(cursor);
    });
    app.get("/place/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const place = await placeCollection.findOne(query);
      res.send(place);
    });

    app.get("/allPlace", async (req, res) => {
      const query = {};
      const data = placeCollection.find(query).sort({ price: -1 });
      const cursor = await data.toArray();
      res.send(cursor);
    });

    //add korbo Places

    app.post("/allPlace", async (req, res) => {
      const place = req.body;
      const result = await placeCollection.insertOne(place);
      res.send(result);
    });

    app.get("/allPlace/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const place = await placeCollection.findOne(query);
      res.send(place);
    });

    //orders api
    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const place = await orderCollection.findOne(query);
      res.send(place);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    //Update
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          message: user.message,
        },
      };

      const result = await orderCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    // delete
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send(`<h1>Biker Tunnel Server is Running</h1>`);
});

app.listen(port);
