import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Error loading URI");
}

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log("Error connecting to mongoDB");
    await client.close();
  }
}
run().catch(console.dir);

const app = express();
app.use(cors());
app.use(express.json());

// Services API endpoints
const netflixRoutes = require("./services/netflix");
const spotifyRoutes = require("./services/spotify");
const youtubeRoutes = require("./services/youtube");
const primeRoutes = require("./services/prime");
const hboRoutes = require("./services/hbo");
const disneyRoutes = require("./services/disney");

app.use("/service/netflix", netflixRoutes);
app.use("/service/spotify", spotifyRoutes);
app.use("/service/youtube", youtubeRoutes);
app.use("/service/prime", primeRoutes);
app.use("/service/hbo", hboRoutes);
app.use("/service/disney", disneyRoutes);

//User Sign up / Log in Handler
app.post("/login", (Request, Response) => {
  const { email, password } = Request.body;
});
app.post("/signup", (Request, Response) => {
  const {
    firstName,
    lastName,
    province,
    city,
    zip,
    address,
    email,
    password,
    contact,
  } = Request.body;
});

// Wallets Handler
app.post("/getWallets", (Request, Response) => {});
app.post("/addWallet", (Request, Response) => {});
app.post("/removeWallet", (Request, Response) => {});

//Subscriptions
app.post("/getSubscriptions", (Request, Response) => {});
app.post("/addSubscription", (Request, Response) => {});
app.post("/removeSubscription", (Request, Response) => {});

app.listen(5000, () => console.log("Server running at PORT 5000"));
