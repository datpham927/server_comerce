const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/index");

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.REACT_API_URL_CLIENT || "http://localhost:3000",
  })
);
const port = process.env.PORT || 4000;

routes(app);
mongoose
  .connect(process.env.CONNECT_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected!"))
  .catch((err) => console.log("Connect error", err));

app.listen(port, () => console.log(port));
