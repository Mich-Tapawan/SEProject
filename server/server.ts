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
    console.error("Error connecting to mongoDB", error);
  }
}
run().catch(console.dir);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// User Log In
app.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const usersCollection = client.db("MMM").collection("users");

    const user = await usersCollection.findOne({ email, password });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        state: user.state,
        city: user.city,
        address: user.address,
        email: user.email,
        contact: user.contact,
        balance: user.balance,
        monthlyLimit: user.monthlyLimit,
      },
    });
    return;
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

// User Sign Up
app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { userInfo, paymentInfo, method } = req.body;
  console.log("Request body:", req.body);

  if (!userInfo || !paymentInfo || !method) {
    console.log("information missing or null");
    res.status(400).json({ message: "information missing or null" });
    return;
  }

  // Checks and Cancels signing up if user already exist
  const usersCollection = client.db("MMM").collection("users");
  let user = await usersCollection.findOne({
    email: userInfo.email,
  });

  if (user) {
    console.log("This account already exists");
    res.status(400).json({ message: "This account already exists" });
    return;
  }

  // Adds user document to the users collection
  usersCollection.insertOne({
    email: userInfo.email,
    password: userInfo.password,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    contact: userInfo.contact,
    address: userInfo.address,
    country: userInfo.country,
    state: userInfo.state,
    city: userInfo.city,
    balance: "0",
    monthlyLimit: "0",
  });

  // Register wallet for newly signed user
  const walletsCollection = client.db("MMM").collection("wallets");
  user = await usersCollection.findOne({
    email: userInfo.email,
    password: userInfo.password,
  });

  if (!user) {
    console.log("No user found");
    res.status(400).json("No user found");
    return;
  }

  if (method == "card") {
    walletsCollection.insertOne({
      type: "card",
      userID: user?._id,
      securityCode: paymentInfo.securityCode,
      name: paymentInfo.cardName,
      cardNumber: paymentInfo.cardNumber,
      expiryDate: paymentInfo.expiryDate,
    });
  } else if (method == "mobile") {
    walletsCollection.insertOne({
      type: "mobile",
      userID: user?._id,
      number: paymentInfo.mobileNumber,
      carrier: paymentInfo.simCarrier,
    });
  } else {
    console.log("invalid method");
    res.status(400).json({ message: "invalid method" });
    return;
  }

  //Send validated and registered data back
  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      state: user.state,
      city: user.city,
      address: user.address,
      email: user.email,
      contact: user.contact,
      balance: user.balance,
      monthlyLimit: user.monthlyLimit,
    },
  });
});

// Wallets Handler
app.post("/getWallet", async (req: Request, res: Response): Promise<void> => {
  const { userID } = req.body;

  if (!userID) {
    res.status(400).json({ message: "User ID is missing" });
    return;
  }

  try {
    const walletsCollection = client.db("MMM").collection("walllets");
  } catch (error) {
    console.error("Error accessing wallet:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

app.listen(5000, () => console.log("Server running at PORT 5000"));
