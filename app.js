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
const planRouters = require("./routes/plans.routes");
const paymentRouters = require("./routes/payments.routes");
const subscriptionRouters = require("./routes/subscriptions.routes");
const videoRouters = require("./routes/videos.routes");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost", "http://127.0.0.1"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
app.use("/user", userRouters);
app.use("/admin", adminRouters);
app.use("/creator", creatorRouters);
app.use("/api/plans", planRouters);
app.use("/api/payment", paymentRouters);
app.use("/api", subscriptionRouters);
app.use("/api/videos", express.static("media/uploads"));
app.use("/api/videos", videoRouters);

app.listen(port, async () => {
  await connectDB();
  console.log("Server Running on Port =>", port);
});
