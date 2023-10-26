const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/post.routes");
const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);


app.get("/",(req,res)=>{
    try {
      res.status(200).send("Welcome to user post app")  
    } catch (error) {
        console.log(error);
    }
})
// app.listen(PORT, async () => {
//   try {
//     await connection;
//     console.log("connected with db");
//   } catch (error) {
//     console.log(error);
//   }
//   console.log(`listening port ${PORT}`);
// });