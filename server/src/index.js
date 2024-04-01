const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const http = require("http").Server(app);
require("dotenv").config({ path: "./config.env" });

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const route = require("./routes");

// Route Init
route(app);

http.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
