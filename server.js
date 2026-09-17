import app from "./src/app.js";
import db from "./src/db/db.js";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database
db();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
