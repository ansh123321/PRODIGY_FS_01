const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

dns.setServers(["8.8.8.8"]);

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed:", error);
        process.exit(1);
    });