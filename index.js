const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDatabase = require("./src/config/database");
const { errorHandler } = require('./src/middleware/ErrorHandler');
// database Connection
const  authRoutes = require('./src/Routes/authRoutes')
const cookieParser = require('cookie-parser')
connectDatabase()

const app = express();

const corsOptions = {
  origin: '*',
}
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser())

app.use('/api/user', authRoutes);

app.use(errorHandler)

app.listen(PORT, () => {
  console.log("Server is running on", PORT)
});



