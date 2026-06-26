const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());

// Password rotation cycle
const passwordCycle = ["1324", "2435", "3546"];

// File where the current hash is stored
const HASH_FILE = "pass.txt";

// Compute SHA256
function sha256(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

// Load current index or start at 0
let index = 0;

// Initialize file if missing
if (!fs.existsSync(HASH_FILE)) {
    const hash = sha256(passwordCycle[index]);
    fs.writeFileSync(HASH_FILE, hash);
}

// Serve the current hash
app.get("/pass", (req, res) => {
    const hash = fs.readFileSync(HASH_FILE, "utf8").trim();
    res.send(hash);
});

// Rotate to the next password
app.get("/api/next", (req, res) => {
    index = (index + 1) % passwordCycle.length;
    const nextPassword = passwordCycle[index];
    const nextHash = sha256(nextPassword);

    fs.writeFileSync(HASH_FILE, nextHash);

    console.log("Password rotated to:", nextPassword);
    res.send("OK");
});

// Start server
app.listen(3000, () => {
    console.log("Password rotation server running on port 3000");
});
