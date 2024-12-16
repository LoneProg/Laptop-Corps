/*
The laptop4dev project is an initiative that gives laptops to
people learning new tech skills.

It's that time of the year to give new laptops to people. It consists of:

- Endpoint to accept data of interested applicants (Data to take are first name, 
  last name, email address, 
  phone no, why you need the laptop)

- Endpoint to view all applicants data

- Endpoint to know total number of applicants
*/
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const port = 4000;

app.use(express.json());

const db = async () => {
  try {
    await mongoose.connect(process.env.DB_STRING);
    console.log("Connected to the Database Successfully");
  } catch (error) {
    console.log(error);
    console.log(`Error connecting to the database ${error}`);
  }
};

db();

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema)

app.get("/", async (req, res) => {
  res.send("Hello, welcome to the Laptop-Corps API!");
});

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastname, password, email, phoneNumber, reason } = req.body;
    if (!firstName || !lastname  || !password || !email || !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Please fill up the required fields" });
    }
    const encryptedPass = await encrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastname,
      password: encryptedPass,
      email,
      phoneNumber,
      reason,
    });
    const registeredUser = await user.save();
    res.status(201).json({ message: "Signup successful!" });
    console.log("New user created");
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/usersData", async(req,res) => {
  try {
    const userList = await User.find({}, '-password')
    res.status(200).json({userList})
    console.log("All users printed out successfully");
    
  } catch (error) {
    console.log("Error in /users-list:", error);
    res.status(500).json({error: "Internal Server error"})
  }
})

app.get("/numberOfUsers", async(req, res)=>{
  try {
    const numberOfUsers = await User.countDocuments()
    res.status(200).json({numberOfUsers});
    console.log("Total number of users printed out successfully:", numberOfUsers);
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Internal Server error"});
  }
});

app.listen(port, async () => {
  console.log(`listening on port ${port}`);
});
