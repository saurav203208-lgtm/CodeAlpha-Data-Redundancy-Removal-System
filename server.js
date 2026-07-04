const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/redundancyDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  }
});

const User = mongoose.model("User", UserSchema);

app.post("/add-user", async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Duplicate Data Found!"
      });
    }

    await User.create({ name, email });

    res.json({
      success: true,
      message: "Data Saved Successfully!"
    });

  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});