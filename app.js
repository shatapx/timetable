const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const app = express();

const PORT = config.get("port");

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => {
      console.log(`Started on ${PORT}`);
    });
  } catch (error) {
    console.log("Error", errror.message);
    process.exit(1);
  }
}

start();
