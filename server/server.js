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
        // Send validated and registered data back
        user = yield usersCollection.findOne({
            email: userInfo.email,
        });
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
// Load User Data
app.get("/getUserData/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.params.id;
    console.log(userID);
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
        // Convert userID to MongoDB ObjectId
        const objectId = new mongodb_1.ObjectId(userID);
        const walletsCollection = client.db("MMM").collection("users");
        const user = yield walletsCollection.findOne({ _id: objectId });
        console.log(user);
        if (!user) {
            res.status(400).json({ message: "No user found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error accessing wallet:", error);
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
        //Convert userID to MongoDB ObjectId
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
app.post("/addWallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (!mongodb_1.ObjectId.isValid(userID)) {
        console.log("Invalid User ID format");
        res.status(400).json({ message: "Invalid User ID format" });
        return;
    }
    try {
        const objectId = new mongodb_1.ObjectId(userID);
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
        }
        else if (method == "mobile") {
            walletsCollection.insertOne({
                type: "mobile",
                carrier: walletInfo.carrier,
                number: walletInfo.number,
                userID: objectId,
            });
        }
        res.status(200).json({ message: "Successfully added wallet" });
    }
    catch (error) {
        console.log("Error inserting wallet: ", error);
        res.status(400).json({ message: "Error inserting wallet" });
        return;
    }
}));
// Add Wallet
app.post("/removeWallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.log("Error inserting wallet: ", error);
        res.status(400).json({ message: "Error inserting wallet" });
        return;
    }
}));
// Deposit or Transfer Balance
app.post("/modifyBalance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletInfo, userID, amount, inquiry } = req.body;
    console.log(req.body);
    if (!userID || !amount || !inquiry) {
        console.log("Missing information");
        res.status(400).json("Missing information");
        return;
    }
    if (!mongodb_1.ObjectId.isValid(userID)) {
        console.log("Invalid User ID format");
        res.status(400).json({ message: "Invalid User ID format" });
        return;
    }
    try {
        const objectId = new mongodb_1.ObjectId(userID);
        const usersCollection = client.db("MMM").collection("users");
        let user = yield usersCollection.findOne({ _id: objectId });
        if (!user) {
            res.status(401).json({ message: "Invalid user" });
            return;
        }
        const computation = inquiry == "deposit"
            ? Number(user === null || user === void 0 ? void 0 : user.balance) + Number(amount)
            : Number(user === null || user === void 0 ? void 0 : user.balance) - Number(amount);
        usersCollection.updateOne({ _id: objectId }, { $set: { balance: computation } });
        res.status(200).json({
            message: "sent deposit",
            user: {
                userID: userID,
                balance: computation,
            },
        });
    }
    catch (error) {
        console.log("Error modifying balance: ", error);
        res.status(400).json({ message: "Error modifying balance" });
        return;
    }
}));
// Edit budget limit
app.post("/editBudgetLimit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, limit } = req.body;
    console.log(userID, limit);
    if (!userID || !limit) {
        console.log("Missing information");
        res.status(400).json("Missing information");
        return;
    }
    if (!mongodb_1.ObjectId.isValid(userID)) {
        console.log("Invalid User ID format");
        res.status(400).json({ message: "Invalid User ID format" });
        return;
    }
    try {
        const objectId = new mongodb_1.ObjectId(userID);
        const usersCollection = client.db("MMM").collection("users");
        let user = yield usersCollection.findOne({ _id: objectId });
        if (!user) {
            res.status(401).json({ message: "Invalid user" });
            return;
        }
        usersCollection.updateOne({ _id: objectId }, { $set: { monthlyLimit: limit } });
        res.status(200).json({
            message: "Budget Limit edited successfully",
            user: {
                userID: userID,
                monthlyLimit: limit,
            },
        });
    }
    catch (error) {
        console.log("Error editing budget limit: ", error);
        res.status(400).json({ message: "Error editing budget limit" });
        return;
    }
}));
app.listen(5000, () => console.log("Server running at PORT 5000"));
