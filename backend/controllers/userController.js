import userModel from "./../models/userModel.js";
import jwt from "jsonwebtoken"; //Generates and verifies authentication tokens.
import bcrypt from "bcrypt"; //Hashes passwords and verifies them securely.
import validator from "validator"; //it simply checks the format of data like(isEmail,isUrl...)

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // it returns boolean value

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentails" });
    }

    const token = createToken(user._id);
    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};


//create a token function
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


//register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //checking if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    //validating email fomrat and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }
    //hashing user password (encrypting password)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating a new user
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token }); //The token is sent to the frontend and stored (e.g., in localStorage or cookies).
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
