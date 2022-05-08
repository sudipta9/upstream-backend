const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database Connected");
      });
  } catch (error) {
    console.log(error);
  }
};

const port = process.env.PORT;
const app = express();

const userRouters = require("./routes/users.routes");
const adminRouters = require("./routes/admins.routes");
const creatorRouters = require("./routes/creators.routes");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://10.10.2.66:3000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
app.use("/user", userRouters);
app.use("/admin", adminRouters);
app.use("/creator", creatorRouters);

app.listen(port, async () => {
  await connectDB();
  console.log("Server Running on Port =>", port);
});
