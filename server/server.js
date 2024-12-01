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
app.use(express_1.default.urlencoded({ extended: true }));
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
        res.status(400).json({ message: "Email and password are required" });
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
                balance: user.balance,
                monthlyLimit: user.monthlyLimit,
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
    const { userInfo, paymentInfo, method } = req.body;
    console.log("Request body:", req.body);
    if (!userInfo || !paymentInfo || !method) {
        console.log("information missing or null");
        res.status(400).json({ message: "information missing or null" });
        return;
    }
    try {
        // Checks and Cancels signing up if user already exist
        const usersCollection = client.db("MMM").collection("users");
        let user = yield usersCollection.findOne({
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
        user = yield usersCollection.findOne({
            email: userInfo.email,
        });
        if (method == "card") {
            walletsCollection.insertOne({
                type: "card",
                userID: user === null || user === void 0 ? void 0 : user._id,
                securityCode: paymentInfo.securityCode,
                name: paymentInfo.cardName,
                cardNumber: paymentInfo.cardNumber,
                expiryDate: paymentInfo.expiryDate,
            });
        }
        else if (method == "mobile") {
            walletsCollection.insertOne({
                type: "mobile",
                userID: user === null || user === void 0 ? void 0 : user._id,
                number: paymentInfo.mobileNumber,
                carrier: paymentInfo.simCarrier,
            });
        }
        else {
            console.log("invalid method");
            res.status(400).json({ message: "invalid method" });
            return;
        }
        //Send validated and registered data back
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user === null || user === void 0 ? void 0 : user._id,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                country: user === null || user === void 0 ? void 0 : user.country,
                state: user === null || user === void 0 ? void 0 : user.state,
                city: user === null || user === void 0 ? void 0 : user.city,
                address: user === null || user === void 0 ? void 0 : user.address,
                email: user === null || user === void 0 ? void 0 : user.email,
                contact: user === null || user === void 0 ? void 0 : user.contact,
                balance: user === null || user === void 0 ? void 0 : user.balance,
                monthlyLimit: user === null || user === void 0 ? void 0 : user.monthlyLimit,
            },
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}));
// Wallets Handler
app.get("/getWallets/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.params.id;
    if (!userID) {
        console.log("User ID is missing");
        res.status(400).json({ message: "User ID is missing" });
        return;
    }
    // Validate the userID format
    if (!mongodb_1.ObjectId.isValid(userID)) {
        console.log("Invalid User ID format");
        res.status(400).json({ message: "Invalid User ID format" });
        return;
    }
    try {
        //Conver userID to MongoDB ObjectId
        const objectId = new mongodb_1.ObjectId(userID);
        const walletsCollection = client.db("MMM").collection("wallets");
        const wallets = yield walletsCollection
            .find({ userID: objectId })
            .toArray();
        console.log(wallets);
        if (wallets.length < 1) {
            console.log("User has no registered wallet");
            res.status(400).json({ message: "User has no registered wallet" });
            return;
        }
        else {
            res.status(200).json({
                wallets: wallets,
            });
        }
    }
    catch (error) {
        console.error("Error accessing wallet:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}));
app.listen(5000, () => console.log("Server running at PORT 5000"));
