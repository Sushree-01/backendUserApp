const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/post.routes");
const app = express();
app.use(express.json());
require("dotenv").config();
app.use("/users", userRouter);
app.use("/posts", postRouter);
const PORT=process.env.PORT
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected with db");
  } catch (error) {
    console.log(error);
  }
  console.log(`listening port ${PORT}`);
});