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
// fetch expiring subscriptions and insert notifications
const checkExpiringSubscriptions = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    // Format dates as ISO strings
    const todayISO = today.toISOString().split("T")[0];
    const nextWeekISO = nextWeek.toISOString().split("T")[0];
    const tomorrowISO = tomorrow.toISOString().split("T")[0];
    const subscriptionCollection = db.collection("subscriptions");
    const notificationCollection = db.collection("notifications");
    // Find subscriptions expiring within the next 7 days
    const expiringSubscriptions = yield subscriptionCollection
        .find({
        end: {
            $gte: todayISO,
            $lte: nextWeekISO,
        },
    })
        .toArray();
    // Process the subscriptions and create notifications
    if (expiringSubscriptions.length > 0) {
        for (const sub of expiringSubscriptions) {
            const endDate = new Date(sub.end);
            const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            // Only notify if 7 days or 1 day left
            if (daysLeft === 1 || daysLeft <= 7) {
                const notification = {
                    service: sub.service,
                    price: sub.price,
                    plan: sub.type,
                    userID: sub.userID,
                    daysLeft: daysLeft,
                    dateNotified: today.toLocaleDateString("en-US"), // Format: mm/dd/yyyy
                    alert: "expiration",
                };
                // Check if a notification already exists for this user and subscription
                const existingNotification = yield notificationCollection.findOne({
                    userID: sub.userID,
                    service: sub.service,
                    plan: sub.type,
                });
                if (!existingNotification) {
                    yield notificationCollection.insertOne(notification);
                }
                else {
                    console.log("All expiring subscriptions are stored");
                }
            }
        }
    }
    else {
        console.log("No current expiring subscriptions");
    }
});
// Schedule the job to run periodically (every minute)
setInterval(() => {
    console.log("Watching");
    const db = client.db("MMM");
    checkExpiringSubscriptions(db).catch(console.error);
}, 60 * 1000); // Every minute
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
            balance: 0,
            monthlyLimit: 0,
            activeSubs: 0,
            monthlyExpenses: 0,
        });
        // Send validated and registered data back
        user = yield usersCollection.findOne({
            email: userInfo.email,
        });
        if (!user) {
            console.log("User does not exist");
            res.status(404).json("User does not exist");
            return;
        }
        res.status(200).json({
            message: "Signup successful",
            user: {
                _id: user._id,
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
        // Count Active Subs
        const subscriptionCollection = client
            .db("MMM")
            .collection("subscriptions");
        const subCount = yield subscriptionCollection.countDocuments({
            userID: objectId,
        });
        console.log(subCount);
        const usersCollection = client.db("MMM").collection("users");
        yield usersCollection.updateOne({ _id: objectId }, { $set: { activeSubs: subCount } });
        // Get total monthly expenses for all active services
        const getSubs = subscriptionCollection.find({ userID: objectId });
        const subscriptions = yield getSubs.toArray();
        const monthlyExpenses = subscriptions.reduce((total, sub) => {
            return total + parseFloat(sub.price || 0); // Add subscription price (default to 0 if missing)
        }, 0);
        console.log("Monthly expenses: ", monthlyExpenses);
        // Update user monthlyExpenses
        yield usersCollection.updateOne({ _id: objectId }, { $set: { monthlyExpenses: monthlyExpenses } });
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error accessing wallet:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}));
// Get subscription list
app.get("/getSubscriptions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Convert userID to MongoDB ObjectId
        const objectId = new mongodb_1.ObjectId(userID);
        const subCollection = client.db("MMM").collection("subscriptions");
        // Get the current date
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split("T")[0]; // "yyyy-mm-dd"
        // Find subscriptions that have expired
        const expiredSubscriptions = yield subCollection
            .find({
            userID: objectId,
            end: { $lt: currentDateString }, // Compare as strings
        })
            .toArray();
        console.log("Expired subscriptions:", expiredSubscriptions);
        // Add expiration notification
        const notificationCollection = client
            .db("MMM")
            .collection("notifications");
        if (expiredSubscriptions.length > 0) {
            const today = new Date();
            expiredSubscriptions.forEach((expiredSubscription) => {
                const notification = {
                    service: expiredSubscription.service,
                    price: expiredSubscription.price,
                    plan: expiredSubscription.type,
                    userID: expiredSubscription.userID,
                    daysLeft: "Expired",
                    dateNotified: today.toLocaleDateString("en-US"), // Format: mm/dd/yyyy
                    alert: "expired",
                };
                notificationCollection.insertOne(notification);
            });
            // Remove expired subscriptions from the collection
            yield subCollection.deleteMany({
                userID: objectId,
                end: { $lt: currentDateString }, // Compare as strings
            });
            console.log(`Removed ${expiredSubscriptions.length} expired subscriptions for user ${userID}`);
        }
        // Now, fetch all active subscriptions (not expired)
        const subscriptions = yield subCollection
            .find({ userID: objectId })
            .toArray();
        console.log(subscriptions);
        if (subscriptions.length < 1) {
            console.log("User has no registered subscription");
            res
                .status(400)
                .json({ message: "User has no registered subscriptions" });
            return;
        }
        else {
            res.status(200).json(subscriptions);
        }
    }
    catch (error) {
        console.error("Error accessing wallet:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}));
// Add Subscription
app.post("/addSubscription", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, service, plan } = req.body;
    console.log(userID, service, plan);
    if (!userID || !service || !plan) {
        console.log("Information missing");
        res.status(400).json({ message: "Information missing" });
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
        const subscriptionCollection = client
            .db("MMM")
            .collection("subscriptions");
        const [type, price] = plan.split(" - ");
        // Get start date
        const startDate = new Date();
        const formattedStartDate = startDate
            .toLocaleDateString("en-CA")
            .replace(/\//g, "-"); // Converts current date to yyyy-mm-dd format
        // Get end date
        const nextMonthDate = new Date(startDate);
        nextMonthDate.setMonth(startDate.getMonth() + 1);
        const formattedNextMonthDate = nextMonthDate.toLocaleDateString("en-CA");
        console.log(type, price, formattedStartDate, formattedNextMonthDate);
        yield subscriptionCollection.insertOne({
            userID: objectId,
            service: service,
            type: type,
            price: price,
            start: formattedStartDate,
            end: formattedNextMonthDate,
        });
        // Count and set Active Subs
        const subCount = yield subscriptionCollection.countDocuments({
            userID: objectId,
        });
        const usersCollection = client.db("MMM").collection("users");
        yield usersCollection.updateOne({ _id: objectId }, { $set: { activeSubs: subCount } });
        // Notify user for subscription activation
        const notificationCollection = client
            .db("MMM")
            .collection("notifications");
        const today = new Date();
        const notification = {
            service: service,
            price: price,
            plan: type,
            userID: objectId,
            daysLeft: "Activated",
            dateNotified: today.toLocaleDateString("en-US"), // Format: mm/dd/yyyy
            alert: "activated",
        };
        notificationCollection.insertOne(notification);
        console.log("Sub Count: ", subCount);
        // Get total monthly expenses for all active services
        const getSubs = subscriptionCollection.find({ userID: objectId });
        const subscriptions = yield getSubs.toArray();
        const monthlyExpenses = subscriptions.reduce((total, sub) => {
            return total + parseFloat(sub.price || 0); // Add subscription price (default to 0 if missing)
        }, 0);
        // Subtract price from current wallet balance
        const user = yield usersCollection.findOne({ _id: objectId });
        const updatedBalance = (user === null || user === void 0 ? void 0 : user.balance) - price;
        console.log("updated balance: ", monthlyExpenses);
        // Update user monthlyExpenses
        yield usersCollection.updateOne({ _id: objectId }, { $set: { monthlyExpenses: monthlyExpenses, balance: updatedBalance } });
        const authenticatedUser = yield usersCollection.findOne({
            _id: objectId,
        });
        res.status(200).json(authenticatedUser);
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
        const user = yield usersCollection.findOne({ _id: objectId });
        if (!user) {
            res.status(401).json({ message: "Invalid user" });
            return;
        }
        const computation = inquiry == "deposit"
            ? Number(user === null || user === void 0 ? void 0 : user.balance) + Number(amount)
            : Number(user === null || user === void 0 ? void 0 : user.balance) - Number(amount);
        yield usersCollection.updateOne({ _id: objectId }, { $set: { balance: computation } });
        const authenticatedUser = yield usersCollection.findOne({
            _id: objectId,
        });
        res.status(200).json(authenticatedUser);
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
        const user = yield usersCollection.findOne({ _id: objectId });
        if (!user) {
            console.log("Invalid user");
            res.status(401).json({ message: "Invalid user" });
            return;
        }
        yield usersCollection.updateOne({ _id: objectId }, { $set: { monthlyLimit: limit } });
        const authenticatedUser = yield usersCollection.findOne({
            _id: objectId,
        });
        if (!authenticatedUser) {
            console.log("Invalid user");
            res.status(401).json({ message: "Invalid user" });
            return;
        }
        const { monthlyLimit, monthlyExpenses } = authenticatedUser;
        if (!monthlyLimit || !monthlyExpenses) {
            console.log("Monthly data is incomplete");
            res.status(400).json({ message: "User's monthly data is incomplete" });
            return;
        }
        // Calculate budget percentage
        const budgetPercentage = ((monthlyExpenses / monthlyLimit) * 100).toFixed(2);
        const budgetPercentageNumber = parseFloat(budgetPercentage);
        //Notify user if budget is at 80%, 100%, or more
        if (budgetPercentageNumber === 80 || budgetPercentageNumber >= 100) {
            console.log("Budget Percentage", budgetPercentage);
            const notificationCollection = client
                .db("MMM")
                .collection("notifications");
            const today = new Date();
            const notification = {
                userID: objectId,
                budgetPercentage: budgetPercentageNumber,
                dateNotified: today.toLocaleDateString("en-US"), // Format: mm/dd/yyyy
                alert: "warning",
            };
            yield notificationCollection.insertOne(notification);
        }
        res.status(200).json(authenticatedUser);
    }
    catch (error) {
        console.log("Error editing budget limit: ", error);
        res.status(400).json({ message: "Error editing budget limit" });
        return;
    }
}));
// Send Notification List
app.get("/getNotifications/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const notificationCollection = client
            .db("MMM")
            .collection("notifications");
        const notifications = yield notificationCollection
            .find({ userID: objectId })
            .toArray();
        console.log(notifications);
        if (notifications.length < 1) {
            console.log("User has no current notification");
            res.status(400).json({ message: "User has no current notification" });
            return;
        }
        else {
            res.status(200).json(notifications);
        }
    }
    catch (error) {
        console.error("Error getting notification", error);
        res.status(500).json({ message: "Error getting notification" });
        return;
    }
}));
app.listen(5000, () => console.log("Server running at PORT 5000"));
