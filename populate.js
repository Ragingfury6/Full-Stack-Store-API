require("dotenv").config();
const connectDB = require("./db/connect");
const Task = require("./models/Task");
const jsonTasks = require("./data/tasks.json");
const uri = process.env.MONGO_URI;

const start = (async () => {
  try {
    await connectDB(uri);
    await Task.deleteMany();
    await Task.create(jsonTasks);
    console.log("Upload Successful");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
