//---------------------------------- IMPORTS ----------------------------------------------------------
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const getRoutes = require("./routes/index.js");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;
const app = express();
//-----------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------
app.use(express.json());
app.use(cors());
app.use(express.static(path.join("public")));
//-----------------------------------------------------------------------------------------------------

//--------------------------MONGO DB CONNECTION--------------------------------------------------------
const string = process.env.CONNECTION_STRING;
mongoose
  .connect(string)
  .then((res) => {
    console.log(`Connected to DB `);
  })
  .catch((e) => {
    console.log(e);
  });
//-----------------------------------------------------------------------------------------------------

//----------------------------------- RATE LIMITER ----------------------------------------------------
const limiter = rateLimit({
  //LIMITING 60 Requests in 1 MINUTE
  windowMs: 1 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
//-----------------------------------------------------------------------------------------------------

//------------------------ Using all ROUTES -----------------------------------------------------------
getRoutes(app);
//-----------------------------------------------------------------------------------------------------

//-------------------------- Route Listening ----------------------------------------------------------
app.get("/", (req, res) => {
  res.send("<h1>TourBook backend</h1>");
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/404.html"));
});
//-----------------------------------------------------------------------------------------------------

//---------------------- Server Start -----------------------------------------------------------------
app.listen(port, (req, res) => {
  console.log(`Listening on Port ${port}`);
});
//--------------------------------------------------------------------------------------------------
