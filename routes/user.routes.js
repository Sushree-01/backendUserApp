const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const { blacklist } = require("../blacklist");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, pass, city, age } = req.body;
  try {
    const alreadyUser = await UserModel.find({ email });
    if (alreadyUser.length) {
      return res
        .status(400)
        .json({ error: "Registration failed. User already exists" });
    }
    if (checkPass(pass)) {
      const hashed = bcrypt.hashSync(pass, 10);
      const user = new UserModel({ ...req.body, pass: hashed });
      await user.save();
      res
        .status(200)
        .json({
          msg: "The new user has been registered",
          registeredUser: { ...req.body, pass: hashed },
        });
    } else {
      res
        .status(400)
        .json({
          error:
            "Registration failed! Password should contain atleast one uppercase character, one number & a special character",
        });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          var token = jwt.sign({ userId: user._id }, "payal", {
            expiresIn: 420,
          });
          var Rtoken = jwt.sign({ userId: user._id }, "F", {
            expiresIn: 840,
          });
          res
            .status(200)
            .json({
              msg: "Login successful!",
              token: token,
              refreshToken: Rtoken,
            });
        } else {
          res.status(200).json({ msg: "Wrong Credentials!" });
        }
      });
    } else {
      res.status(200).json({ msg: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.get("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    blacklist.push(token);
    res.status(200).json({ msg: "User has been logged out" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const checkPass = (pass) => {
  if (pass.length < 8) {
    return false;
  }

  let alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let nums = "0123456789";
  let special = "[$&+,:;=?@#|'<>.-^*()%!]";
  let flag1 = false;
  let flag2 = false;
  let flag3 = false;

  for (let i = 0; i < pass.length; i++) {
    if (alph.includes(pass[i])) {
      flag1 = true;
    }

    if (nums.includes(pass[i])) {
      flag2 = true;
    }

    if (special.includes(pass[i])) {
      flag3 = true;
    }
  }
  return flag1 && flag2 && flag3 ? true : false;
};

module.exports = {
  userRouter,
};