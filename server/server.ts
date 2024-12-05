import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
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
  const { userInfo } = req.body;
  console.log("Request body:", req.body);

  if (!userInfo) {
    console.log("information missing or null");
    res.status(400).json({ message: "information missing or null" });
    return;
  }

  try {
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

    // Send validated and registered data back
    user = await usersCollection.findOne({
      email: userInfo.email,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        country: user?.country,
        state: user?.state,
        city: user?.city,
        address: user?.address,
        email: user?.email,
        contact: user?.contact,
        balance: user?.balance,
        monthlyLimit: user?.monthlyLimit,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

// Load User Data
app.get(
  "/getUserData/:id",
  async (req: Request, res: Response): Promise<void> => {
    const userID = req.params.id;
    console.log(userID);
    if (!userID) {
      console.log("User ID is missing");
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    // Validate the userID format
    if (!ObjectId.isValid(userID)) {
      console.log("Invalid User ID format");
      res.status(400).json({ message: "Invalid User ID format" });
      return;
    }

    try {
      // Convert userID to MongoDB ObjectId
      const objectId = new ObjectId(userID);

      const walletsCollection = client.db("MMM").collection("users");
      const user = await walletsCollection.findOne({ _id: objectId });
      console.log(user);

      if (!user) {
        res.status(400).json({ message: "No user found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error accessing wallet:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

// Wallets Handler
app.get(
  "/getWallets/:id",
  async (req: Request, res: Response): Promise<void> => {
    const userID = req.params.id;
    if (!userID) {
      console.log("User ID is missing");
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    // Validate the userID format
    if (!ObjectId.isValid(userID)) {
      console.log("Invalid User ID format");
      res.status(400).json({ message: "Invalid User ID format" });
      return;
    }

    try {
      //Convert userID to MongoDB ObjectId
      const objectId = new ObjectId(userID);

      const walletsCollection = client.db("MMM").collection("wallets");
      const wallets = await walletsCollection
        .find({ userID: objectId })
        .toArray();
      console.log(wallets);
      if (wallets.length < 1) {
        console.log("User has no registered wallet");
        res.status(400).json({ message: "User has no registered wallet" });
        return;
      } else {
        res.status(200).json({
          wallets: wallets,
        });
      }
    } catch (error) {
      console.error("Error accessing wallet:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

app.post("/addWallet", async (req: Request, res: Response): Promise<void> => {
  const { walletInfo } = req.body;
  console.log(walletInfo);

  const userID = walletInfo.userID;
  const method = walletInfo.type;

  if (!userID) {
    console.log("User ID is missing");
    res.status(400).json({ message: "User ID is missing" });
    return;
  }

  // Validate the userID format
  if (!ObjectId.isValid(userID)) {
    console.log("Invalid User ID format");
    res.status(400).json({ message: "Invalid User ID format" });
    return;
  }

  try {
    const objectId = new ObjectId(userID);

    const walletsCollection = client.db("MMM").collection("wallets");
    if (method == "card") {
      walletsCollection.insertOne({
        type: "card",
        securityCode: walletInfo.securityCode,
        name: walletInfo.cardName,
        cardNumber: walletInfo.cardNumber,
        expiryDate: walletInfo.expiryDate,
        userID: objectId,
      });
    } else if (method == "mobile") {
      walletsCollection.insertOne({
        type: "mobile",
        carrier: walletInfo.carrier,
        number: walletInfo.number,
        userID: objectId,
      });
    }

    res.status(200).json({ message: "Successfully added wallet" });
  } catch (error) {
    console.log("Error inserting wallet: ", error);
    res.status(400).json({ message: "Error inserting wallet" });
    return;
  }
});

// Add Wallet
app.post(
  "/removeWallet",
  async (req: Request, res: Response): Promise<void> => {
    const { number } = req.body;
    console.log(number);

    if (!number) {
      console.log("Number is missing");
      res.status(400).json({ message: "Number is missing" });
      return;
    }

    try {
      const walletsCollection = client.db("MMM").collection("wallets");
      walletsCollection.deleteOne({ number: number });
      walletsCollection.deleteOne({ cardNumber: number });
      console.log("Wallet Deleted");
      res.status(200).json("Wallet deleted");
    } catch (error) {
      console.log("Error inserting wallet: ", error);
      res.status(400).json({ message: "Error inserting wallet" });
      return;
    }
  }
);

// Deposit or Transfer Balance
app.post(
  "/modifyBalance",
  async (req: Request, res: Response): Promise<void> => {
    const { walletInfo, userID, amount, inquiry } = req.body;
    console.log(req.body);

    if (!userID || !amount || !inquiry) {
      console.log("Missing information");
      res.status(400).json("Missing information");
      return;
    }

    if (!ObjectId.isValid(userID)) {
      console.log("Invalid User ID format");
      res.status(400).json({ message: "Invalid User ID format" });
      return;
    }

    try {
      const objectId = new ObjectId(userID);
      const usersCollection = client.db("MMM").collection("users");
      let user = await usersCollection.findOne({ _id: objectId });

      if (!user) {
        res.status(401).json({ message: "Invalid user" });
        return;
      }

      const computation =
        inquiry == "deposit"
          ? Number(user?.balance) + Number(amount)
          : Number(user?.balance) - Number(amount);

      usersCollection.updateOne(
        { _id: objectId },
        { $set: { balance: computation } }
      );

      res.status(200).json({
        message: "sent deposit",
        user: {
          userID: userID,
          balance: computation,
        },
      });
    } catch (error) {
      console.log("Error modifying balance: ", error);
      res.status(400).json({ message: "Error modifying balance" });
      return;
    }
  }
);

// Edit budget limit
app.post(
  "/editBudgetLimit",
  async (req: Request, res: Response): Promise<void> => {
    const { userID, limit } = req.body;
    console.log(userID, limit);

    if (!userID || !limit) {
      console.log("Missing information");
      res.status(400).json("Missing information");
      return;
    }

    if (!ObjectId.isValid(userID)) {
      console.log("Invalid User ID format");
      res.status(400).json({ message: "Invalid User ID format" });
      return;
    }

    try {
      const objectId = new ObjectId(userID);
      const usersCollection = client.db("MMM").collection("users");
      let user = await usersCollection.findOne({ _id: objectId });

      if (!user) {
        res.status(401).json({ message: "Invalid user" });
        return;
      }

      usersCollection.updateOne(
        { _id: objectId },
        { $set: { monthlyLimit: limit } }
      );

      res.status(200).json({
        message: "Budget Limit edited successfully",
        user: {
          userID: userID,
          monthlyLimit: limit,
        },
      });
    } catch (error) {
      console.log("Error editing budget limit: ", error);
      res.status(400).json({ message: "Error editing budget limit" });
      return;
    }
  }
);

app.listen(5000, () => console.log("Server running at PORT 5000"));
