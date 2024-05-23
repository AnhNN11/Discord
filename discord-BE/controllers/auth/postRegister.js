const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // check if user already exists
    const userExists = await User.exists({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // create token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetail: {
        username: user.username,
        token: token,
        email: user.email,
      },
    });
  } catch (error) {
    // return res.status(500).json({ error: error.message });
  }
};

module.exports = postRegister;
