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
    res.status(400).json({ message: "Email ad password are required" });
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
  } = req.body;
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
