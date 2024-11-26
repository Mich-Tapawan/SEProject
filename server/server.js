"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
require("dotenv/config");
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Error loading URI");
}
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            yield client.connect();
            // Send a ping to confirm a successful connection
            yield client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        }
        catch (error) {
            console.error("Error connecting to mongoDB", error);
        }
    });
}
run().catch(console.dir);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email ad password are required" });
        return;
    }
    try {
        const usersCollection = client.db("MMM").collection("users");
        const user = yield usersCollection.findOne({ email, password });
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
            },
        });
        return;
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}));
// User Sign Up
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, province, city, zip, address, email, password, contact, } = req.body;
}));
// Wallets Handler
app.post("/getWallets", (Request, Response) => { });
app.post("/addWallet", (Request, Response) => { });
app.post("/removeWallet", (Request, Response) => { });
//Subscriptions
app.post("/getSubscriptions", (Request, Response) => { });
app.post("/addSubscription", (Request, Response) => { });
app.post("/removeSubscription", (Request, Response) => { });
app.listen(5000, () => console.log("Server running at PORT 5000"));
